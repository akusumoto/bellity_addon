import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const json = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

function validateJsonTree(relativeDirectory) {
  const directory = resolve(root, relativeDirectory);
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relativePath = `${relativeDirectory}/${entry.name}`;
    if (entry.isDirectory()) {
      validateJsonTree(relativePath);
    } else if (entry.name.endsWith(".json")) {
      json(relativePath);
    }
  }
}

validateJsonTree("behavior_pack");
validateJsonTree("resource_pack");

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
const creepyHorseEyeSoundId = "bellity.creepy_horse_eye_activate";
const creepyHorseEyeSounds = json("resource_pack/sounds/sound_definitions.json").sound_definitions;
assert.deepEqual(creepyHorseEyeSounds[creepyHorseEyeSoundId], {
  category: "player",
  sounds: ["sounds/creepy_horse_eye_activate"],
});
assert.deepEqual(
  readFileSync(resolve(root, "resource_pack/sounds/creepy_horse_eye_activate.ogg")),
  readFileSync(resolve(root, "model_data/creepy_horse_eye_activate.ogg")),
);
assert.equal(
  readFileSync(resolve(root, "resource_pack/sounds/creepy_horse_eye_activate.ogg"), { length: 4 })
    .subarray(0, 4).toString("ascii"),
  "OggS",
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
  ["connectable_train_cart", ["   ", " MC", "   "], {
    M: { item: "minecraft:minecart" },
    C: { item: "minecraft:chain" },
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
  "connectable_train_cart.json",
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
assert.match(script, /const CREEPY_HORSE_EYE_ACTIVATE_SOUND = "bellity\.creepy_horse_eye_activate"/);
assert.match(script, /dimension\.playSound\(CREEPY_HORSE_EYE_ACTIVATE_SOUND, center\)/);
assert.match(script, /const FREEZE_TREMBLE_DISTANCE = 0\.025/);
assert.match(script, /families: \["monster"\]/);
assert.match(script, /function getFreezeTrembleLocation\(frozen, tick\)/);
assert.match(script, /frozen\.entity\.teleport\(getFreezeTrembleLocation\(frozen, tick\)/);
assert.match(script, /frozen\.entity\.setRotation\(frozen\.rotation\)/);
assert.match(script, /frozen\.entity\.clearVelocity\(\)/);
assert.match(script, /function releaseFrozenEntity\(frozen\)/);
assert.match(script, /spawnParticle\(/);
assert.doesNotMatch(script, /^const whiteParticleVariables = new MolangVariableMap\(\);/m);
assert.match(script, /function getWhiteParticleVariables\(\)/);
assert.match(script, /getWhiteParticleVariables\(\),/);

const trainCartId = "bellity:connectable_train_cart";
const trainCart = json("behavior_pack/entities/connectable_train_cart.json")["minecraft:entity"];
assert.equal(trainCart.description.identifier, trainCartId);
assert.equal(trainCart.description.runtime_identifier, "minecraft:minecart");
assert.equal(trainCart.description.is_spawnable, true);
assert.equal(trainCart.description.is_summonable, true);
assert.equal(trainCart.components["minecraft:damage_sensor"].triggers.deals_damage, "no");
const trainHeadMode = trainCart.component_groups["bellity:head_mode"];
const trainFollowerMode = trainCart.component_groups["bellity:follower_mode"];
assert.equal(trainHeadMode["minecraft:rail_movement"].max_speed, 0.4);
assert.deepEqual(trainHeadMode["minecraft:rail_sensor"], { eject_on_activate: true });
assert.equal(trainHeadMode["minecraft:pushable"].is_pushable, true);
assert.equal(trainFollowerMode["minecraft:pushable"].is_pushable, false);
assert.deepEqual(trainCart.events["bellity:set_follower"].remove.component_groups, ["bellity:head_mode"]);
assert.deepEqual(trainCart.events["bellity:set_follower"].add.component_groups, ["bellity:follower_mode"]);
assert.deepEqual(trainCart.events["bellity:set_head"].remove.component_groups, ["bellity:follower_mode"]);
assert.deepEqual(trainCart.events["bellity:set_head"].add.component_groups, ["bellity:head_mode"]);

const clientTrainCart = json("resource_pack/entity/connectable_train_cart.entity.json")
  ["minecraft:client_entity"].description;
assert.equal(clientTrainCart.identifier, trainCartId);
assert.equal(clientTrainCart.textures.default, "textures/entity/connectable_train_cart");
assert.equal(clientTrainCart.geometry.default, "geometry.bellity.connectable_train_cart");
assert(json("resource_pack/render_controllers/connectable_train_cart.render_controllers.json")
  .render_controllers[clientTrainCart.render_controllers[0]]);
const trainGeometry = json("resource_pack/models/entity/connectable_train_cart.geo.json")["minecraft:geometry"];
assert.equal(trainGeometry[0].description.identifier, "geometry.bellity.connectable_train_cart");
assert.deepEqual(
  readFileSync(resolve(root, "resource_pack/textures/entity/connectable_train_cart.png")),
  readFileSync(resolve(root, "model_data/connectable_train_cart.png")),
);
assert(readFileSync(resolve(root, "resource_pack/texts/ja_JP.lang"), "utf8")
  .split(/\r?\n/).includes("entity.bellity:connectable_train_cart.name=連結トロッコ"));
assert(readFileSync(resolve(root, "resource_pack/texts/en_US.lang"), "utf8")
  .split(/\r?\n/).includes("entity.bellity:connectable_train_cart.name=Connectable Train Cart"));
const trainCartItem = json("behavior_pack/items/connectable_train_cart.json")["minecraft:item"];
assert.equal(trainCartItem.description.identifier, trainCartId);
assert.deepEqual(trainCartItem.description.menu_category, {
  category: "items",
  group: "minecraft:itemGroup.name.minecart",
});
assert.equal(trainCartItem.components["minecraft:display_name"].value,
  "item.bellity:connectable_train_cart.name");
assert.equal(trainCartItem.components["minecraft:icon"], "minecart_normal");
assert.equal(trainCartItem.components["minecraft:max_stack_size"], 1);
assert.deepEqual(trainCartItem.components["minecraft:entity_placer"], {
  entity: trainCartId,
  use_on: ["minecraft:rail", "minecraft:golden_rail", "minecraft:detector_rail", "minecraft:activator_rail"],
});
for (const locale of languages) {
  assert(readFileSync(resolve(root, `resource_pack/texts/${locale}.lang`), "utf8")
    .split(/\r?\n/).includes(`item.${trainCartId}.name=${locale === "ja_JP" ? "連結トロッコ" : "Connectable Train Cart"}`));
}

assert.match(script, /const CONNECTABLE_TRAIN_CART_ID = "bellity:connectable_train_cart"/);
assert.match(script, /const TRAIN_SPACING = 1\.5/);
assert.match(script, /const TRAIN_MAX_CARS = 8/);
assert.match(script, /const TRAIN_LINK_DISTANCE = 6/);
assert.match(script, /const TRAIN_LENGTH_PROPERTY = "train_length"/);
assert.match(script, /const PENDING_TRAIN_REPAIRS_PROPERTY = "bellity:pending_train_repairs"/);
assert.match(script, /event\.itemStack\?\.typeId !== "minecraft:chain"/);
assert.match(script, /target\.triggerEvent\("bellity:set_follower"\)/);
assert.match(script, /cart\.triggerEvent\(newIndex === 0 \? "bellity:set_head" : "bellity:set_follower"\)/);
assert.match(script, /sampleTrainHistory\(history\.points, index \* TRAIN_SPACING\)/);
assert.match(script, /target\.teleport\(placement\.location/);
assert.match(script, /if \(!hasCompleteTrain\(members, trainLength\)\)/);
assert.match(script, /persistPendingTrainRepairs\(\)/);
assert.match(script, /restorePendingTrainRepairs\(\)/);
assert.match(script, /Only a standalone cart can be appended; trains cannot be merged\./);
assert.match(script, /world\.afterEvents\.entityDie\.subscribe/);

console.log("Bellity pack validation passed: 6 items, 6 recipes, light ball, freeze effect, connectable train cart, textures, names, manifests.");
