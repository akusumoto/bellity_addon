import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import test from "node:test";

const load = (file) => readFileSync(new URL(`../behavior_pack/scripts/${file}`, import.meta.url), "utf8")
  .replace(/^import .*;\r?\n/gm, "").replace(/^export /gm, "");
const source = load("knockback_resistance.js") + "\n" + load("knockback_swords.js");

function setup(sword = "wind_sword") {
  const queue = [], intervals = [], particles = [], sounds = [], warnings = [];
  const components = new Map();
  let hurtCallback;
  const dimension = {
    id: "overworld", spawnParticle: (...args) => particles.push(args), playSound: (...args) => sounds.push(args),
  };
  const attacker = {
    id: "attacker", location: { x: 0, y: 0, z: 0 }, isSprinting: false,
    getViewDirection: () => ({ x: 1, y: 0, z: 0 }),
  };
  const item = {
    typeId: `bellity:${sword}`, level: 0,
    getComponent: () => ({ getEnchantment: () => ({ level: item.level }) }),
  };
  attacker.getComponent = () => ({ getEquipment: () => item });
  const impulses = [], armor = new Map();
  const target = {
    id: "target", typeId: "minecraft:zombie", isValid: true, health: 20,
    location: { x: 1, y: 0, z: 0 }, velocity: { x: 0, y: 0, z: 0 }, dimension,
    isOnGround: true, isInWater: false,
    getComponent: (id) => id === "minecraft:health" ? { currentValue: target.health }
      : id === "minecraft:equippable" ? { getEquipment: (slot) => armor.get(slot) } : undefined,
    getHeadLocation: () => ({ ...target.location, y: target.location.y + 1 }),
    getVelocity: () => ({ ...target.velocity }),
    applyImpulse: (value) => {
      impulses.push({ ...value });
      for (const axis of ["x", "y", "z"]) target.velocity[axis] += value[axis];
    },
  };
  const system = { currentTick: 0, run: (fn) => queue.push(fn), runInterval: (fn) => intervals.push(fn) };
  const world = { afterEvents: { entityHurt: { subscribe: (fn) => { hurtCallback = fn; } } } };
  const context = {
    system, world, EquipmentSlot: { Mainhand: "Mainhand", Head: "Head", Chest: "Chest", Legs: "Legs", Feet: "Feet" },
    EntityDamageCause: { entityAttack: "entityAttack" }, console: { warn: (message) => warnings.push(message) },
    registry: { registerCustomComponent: (id, component) => components.set(id, component) },
  };
  vm.runInNewContext(source + "\nregisterKnockbackSwords(registry);", context);
  const contact = (overrides = {}) => components.get(`bellity:${sword}_hit`).onHitEntity({
    attackingEntity: attacker, hitEntity: target, itemStack: item, hadEffect: true, ...overrides,
  });
  const hurt = (overrides = {}) => hurtCallback({
    damage: 6, hurtEntity: target, damageSource: { cause: "entityAttack", damagingEntity: attacker }, ...overrides,
  });
  const flush = () => { while (queue.length) queue.shift()(); };
  const tick = () => { system.currentTick++; for (const callback of intervals) callback(); };
  const hit = () => { contact(); hurt(); flush(); };
  return { attacker, target, item, armor, contact, hurt, hit, flush, tick, impulses, particles, sounds,
    warnings, system, scale: () => context.getKnockbackScale(target) };
}

test("first Wind hit launches without a pre-hit sample or native velocity change", () => {
  const h = setup(); h.hit();
  assert.equal(h.impulses.length, 1); assert.equal(h.target.velocity.x, 0.5); assert.equal(h.target.velocity.y, 1.1);
  assert.equal(h.particles[0][0], "minecraft:wind_explosion_emitter");
  assert.equal(h.sounds[0][0], "wind_charge.burst"); assert.equal(h.warnings.length, 0);
});

test("already-observed native knockback does not suppress the Wind launch", () => {
  const h = setup(); h.target.velocity = { x: 0.4, y: 0.4, z: 0 }; h.hit();
  assert.equal(h.impulses.length, 1);
  assert.ok(Math.abs(h.target.velocity.x - 0.5) < 1e-9); assert.ok(Math.abs(h.target.velocity.y - 1.1) < 1e-9);
});

test("contact and positive hurt correlate in either order across a one-tick boundary", () => {
  for (const first of ["contact", "hurt"]) {
    const h = setup(); h[first](); h.tick(); h[first === "contact" ? "hurt" : "contact"](); h.flush();
    assert.equal(h.impulses.length, 1);
  }
});

test("missing contact, missing hurt, ineffective contact and zero damage do not launch", () => {
  for (const mode of ["contactOnly", "hurtOnly", "ineffective", "zeroDamage"]) {
    const h = setup();
    if (mode !== "hurtOnly") h.contact({ hadEffect: mode !== "ineffective" });
    if (mode !== "contactOnly") h.hurt({ damage: mode === "zeroDamage" ? 0 : 6 });
    h.flush(); assert.equal(h.impulses.length, 0); assert.equal(h.particles.length, 0);
  }
});

test("unarmed damage cannot authorize a later sword contact", () => {
  const h = setup();
  h.item.typeId = "minecraft:air";
  h.hurt();
  h.item.typeId = "bellity:wind_sword";
  h.contact(); h.flush();
  assert.equal(h.impulses.length, 0);
});

test("projectile, thorns, magic and fire cannot authorize melee movement", () => {
  for (const cause of ["projectile", "thorns", "magic", "fire"]) {
    const h = setup(); h.contact(); h.hurt({ damageSource: { cause, damagingEntity: h.attacker } });
    h.flush(); assert.equal(h.impulses.length, 0);
  }
  const h = setup(); h.contact();
  h.hurt({ damageSource: { cause: "entityAttack", damagingEntity: h.attacker, damagingProjectile: {} } });
  h.flush(); assert.equal(h.impulses.length, 0);
});

test("attacker identity must match the custom-item contact", () => {
  const h = setup(); h.contact();
  h.hurt({ damageSource: { cause: "entityAttack", damagingEntity: { ...h.attacker, id: "other" } } });
  h.flush(); assert.equal(h.impulses.length, 0);
});

test("sword attribution survives changes after the custom-item callback", () => {
  const h = setup(); h.contact(); h.hurt(); h.item.typeId = "minecraft:stick"; h.flush();
  assert.equal(h.impulses.length, 1);
});

test("known vanilla immunity suppresses motion while damaging Wind hits retain visuals", () => {
  for (const typeId of ["minecraft:iron_golem", "minecraft:warden", "minecraft:ender_dragon", "minecraft:armor_stand"]) {
    const h = setup(); h.target.typeId = typeId; h.hit();
    assert.equal(h.impulses.length, 0); assert.equal(h.particles.length, 1);
  }
});

test("known partial resistance scales launch strength", () => {
  const h = setup(); h.target.typeId = "minecraft:ravager"; h.hit();
  assert.equal(h.scale(), 0.25); assert.equal(h.target.velocity.x, 0.125); assert.equal(h.target.velocity.y, 0.275);
});

test("Netherite equipment is read at every hit and applies to players", () => {
  const h = setup(); h.target.typeId = "minecraft:player";
  for (const [slot, part] of [["Head", "helmet"], ["Chest", "chestplate"], ["Legs", "leggings"], ["Feet", "boots"]]) {
    h.armor.set(slot, { typeId: `minecraft:netherite_${part}` });
  }
  assert.ok(Math.abs(h.scale() - 0.6) < 1e-9); h.hit();
  assert.ok(Math.abs(h.target.velocity.y - 0.66) < 1e-9); h.armor.clear(); assert.equal(h.scale(), 1);
});

test("Wind preserves faster outward, sideways and upward velocity", () => {
  const h = setup(); h.target.velocity = { x: 1.2, y: 1.5, z: 0.3 }; h.hit();
  assert.ok(Math.abs(h.target.velocity.x - 1.3) < 1e-9);
  assert.equal(h.target.velocity.z, 0.3); assert.equal(h.target.velocity.y, 1.5);
});

test("Wind baseline discrete gravity/drag model reaches about 7 up and 5 horizontal", () => {
  const h = setup(); h.hit(); let height = 0, distance = 0, apex = 0, ticks = 0;
  let { x, y } = h.target.velocity;
  do {
    height += y; distance += x; apex = Math.max(apex, height);
    y = (y - 0.08) * 0.98; x *= 0.91; ticks++;
  } while (height > 0 && ticks < 100);
  assert.ok(apex > 6.5 && apex < 7.5, `model apex ${apex}`);
  assert.ok(distance > 4.5 && distance < 5.5, `model horizontal ${distance}`);
});

test("Osu starts immediately without native knockback and adds no upward force or visuals", () => {
  const h = setup("osu_sword"); h.hit();
  assert.equal(h.target.velocity.x, 0.42); assert.equal(h.target.velocity.y, 0);
  assert.equal(h.particles.length, 0); assert.equal(h.sounds.length, 0);
});

test("Osu ground-friction model slides approximately ten blocks and then stops pushing", () => {
  const h = setup("osu_sword"); h.hit(); const origin = h.target.location.x;
  for (let n = 0; n < 45; n++) {
    h.target.location.x += h.target.velocity.x; h.target.velocity.x *= 0.546; h.tick();
  }
  const distance = h.target.location.x - origin;
  assert.ok(distance > 9.5 && distance < 10.8, `model distance ${distance}`);
  assert.equal(h.impulses.length, 24); assert.ok(h.impulses.every((entry) => entry.y === 0));
});

test("Osu sprint and enchantment bonuses combine without clamping native motion", () => {
  const h = setup("osu_sword"); h.attacker.isSprinting = true; h.item.level = 2; h.hit();
  assert.ok(Math.abs(h.target.velocity.x - 0.72) < 1e-9);
  const fast = setup("osu_sword"); fast.target.velocity = { x: 1.4, y: 0.4, z: 0.2 }; fast.hit();
  assert.deepEqual(fast.target.velocity, { x: 1.4, y: 0.4, z: 0.2 });
});

test("a wall ends an Osu task after three stalled ticks", () => {
  const h = setup("osu_sword"); h.hit();
  for (let n = 0; n < 30; n++) { h.target.velocity.x = 0; h.tick(); }
  assert.equal(h.impulses.length, 3);
});

test("underwater Osu targets receive only the initial push", () => {
  const h = setup("osu_sword"); h.target.isInWater = true; h.hit();
  for (let n = 0; n < 30; n++) { h.target.location.x += 0.1; h.target.velocity.x *= 0.8; h.tick(); }
  assert.equal(h.impulses.length, 1);
});

test("airborne Osu targets keep horizontal support without changing vertical velocity", () => {
  const h = setup("osu_sword"); h.target.isOnGround = false; h.target.velocity.y = -0.2; h.hit();
  for (let n = 0; n < 8; n++) {
    h.target.location.x += 0.2; h.target.velocity.x = 0.1; h.tick();
  }
  assert.equal(h.impulses.length, 9); assert.equal(h.target.velocity.y, -0.2);
  assert.ok(h.impulses.every((entry) => entry.y === 0));
});

test("a repeat hit from another attacker restarts one slide in the new direction", () => {
  const h = setup("osu_sword"); h.hit(); h.target.location.x += 0.3; h.tick();
  const other = { ...h.attacker, id: "other", location: { x: 10, y: 0, z: 0 } };
  h.contact({ attackingEntity: other });
  h.hurt({ damageSource: { cause: "entityAttack", damagingEntity: other } }); h.flush();
  assert.ok(h.target.velocity.x < 0); assert.ok(h.impulses.at(-1).x < 0);
  h.target.location.x -= 0.3; h.target.velocity.x = 0; h.tick();
  assert.equal(h.impulses.at(-1).x, -0.42);
});

test("invalid, dead and dimension-changed targets are abandoned before activation", () => {
  for (const change of [(h) => { h.target.isValid = false; }, (h) => { h.target.health = 0; },
    (h) => { h.target.dimension = { id: "nether" }; }]) {
    const h = setup(); h.contact(); h.hurt(); change(h); h.flush();
    assert.equal(h.impulses.length, 0); assert.equal(h.warnings.length, 0);
  }
});

test("an active Osu slide is discarded on removal or dimension change", () => {
  for (const change of [(h) => { h.target.isValid = false; }, (h) => { h.target.dimension = { id: "nether" }; }]) {
    const h = setup("osu_sword"); h.hit(); const count = h.impulses.length;
    change(h); for (let n = 0; n < 30; n++) h.tick(); assert.equal(h.impulses.length, count);
  }
});

test("contact or damage older than the two-tick window cannot activate", () => {
  for (const first of ["contact", "hurt"]) {
    const h = setup(); h[first](); h.tick(); h.tick(); h.tick();
    h[first === "contact" ? "hurt" : "contact"](); h.flush(); assert.equal(h.impulses.length, 0);
  }
});
