import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const json = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

const bp = json("behavior_pack/manifest.json");
const rp = json("resource_pack/manifest.json");
assert.equal(bp.header.name, "ベリティアドオン");
assert.equal(rp.header.name, "ベリティアドオン");
assert.notEqual(bp.header.uuid, rp.header.uuid);
assert(bp.dependencies.some((d) => d.uuid === rp.header.uuid &&
  JSON.stringify(d.version) === JSON.stringify(rp.header.version)));
assert(bp.dependencies.some((d) => d.module_name === "@minecraft/server"));

const weapons = [
  ["bellity_sword", "bellity:bellity_sword", 31, 1233],
  ["creepy_horse_eye", "bellity:creepy_horse_eye", undefined, undefined, "bellity:freeze_nearby_enemies"],
  ["noboru_netherite_axe", "bellity:noboru_netherite_axe", 5, 1200],
  ["sun_bigman_light", "bellity:sun_bigman_light", undefined, 500],
  ["gizagiza_sword", "bellity:gizagiza_sword", 9, 1200, "bellity:double_knockback_on_hit"],
];
const atlas = json("resource_pack/textures/item_texture.json").texture_data;
const languages = ["en_US", "ja_JP"];

for (const [file, id, damage, durability, customComponent] of weapons) {
  const item = json(`behavior_pack/items/${file}.json`)["minecraft:item"];
  assert.equal(item.description.identifier, id);
  const nameKey = `item.${id}.name`;
  assert.equal(item.components["minecraft:display_name"]?.value, nameKey);
  assert.equal(item.components["minecraft:damage"], damage);
  assert.equal(item.components["minecraft:durability"]?.max_durability, durability);
  assert.equal(item.components["minecraft:max_stack_size"], 1);
  if (customComponent !== undefined) {
    assert.deepEqual(item.components[customComponent], {});
  }
  assert.equal(atlas[file].textures, `textures/items/${file}`);

  const png = readFileSync(resolve(root, `resource_pack/textures/items/${file}.png`));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert(png.readUInt32BE(16) > 0 && png.readUInt32BE(20) > 0);

  for (const locale of languages) {
    const lines = readFileSync(resolve(root, `resource_pack/texts/${locale}.lang`), "utf8").split(/\r?\n/);
    assert(lines.some((line) => line.startsWith(`${nameKey}=`) && line.length > nameKey.length + 1));
  }
}

assert.deepEqual(
  readFileSync(resolve(root, "resource_pack/textures/items/creepy_horse_eye.png")),
  readFileSync(resolve(root, "model_data/creepy_horse_eye.png")),
);
assert.deepEqual(
  readFileSync(resolve(root, "resource_pack/textures/items/gizagiza_sword.png")),
  readFileSync(resolve(root, "model_data/gizagiza_sword.png")),
);
assert(readFileSync(resolve(root, "resource_pack/texts/ja_JP.lang"), "utf8")
  .split(/\r?\n/).includes("item.bellity:gizagiza_sword.name=ギザギザ剣"));
assert(readFileSync(resolve(root, "resource_pack/texts/en_US.lang"), "utf8")
  .split(/\r?\n/).includes("item.bellity:gizagiza_sword.name=Gizagiza Sword"));

const creepyHorseEye = json("behavior_pack/items/creepy_horse_eye.json")["minecraft:item"];
assert.equal(creepyHorseEye.components["minecraft:interact_button"], true);
assert.deepEqual(creepyHorseEye.components["minecraft:use_modifiers"], {
  use_duration: 0.1,
  movement_modifier: 1.0,
});
assert.deepEqual(creepyHorseEye.components["minecraft:cooldown"], {
  category: "creepy_horse_eye",
  duration: 20,
});

for (const [file, expectedRows, expectedKey] of [
  ["bellity_sword", ["HG ", " C ", " B "], {
    H: { item: "minecraft:flint_and_steel" },
    G: { item: "minecraft:gold_ingot" },
    C: { item: "minecraft:creeper_head" },
    B: { item: "minecraft:stick" },
  }],
  ["creepy_horse_eye", ["SSS", "SES", "SSS"], {
    S: { item: "minecraft:coal" },
    E: { item: "minecraft:ender_eye" },
  }],
  ["gizagiza_sword", [" I ", "III", " B "], {
    I: { item: "minecraft:iron_ingot" },
    B: { item: "minecraft:stick" },
  }],
  ["noboru_netherite_axe", ["NN ", " B ", " B "], {
    N: { item: "minecraft:netherite_ingot" },
    B: { item: "minecraft:stick" },
  }],
  ["sun_bigman_light", ["T  ", " A ", "  R"], {
    T: { item: "minecraft:torch" },
    A: { item: "minecraft:arrow" },
    R: { item: "minecraft:trident" },
  }],
]) {
  const recipeFile = json(`behavior_pack/recipes/${file}.json`);
  assert.equal(recipeFile.format_version, "1.20.10");
  const recipe = recipeFile["minecraft:recipe_shaped"];
  assert.deepEqual(recipe.unlock, { context: "AlwaysUnlocked" });
  assert.deepEqual(recipe.pattern, expectedRows);
  assert.deepEqual(recipe.key, expectedKey);
  assert.equal(recipe.result.item, `bellity:${file}`);
  assert.equal(recipe.result.count, 1);
}

const recipeFiles = readdirSync(resolve(root, "behavior_pack/recipes"))
  .filter((file) => file.endsWith(".json"))
  .sort();
assert.deepEqual(recipeFiles, [
  "bellity_sword.json",
  "creepy_horse_eye.json",
  "gizagiza_sword.json",
  "noboru_netherite_axe.json",
  "sun_bigman_light.json",
]);

assert(existsSync(resolve(root, "behavior_pack/scripts/main.js")));
const lightBallId = "bellity:light_ball";
const lightBall = json("behavior_pack/entities/light_ball.json")["minecraft:entity"];
assert.equal(lightBall.description.identifier, lightBallId);
const lightBallProjectile = lightBall.components["minecraft:projectile"];
assert.deepEqual(lightBallProjectile.on_hit, {
  remove_on_hit: {},
  particle_on_hit: {
    particle_type: "snowballpoof",
    num_particles: 6,
    on_entity_hit: true,
    on_other_hit: true,
  },
});
assert.equal(lightBallProjectile.anchor, 1);
assert.equal(lightBallProjectile.power, 1.5);
assert.equal(lightBallProjectile.gravity, 0.03);
assert.equal(lightBallProjectile.inertia, 1);
assert.equal(lightBallProjectile.angle_offset, 0);
assert.deepEqual(lightBallProjectile.offset, [0, -0.1, 0]);
assert.equal("hit_sound" in lightBallProjectile, false);
assert.equal("hit_ground_sound" in lightBallProjectile, false);

const clientLightBall = json("resource_pack/entity/light_ball.entity.json")["minecraft:client_entity"].description;
assert.equal(clientLightBall.identifier, lightBallId);
assert.equal(clientLightBall.textures.default, "textures/entity/light_ball");
assert.equal(clientLightBall.geometry.default, "geometry.item_sprite");
assert(json("resource_pack/animations/light_ball.animation.json").animations[clientLightBall.animations.flying]);
assert(json("resource_pack/render_controllers/light_ball.render_controllers.json")
  .render_controllers[clientLightBall.render_controllers[0]]);
assert.deepEqual(
  readFileSync(resolve(root, "resource_pack/textures/entity/light_ball.png")),
  readFileSync(resolve(root, "model_data/sunlight_ball.png")),
);
const script = readFileSync(resolve(root, "behavior_pack/scripts/main.js"), "utf8");
assert.match(script, /itemComponentRegistry\.registerCustomComponent\("bellity:double_knockback_on_hit"/);
assert.match(script, /const EXTRA_KNOCKBACK_STRENGTH = 0\.4/);
assert.match(script, /target\.applyKnockback\(horizontalForce, 0\)/);
assert.match(script, /player\.dimension\.spawnEntity\(LIGHT_BALL_ID, origin\)/);
assert.match(script, /const LIGHT_BALL_ID = "bellity:light_ball"/);
assert.match(script, /player\.dimension\.playSound\("random\.bow", player\.location/);
assert.match(script, /itemComponentRegistry\.registerCustomComponent\("bellity:freeze_nearby_enemies"/);
assert.match(script, /const FREEZE_RADIUS = 7/);
assert.match(script, /const FREEZE_DURATION_TICKS = 200/);
assert.match(script, /families: \["monster"\]/);
assert.match(script, /frozen\.entity\.teleport\(frozen\.location/);
assert.match(script, /frozen\.entity\.clearVelocity\(\)/);
assert.match(script, /spawnParticle\(/);
assert.doesNotMatch(script, /^const whiteParticleVariables = new MolangVariableMap\(\);/m);
assert.match(script, /function getWhiteParticleVariables\(\)/);
assert.match(script, /getWhiteParticleVariables\(\),/);

console.log("Bellity pack validation passed: 5 items, 5 recipes, light ball, freeze effect, textures, names, manifests.");
