import { EquipmentSlot, ItemStack, system, world } from "@minecraft/server";

const LIGHT_ID = "bellity:sun_bigman_light";
const LIGHT_BALL_ID = "bellity:light_ball";
const EXTRA_KNOCKBACK_STRENGTH = 0.4;
const DROP_ITEMS = [
  "minecraft:apple",
  "minecraft:coal",
  "minecraft:iron_ingot",
  "minecraft:gold_ingot",
  "minecraft:redstone",
  "minecraft:lapis_lazuli",
  "minecraft:emerald",
  "minecraft:diamond",
];

const lastThrowTick = new Map();
const lightProjectiles = new Set();

function dropRandomItem(event) {
  if (!event.hadEffect) return;

  try {
    const itemId = DROP_ITEMS[Math.floor(Math.random() * DROP_ITEMS.length)];
    event.hitEntity.dimension.spawnItem(new ItemStack(itemId, 1), event.hitEntity.location);
  } catch (error) {
    console.warn(`Bellity sword drop failed: ${error}`);
  }
}

function applyDoubleKnockback(event) {
  if (!event.hadEffect) return;

  const attacker = event.attackingEntity;
  const target = event.hitEntity;
  let directionX = target.location.x - attacker.location.x;
  let directionZ = target.location.z - attacker.location.z;
  let horizontalLength = Math.hypot(directionX, directionZ);

  if (horizontalLength < 0.001) {
    const view = attacker.getViewDirection();
    directionX = view.x;
    directionZ = view.z;
    horizontalLength = Math.hypot(directionX, directionZ);
  }
  if (horizontalLength < 0.001) return;

  const horizontalForce = {
    x: (directionX / horizontalLength) * EXTRA_KNOCKBACK_STRENGTH,
    z: (directionZ / horizontalLength) * EXTRA_KNOCKBACK_STRENGTH,
  };

  system.run(() => {
    try {
      target.applyKnockback(horizontalForce, 0);
    } catch (error) {
      console.warn(`Gizagiza sword knockback failed: ${error}`);
    }
  });
}

function throwLight(event) {
  const player = event.source;
  const now = system.currentTick;
  if (now - (lastThrowTick.get(player.id) ?? -100) < 7) return;

  try {
    const equipment = player.getComponent("minecraft:equippable");
    const mainhand = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand);
    const item = mainhand?.getItem();
    if (!item || item.typeId !== LIGHT_ID) return;

    const durability = item.getComponent("minecraft:durability");
    if (!durability) throw new Error("Light item has no durability component");

    const direction = player.getViewDirection();
    const head = player.getHeadLocation();
    const origin = {
      x: head.x + direction.x * 0.6,
      y: head.y + direction.y * 0.6,
      z: head.z + direction.z * 0.6,
    };
    const projectile = player.dimension.spawnEntity(LIGHT_BALL_ID, origin);
    const flight = projectile.getComponent("minecraft:projectile");
    if (!flight) {
      projectile.remove();
      throw new Error("Light ball has no projectile component");
    }

    lightProjectiles.add(projectile.id);
    system.runTimeout(() => lightProjectiles.delete(projectile.id), 200);
    flight.owner = player;
    flight.shoot({
      x: direction.x * 1.5,
      y: direction.y * 1.5,
      z: direction.z * 1.5,
    });
    player.dimension.playSound("random.bow", player.location, {
      volume: 0.5,
      pitch: 0.33 + Math.random() * 0.17,
    });

    if (durability.damage + 1 >= durability.maxDurability) {
      mainhand.setItem(undefined);
    } else {
      durability.damage += 1;
      mainhand.setItem(item);
    }
    lastThrowTick.set(player.id, now);
  } catch (error) {
    console.warn(`Bellity light throw failed: ${error}`);
  }
}

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("bellity:random_drop_on_hit", {
    onHitEntity: dropRandomItem,
  });
  itemComponentRegistry.registerCustomComponent("bellity:double_knockback_on_hit", {
    onHitEntity: applyDoubleKnockback,
  });
  itemComponentRegistry.registerCustomComponent("bellity:throw_light", {
    onUse: throwLight,
  });
});

world.afterEvents.projectileHitEntity.subscribe((event) => {
  try {
    if (!lightProjectiles.delete(event.projectile.id)) return;
    const target = event.getEntityHit()?.entity;
    if (!target) return;
    target.applyDamage(10);
    target.setOnFire(5);
  } catch (error) {
    console.warn(`Bellity light impact failed: ${error}`);
  }
});

world.afterEvents.projectileHitBlock.subscribe((event) => {
  lightProjectiles.delete(event.projectile.id);
});
