import { EquipmentSlot, ItemStack, MolangVariableMap, system, world } from "@minecraft/server";

const LIGHT_ID = "bellity:sun_bigman_light";
const LIGHT_BALL_ID = "bellity:light_ball";
const CREEPY_HORSE_EYE_ID = "bellity:creepy_horse_eye";
const EXTRA_KNOCKBACK_STRENGTH = 0.4;
const FREEZE_RADIUS = 7;
const FREEZE_DURATION_TICKS = 200;
const FREEZE_PARTICLE_INTERVAL_TICKS = 10;
const FREEZE_PARTICLES_PER_BURST = 16;
const FREEZE_PARTICLE_ID = "minecraft:colored_flame_particle";
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
const frozenEntities = new Map();
const freezeZones = [];
let whiteParticleVariables;

function getWhiteParticleVariables() {
  if (!whiteParticleVariables) {
    whiteParticleVariables = new MolangVariableMap();
    whiteParticleVariables.setColorRGB("variable.color", {
      red: 0.92,
      green: 0.95,
      blue: 1.0,
    });
  }
  return whiteParticleVariables;
}

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

function randomPointInSphere(center, radius) {
  let x;
  let y;
  let z;
  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    z = Math.random() * 2 - 1;
  } while (x * x + y * y + z * z > 1);

  return {
    x: center.x + x * radius,
    y: center.y + y * radius,
    z: center.z + z * radius,
  };
}

function spawnFreezeParticles(zone) {
  for (let index = 0; index < FREEZE_PARTICLES_PER_BURST; index += 1) {
    zone.dimension.spawnParticle(
      FREEZE_PARTICLE_ID,
      randomPointInSphere(zone.center, FREEZE_RADIUS),
      getWhiteParticleVariables(),
    );
  }
}

function holdFrozenEntity(frozen) {
  frozen.entity.teleport(frozen.location, {
    dimension: frozen.dimension,
    keepVelocity: false,
    rotation: frozen.rotation,
  });
  frozen.entity.clearVelocity();
}

function freezeNearbyEnemies(event) {
  const player = event.source;

  try {
    const equipment = player.getComponent("minecraft:equippable");
    const item = equipment?.getEquipmentSlot(EquipmentSlot.Mainhand)?.getItem();
    if (!item || item.typeId !== CREEPY_HORSE_EYE_ID) return;

    const center = { ...player.location };
    const dimension = player.dimension;
    const untilTick = system.currentTick + FREEZE_DURATION_TICKS;
    const enemies = dimension.getEntities({
      location: center,
      maxDistance: FREEZE_RADIUS,
      families: ["monster"],
    });

    for (const entity of enemies) {
      try {
        const existing = frozenEntities.get(entity.id);
        if (existing) {
          existing.untilTick = Math.max(existing.untilTick, untilTick);
          continue;
        }

        const frozen = {
          entity,
          dimension,
          location: { ...entity.location },
          rotation: entity.getRotation(),
          untilTick,
        };
        holdFrozenEntity(frozen);
        frozenEntities.set(entity.id, frozen);
      } catch (error) {
        console.warn(`Creepy Horse Eye could not freeze ${entity.id}: ${error}`);
      }
    }

    const zone = { center, dimension, untilTick };
    freezeZones.push(zone);
    try {
      spawnFreezeParticles(zone);
    } catch (error) {
      freezeZones.pop();
      console.warn(`Creepy Horse Eye particles failed: ${error}`);
    }
  } catch (error) {
    console.warn(`Creepy Horse Eye activation failed: ${error}`);
  }
}

function updateCreepyHorseEyeEffects() {
  const now = system.currentTick;

  for (const [entityId, frozen] of frozenEntities) {
    if (now >= frozen.untilTick || !frozen.entity.isValid) {
      frozenEntities.delete(entityId);
      continue;
    }

    try {
      if (frozen.entity.dimension.id !== frozen.dimension.id) {
        frozenEntities.delete(entityId);
        continue;
      }
      holdFrozenEntity(frozen);
    } catch (error) {
      frozenEntities.delete(entityId);
      console.warn(`Creepy Horse Eye freeze failed for ${entityId}: ${error}`);
    }
  }

  for (let index = freezeZones.length - 1; index >= 0; index -= 1) {
    const zone = freezeZones[index];
    if (now >= zone.untilTick) {
      freezeZones.splice(index, 1);
      continue;
    }
    if (now % FREEZE_PARTICLE_INTERVAL_TICKS !== 0) continue;

    try {
      spawnFreezeParticles(zone);
    } catch (error) {
      freezeZones.splice(index, 1);
      console.warn(`Creepy Horse Eye particles failed: ${error}`);
    }
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
  itemComponentRegistry.registerCustomComponent("bellity:freeze_nearby_enemies", {
    onUse: freezeNearbyEnemies,
  });
});

system.runInterval(updateCreepyHorseEyeEffects, 1);

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
