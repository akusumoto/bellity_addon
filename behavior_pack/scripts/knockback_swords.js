import { EntityDamageCause, EquipmentSlot, system, world } from "@minecraft/server";
import { getKnockbackScale } from "./knockback_resistance.js";

const WIND = "bellity:wind_sword";
const OSU = "bellity:osu_sword";
const HIT_WINDOW_TICKS = 2;
const WIND_UPWARD_SPEED = 1.10;
const WIND_HORIZONTAL_SPEED = 0.50;
const NORMAL_HORIZONTAL_SPEED = 0.40;
const OSU_HORIZONTAL_SPEED = 0.42;
const OSU_SLIDE_TICKS = 24;
const contacts = new Map();
const hurts = new Map();
const slides = new Map();
let registered = false;

function pair(attacker, target) {
  return `${attacker.id}:${target.id}`;
}

function alive(entity) {
  return entity.isValid && (entity.getComponent("minecraft:health")?.currentValue ?? 0) > 0;
}

function direction(attacker, target) {
  let x = target.location.x - attacker.location.x;
  let z = target.location.z - attacker.location.z;
  let length = Math.hypot(x, z);
  if (length < 0.001) {
    ({ x, z } = attacker.getViewDirection());
    length = Math.hypot(x, z);
  }
  return length >= 0.001 ? { x: x / length, z: z / length } : undefined;
}

function windImpact(target) {
  const position = target.getHeadLocation();
  try {
    target.dimension.spawnParticle("minecraft:wind_explosion_emitter", position);
  } catch (error) {
    console.warn(`Wind Sword particle failed: ${error}`);
  }
  try {
    target.dimension.playSound("wind_charge.burst", position);
  } catch (error) {
    console.warn(`Wind Sword sound failed: ${error}`);
  }
}

// Add only missing speed: preserve faster outward and sideways movement and y.
function pushToSpeed(target, away, speed) {
  const velocity = target.getVelocity();
  const along = velocity.x * away.x + velocity.z * away.z;
  const extra = Math.max(0, speed - along);
  if (extra > 0) target.applyImpulse({ x: away.x * extra, y: 0, z: away.z * extra });
}

function finishHit(id) {
  const contact = contacts.get(id);
  const hurt = hurts.get(id);
  if (!contact || !hurt || Math.abs(contact.tick - hurt.tick) > HIT_WINDOW_TICKS) return;
  contacts.delete(id);
  hurts.delete(id);
  const record = contact;
  // Allow native melee to finish. Never require a sampled velocity delta.
  system.run(() => {
    try {
      const target = record.target;
      if (!alive(target) || target.dimension.id !== record.dimension) return;
      slides.delete(target.id);
      if (record.sword === WIND) windImpact(target);
      const scale = getKnockbackScale(target);
      if (scale <= 0) return;
      if (record.sword === WIND) {
        const velocity = target.getVelocity();
        const along = velocity.x * record.direction.x + velocity.z * record.direction.z;
        const base = Math.max(NORMAL_HORIZONTAL_SPEED, along);
        const desired = (base + WIND_HORIZONTAL_SPEED - NORMAL_HORIZONTAL_SPEED) * scale;
        const horizontal = Math.max(0, desired - along);
        const vertical = Math.max(0, WIND_UPWARD_SPEED - velocity.y) * scale;
        target.applyImpulse({
          x: record.direction.x * horizontal,
          y: vertical,
          z: record.direction.z * horizontal,
        });
      } else {
        const slide = {
          target,
          direction: record.direction,
          speed: (OSU_HORIZONTAL_SPEED + record.bonus) * scale,
          remaining: OSU_SLIDE_TICKS,
          dimension: record.dimension,
          previous: { ...target.location },
          stalled: 0,
        };
        pushToSpeed(target, slide.direction, slide.speed);
        slides.set(target.id, slide);
      }
    } catch (error) {
      console.warn(`Knockback sword hit failed: ${error}`);
    }
  });
}

function onContact(event, sword) {
  if (!event.hadEffect) return;
  try {
    const attacker = event.attackingEntity;
    const target = event.hitEntity;
    const away = direction(attacker, target);
    if (!away) return;
    const level = event.itemStack?.getComponent("minecraft:enchantable")?.getEnchantment("knockback")?.level ?? 0;
    const id = pair(attacker, target);
    contacts.set(id, {
      tick: system.currentTick,
      target,
      sword,
      direction: away,
      bonus: (attacker.isSprinting ? 0.10 : 0) + level * 0.10,
      dimension: target.dimension.id,
    });
    finishHit(id);
  } catch (error) {
    console.warn(`Knockback sword contact failed: ${error}`);
  }
}

function onHurt(event) {
  const source = event.damageSource;
  if (!(event.damage > 0) || source.cause !== EntityDamageCause.entityAttack || source.damagingProjectile || !source.damagingEntity) return;
  try {
    const id = pair(source.damagingEntity, event.hurtEntity);
    // Do not retain unrelated unarmed damage for a later sword contact. A
    // captured contact remains valid if the sword broke or the slot changed.
    if (!contacts.has(id)) {
      const item = source.damagingEntity.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
      if (item?.typeId !== WIND && item?.typeId !== OSU) return;
    }
    hurts.set(id, { tick: system.currentTick });
    finishHit(id);
  } catch (error) {
    console.warn(`Knockback sword damage attribution failed: ${error}`);
  }
}

function update() {
  for (const [id, slide] of slides) {
    try {
      const target = slide.target;
      if (!alive(target) || target.dimension.id !== slide.dimension || --slide.remaining <= 0) {
        slides.delete(id);
        continue;
      }
      const moved = Math.hypot(target.location.x - slide.previous.x, target.location.z - slide.previous.z);
      slide.stalled = moved < 0.005 ? slide.stalled + 1 : 0;
      if (slide.stalled >= 3) {
        slides.delete(id);
        continue;
      }
      slide.previous = { ...target.location };
      // Water keeps its drag. Continue horizontal support during the small
      // native melee hop too; requiring ground contact would truncate slides.
      // This never adds vertical force or prevents falling from an edge.
      if (target.isInWater) continue;
      pushToSpeed(target, slide.direction, slide.speed);
    } catch {
      slides.delete(id);
    }
  }
  for (const map of [contacts, hurts]) {
    for (const [id, entry] of map) if (system.currentTick - entry.tick > HIT_WINDOW_TICKS) map.delete(id);
  }
}

export function registerKnockbackSwords(itemComponentRegistry) {
  itemComponentRegistry.registerCustomComponent("bellity:wind_sword_hit", {
    onHitEntity: (event) => onContact(event, WIND),
  });
  itemComponentRegistry.registerCustomComponent("bellity:osu_sword_hit", {
    onHitEntity: (event) => onContact(event, OSU),
  });
  if (registered) return;
  registered = true;
  world.afterEvents.entityHurt.subscribe(onHurt);
  system.runInterval(update, 1);
}
