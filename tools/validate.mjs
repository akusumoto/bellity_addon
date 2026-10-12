import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";

const root = resolve(import.meta.dirname, "..");
const json = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

function validateJsonTree(relativeDirectory) {
  const directory = resolve(root, relativeDirectory);
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relativePath = `${relativeDirectory}/${entry.name}`;
    if (entry.isDirectory()) {
      validateJsonTree(relativePath);
    } else if (entry.name.endsWith(".json")) {
      const definition = json(relativePath);
      const group = definition["minecraft:block"]?.description?.menu_category?.group;
      if (group !== undefined) {
        assert.match(group, /^[a-z0-9_.-]+:[a-zA-Z0-9_.-]+$/,
          `${relativePath}: block menu category group must have a namespace`);
      }
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
assert(bp.dependencies.some((d) => d.module_name === "@minecraft/server-ui" && d.version === "2.0.0"));

const weapons = [
  ["pallet", "bellity:pallet", undefined, undefined, "bellity:open_pallet"],
  ["air_sword", "bellity:air_sword", 5, undefined, "bellity:levitation_on_hit"],
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
  ["pallet", [" T ", "TBT", "TPT"], {
    T: { item: "minecraft:spruce_planks" },
    B: { item: "minecraft:brush" },
    P: { item: "minecraft:purple_concrete" },
  }],
  ["air_block", ["WWW", "WWW", "WWW"], {
    W: { item: "minecraft:white_concrete" },
  }],
  ["air_sword", [" A ", " A ", " B "], {
    A: { item: "bellity:air_block" },
    B: { item: "minecraft:black_concrete" },
  }],
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
  ["decorate_trapdoor", ["QBQ", "QSQ", "QBQ"], {
    Q: { item: "minecraft:quartz_block" },
    B: { item: "minecraft:black_dye" },
    S: { item: "minecraft:sea_lantern" },
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
  "air_block.json",
  "air_sword.json",
  "bellity_sword.json",
  "connectable_train_cart.json",
  "creepy_horse_eye.json",
  "decorate_trapdoor.json",
  "gizagiza_sword.json",
  "noboru_netherite_axe.json",
  "pallet.json",
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
assert.deepEqual(trainGeometry[0].bones.find((bone) => bone.name === "root")?.rotation, [0, 90, 0]);
assert.deepEqual(trainGeometry, json("model_data/connectable_train_cart.geo.json")["minecraft:geometry"]);
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
assert.equal(trainCartItem.components["minecraft:icon"], "connectable_train_cart");
assert.equal(atlas.connectable_train_cart.textures, "textures/items/connectable_train_cart");
const trainCartIcon = readFileSync(resolve(root, "resource_pack/textures/items/connectable_train_cart.png"));
assert.equal(trainCartIcon.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
assert(trainCartIcon.readUInt32BE(16) > 0 && trainCartIcon.readUInt32BE(20) > 0);
assert.deepEqual(
  trainCartIcon,
  readFileSync(resolve(root, "model_data/connectable_train_cart_icon.png")),
);
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

const airSword = json("behavior_pack/items/air_sword.json")["minecraft:item"];
assert.equal("minecraft:durability" in airSword.components, false);
assert.equal(airSword.components["minecraft:icon"], "air_sword");
assert.equal(airSword.components["minecraft:hand_equipped"], true);
assert.deepEqual(airSword.components["minecraft:tags"], { tags: ["minecraft:is_sword"] });

const airBlock = json("behavior_pack/blocks/air_block.json")["minecraft:block"];
assert.equal(airBlock.description.identifier, "bellity:air_block");
assert.equal(airBlock.description.menu_category.category, "construction");
assert.equal(airBlock.components["minecraft:display_name"], "tile.bellity:air_block.name");
assert.equal(airBlock.components["minecraft:collision_box"], true);
assert.equal(airBlock.components["minecraft:selection_box"], true);
const airGeometry = json("resource_pack/models/blocks/air_block.geo.json");
assert.deepEqual(airGeometry, json("model_data/air_block.geo.json"));
assert.equal(airBlock.components["minecraft:geometry"],
  airGeometry["minecraft:geometry"][0].description.identifier);
assert.deepEqual(airBlock.components["minecraft:material_instances"], {
  "*": { texture: "air_block", render_method: "alpha_test" },
});
assert.deepEqual(airBlock.components["minecraft:item_visual"], {
  geometry: airBlock.components["minecraft:geometry"],
  material_instances: airBlock.components["minecraft:material_instances"],
});
assert.equal(json("resource_pack/textures/terrain_texture.json").texture_data.air_block.textures,
  "textures/blocks/air_block");
assert.deepEqual(json(`behavior_pack/${airBlock.components["minecraft:loot"]}`).pools, [{
  rolls: 1,
  entries: [{ type: "item", name: "bellity:air_block", weight: 1 }],
}]);
for (const [runtime, source] of [
  ["textures/items/air_sword.png", "air_sword.png"],
  ["textures/blocks/air_block.png", "air_block_texture.png"],
  ["models/blocks/air_block.geo.json", "air_block.geo.json"],
]) {
  assert.deepEqual(readFileSync(resolve(root, `resource_pack/${runtime}`)),
    readFileSync(resolve(root, `model_data/${source}`)));
}
for (const [locale, blockName, swordName] of [
  ["en_US", "Air Block", "Air Sword"],
  ["ja_JP", "空気ブロック", "空気ソード"],
]) {
  const lines = readFileSync(resolve(root, `resource_pack/texts/${locale}.lang`), "utf8").split(/\r?\n/);
  assert(lines.includes(`tile.bellity:air_block.name=${blockName}`));
  assert(lines.includes(`item.bellity:air_sword.name=${swordName}`));
}

const decorateTrapdoorId = "bellity:decorate_trapdoor";
const decorateTrapdoor = json("behavior_pack/blocks/decorate_trapdoor.json")["minecraft:block"];
assert.equal(decorateTrapdoor.description.identifier, decorateTrapdoorId);
assert.equal(decorateTrapdoor.description.menu_category.group, "minecraft:itemGroup.name.trapdoor");
assert.deepEqual(decorateTrapdoor.description.states["bellity:open"], [false, true]);
assert.deepEqual(decorateTrapdoor.description.states["bellity:powered"], [false, true]);
assert(decorateTrapdoor.description.traits["minecraft:placement_direction"].enabled_states
  .includes("minecraft:cardinal_direction"));
assert(decorateTrapdoor.description.traits["minecraft:placement_position"].enabled_states
  .includes("minecraft:vertical_half"));
assert.equal(decorateTrapdoor.components["minecraft:display_name"], `tile.${decorateTrapdoorId}.name`);
const decorateTrapdoorGeometry = json("resource_pack/models/blocks/decorate_trapdoor.geo.json");
const suppliedTrapdoorGeometry = json("model_data/decorate_trapdoor.geo.json");
assert.equal(decorateTrapdoorGeometry["minecraft:geometry"][0].description.identifier,
  "geometry.bellity.decorate_trapdoor");
assert.deepEqual(decorateTrapdoorGeometry["minecraft:geometry"][0].bones,
  suppliedTrapdoorGeometry["minecraft:geometry"][0].bones);
assert.equal(decorateTrapdoorGeometry["minecraft:geometry"][1].description.identifier,
  "geometry.bellity.decorate_trapdoor.open");
assert.deepEqual(decorateTrapdoorGeometry["minecraft:geometry"][1].bones[0].cubes,
  suppliedTrapdoorGeometry["minecraft:geometry"][0].bones[0].cubes);
assert.deepEqual(decorateTrapdoorGeometry["minecraft:geometry"][1].bones[0].pivot, [0, 8, 0]);
assert.deepEqual(decorateTrapdoorGeometry["minecraft:geometry"][1].bones[0].rotation, [90, 0, 0]);
assert.equal(decorateTrapdoor.permutations.length, 16);
assert.deepEqual(decorateTrapdoor.components["bellity:trapdoor"], {});
for (const direction of ["north", "south", "east", "west"]) {
  for (const half of ["bottom", "top"]) {
    for (const open of [false, true]) {
      const states = {
        "minecraft:cardinal_direction": direction,
        "minecraft:vertical_half": half,
        "bellity:open": open,
      };
      const matches = decorateTrapdoor.permutations.filter((permutation) =>
        runInNewContext(permutation.condition, { q: { block_state: (key) => states[key] } }));
      assert.equal(matches.length, 1, `${direction}/${half}/${open} needs one visual permutation`);
      const components = matches[0].components;
      assert.equal(components["minecraft:geometry"],
        `geometry.bellity.decorate_trapdoor${open ? ".open" : ""}`);
      assert.deepEqual(components["minecraft:collision_box"], {
        origin: [-8, 0, -8], size: open ? [16, 16, 3] : [16, 3, 16],
      });
      assert.deepEqual(components["minecraft:selection_box"], components["minecraft:collision_box"]);
      assert.deepEqual(components["minecraft:transformation"].translation,
        [0, !open && half === "top" ? 13 / 16 : 0, 0]);
    }
  }
}
assert.equal(json("resource_pack/textures/terrain_texture.json").texture_data.decorate_trapdoor.textures,
  "textures/blocks/decorate_trapdoor");
assert.deepEqual(readFileSync(resolve(root, "resource_pack/textures/blocks/decorate_trapdoor.png")),
  readFileSync(resolve(root, "model_data/decorate_trapdoor_texture.png")));
assert.deepEqual(json(`behavior_pack/${decorateTrapdoor.components["minecraft:loot"]}`).pools, [{
  rolls: 1,
  entries: [{ type: "item", name: decorateTrapdoorId, weight: 1 }],
}]);
for (const [locale, name] of [["en_US", "Decorate Trapdoor"], ["ja_JP", "模様付きのトラップドア"]]) {
  assert(readFileSync(resolve(root, `resource_pack/texts/${locale}.lang`), "utf8")
    .split(/\r?\n/).includes(`tile.${decorateTrapdoorId}.name=${name}`));
}
assert.match(script, /registerDecorateTrapdoor\(blockComponentRegistry\)/);

// Verify state transitions in isolation; Minecraft rendering and circuits need device checks.
const trapdoorComponents = new Map();
const trapdoorContext = { console: { warn: () => {} } };
runInNewContext(readFileSync(resolve(root, "behavior_pack/scripts/decorate_trapdoor.js"), "utf8")
  .replace(/^import .*;\r?\n/gm, "").replace(/^export /gm, ""), trapdoorContext);
trapdoorContext.registerDecorateTrapdoor({
  registerCustomComponent: (id, component) => trapdoorComponents.set(id, component),
});
const trapdoorCallbacks = trapdoorComponents.get("bellity:trapdoor");
for (const callback of ["beforeOnPlayerPlace", "onPlayerInteract", "onTick", "onPlace"]) {
  assert.equal(typeof trapdoorCallbacks?.[callback], "function");
}
let trapdoorStates = { "bellity:open": false, "bellity:powered": false };
let trapdoorPower = 0;
let neighboringPower = 0;
let neighborUnavailable = false;
const trapdoorSounds = [];
const trapdoorPermutation = (states) => ({
  getState: (key) => states[key],
  withState: (key, value) => trapdoorPermutation({ ...states, [key]: value }),
});
for (const [face, expectedDirection] of [
  ["North", "south"], ["South", "north"], ["East", "west"], ["West", "east"],
  ["Up", "east"], ["Down", "east"],
]) {
  for (const half of ["top", "bottom"]) {
    for (const open of [false, true]) {
      const placement = {
        face,
        permutationToPlace: trapdoorPermutation({
          "minecraft:cardinal_direction": "east",
          "minecraft:vertical_half": half,
          "bellity:open": open,
          "bellity:powered": false,
        }),
      };
      trapdoorCallbacks.beforeOnPlayerPlace(placement);
      assert.equal(placement.permutationToPlace.getState("minecraft:cardinal_direction"), expectedDirection);
      assert.equal(placement.permutationToPlace.getState("minecraft:vertical_half"), half);
      assert.equal(placement.permutationToPlace.getState("bellity:open"), open);
      assert.equal(placement.permutationToPlace.getState("bellity:powered"), false);
    }
  }
}
const mockTrapdoor = {
  typeId: decorateTrapdoorId,
  location: { x: 0, y: 0, z: 0 },
  center: () => ({ x: 0.5, y: 0.5, z: 0.5 }),
  dimension: { playSound: (...args) => trapdoorSounds.push(args) },
  get permutation() { return trapdoorPermutation(trapdoorStates); },
  setPermutation: (permutation) => {
    trapdoorStates = {
      "bellity:open": permutation.getState("bellity:open"),
      "bellity:powered": permutation.getState("bellity:powered"),
    };
  },
  getRedstonePower: () => trapdoorPower,
  offset: () => {
    if (neighborUnavailable) throw new Error("Unloaded neighbor");
    return { getRedstonePower: () => neighboringPower };
  },
};
const interactWithTrapdoor = (player = { isSneaking: false }) =>
  trapdoorCallbacks.onPlayerInteract({ block: mockTrapdoor, player });
const tickTrapdoor = () => trapdoorCallbacks.onTick({ block: mockTrapdoor });
interactWithTrapdoor();
assert.equal(trapdoorStates["bellity:open"], true);
interactWithTrapdoor({ isSneaking: true });
trapdoorCallbacks.onPlayerInteract({ block: mockTrapdoor });
assert.equal(trapdoorStates["bellity:open"], true);
interactWithTrapdoor();
assert.equal(trapdoorStates["bellity:open"], false);
trapdoorPower = 15;
tickTrapdoor();
assert.deepEqual(trapdoorStates, { "bellity:open": true, "bellity:powered": true });
interactWithTrapdoor();
tickTrapdoor();
assert.deepEqual(trapdoorStates, { "bellity:open": false, "bellity:powered": true });
trapdoorPower = 0;
tickTrapdoor();
assert.deepEqual(trapdoorStates, { "bellity:open": false, "bellity:powered": false });
neighboringPower = 15;
trapdoorCallbacks.onPlace({ block: mockTrapdoor });
assert.deepEqual(trapdoorStates, { "bellity:open": true, "bellity:powered": true });
neighboringPower = 0;
tickTrapdoor();
assert.deepEqual(trapdoorStates, { "bellity:open": false, "bellity:powered": false });
neighborUnavailable = true;
assert.doesNotThrow(tickTrapdoor);
assert(trapdoorSounds.length > 0);

// Exercise the registered hit callback without treating a mock as in-game proof.
const registeredComponents = new Map();
const subscribe = () => {};
const warnings = [];
runInNewContext(script.replace(/^import .*;\r?\n/gm, ""), {
  openPallet: () => {},
  registerDecorateTrapdoor: () => {},
  system: {
    beforeEvents: { startup: { subscribe: (callback) => callback({
      itemComponentRegistry: { registerCustomComponent: (id, component) => registeredComponents.set(id, component) },
      blockComponentRegistry: { registerCustomComponent: () => {} },
    }) } },
    runInterval: () => {},
  },
  world: {
    beforeEvents: { playerInteractWithEntity: { subscribe } },
    afterEvents: {
      entityDie: { subscribe },
      projectileHitEntity: { subscribe },
      projectileHitBlock: { subscribe },
    },
  },
  console: { warn: (message) => warnings.push(message) },
});
const levitate = registeredComponents.get("bellity:levitation_on_hit")?.onHitEntity;
assert.equal(typeof levitate, "function");
const effects = [];
const hitEntity = { addEffect: (id, ticks, options) => effects.push({ id, ticks, ...options }) };
levitate({ hadEffect: false, hitEntity });
assert.equal(effects.length, 0);
levitate({ hadEffect: true, hitEntity });
levitate({ hadEffect: true, hitEntity });
assert.deepEqual(effects, Array.from({ length: 2 }, () => ({
  id: "levitation", ticks: 200, amplifier: 0, showParticles: true,
})));
levitate({ hadEffect: true, hitEntity: { addEffect: () => { throw new Error("Target unavailable"); } } });
assert.equal(warnings.length, 1);

assert.deepEqual(readFileSync(resolve(root, "resource_pack/textures/items/pallet.png")),
  readFileSync(resolve(root, "model_data/pallet.png")));
const pallet = json("behavior_pack/items/pallet.json")["minecraft:item"];
assert.equal(pallet.components["minecraft:interact_button"], true);
assert.deepEqual(pallet.components["minecraft:use_modifiers"], { use_duration: 0.1, movement_modifier: 1.0 });
assert.equal(typeof registeredComponents.get("bellity:open_pallet")?.onUse, "function");
for (const [locale, name] of [["en_US", "Pallet"], ["ja_JP", "パレット"]]) {
  assert(readFileSync(resolve(root, `resource_pack/texts/${locale}.lang`), "utf8")
    .split(/\r?\n/).includes(`item.bellity:pallet.name=${name}`));
}

// Mock UI and world access to check placement and asynchronous failure paths.
const forms = [];
const placed = [];
const messages = [];
let result = { canceled: false, selection: 0 };
let onShow = () => {};
let empty = true;
const destination = { isAir: true, setType: (id) => placed.push(id) };
const dimension = { id: "overworld", getBlock: (location) => {
  destination.isAir = empty;
  placed.push({ ...location });
  return destination;
} };
const player = {
  id: "pallet-player", typeId: "minecraft:player", isValid: true,
  location: { x: 0, y: 0, z: 0 }, dimension,
  getBlockFromViewDirection: (options) => {
    assert.equal(options.maxDistance, 6);
    return { face: "Up", block: { location: { x: 0, y: 0, z: 0 } } };
  },
  sendMessage: (message) => messages.push(message),
};
const palletContext = {
  Direction: Object.fromEntries(["Down", "Up", "North", "South", "West", "East"].map((face) => [face, face])),
  ActionFormData: class {
    constructor() { this.buttons = []; forms.push(this); }
    title(value) { this.titleValue = value; return this; }
    body(value) { this.bodyValue = value; return this; }
    button(label, icon) { this.buttons.push([label, icon]); return this; }
    show(source) { assert.equal(source, player); onShow(); return Promise.resolve(result); }
  },
  console: { warn: (message) => warnings.push(message) },
};
runInNewContext(readFileSync(resolve(root, "behavior_pack/scripts/pallet.js"), "utf8")
  .replace(/^import .*;\r?\n/gm, "").replace("export async function", "async function"), palletContext);
const usePallet = () => palletContext.openPallet({ source: player });
const colors = ["red", "orange", "yellow", "green", "light_blue", "blue", "purple", "pink"];
for (let selection = 0; selection < colors.length; selection++) {
  result = { canceled: false, selection };
  placed.length = 0;
  await usePallet();
  assert.deepEqual(placed, [{ x: 0, y: 1, z: 0 }, `minecraft:${colors[selection]}_concrete`]);
}
assert.equal(forms[0].bodyValue, "セットするコンクリートを選択");
assert.equal(forms[0].titleValue.translate, "item.bellity:pallet.name");
assert.deepEqual(forms[0].buttons, ["赤", "オレンジ", "黄色", "緑", "空色", "青", "紫", "桃"]
  .map((label, index) => [label, `textures/blocks/concrete_${colors[index]}`]));
for (const [face, location] of [
  ["Down", { x: 0, y: -1, z: 0 }], ["Up", { x: 0, y: 1, z: 0 }],
  ["North", { x: 0, y: 0, z: -1 }], ["South", { x: 0, y: 0, z: 1 }],
  ["West", { x: -1, y: 0, z: 0 }], ["East", { x: 1, y: 0, z: 0 }],
]) {
  player.getBlockFromViewDirection = () => ({ face, block: { location: { x: 0, y: 0, z: 0 } } });
  placed.length = 0;
  await usePallet();
  assert.deepEqual(placed[0], location);
}
placed.length = 0;
result = { canceled: true };
await usePallet();
assert.equal(placed.length, 0);
result = { canceled: false, selection: 0 };
empty = false;
await usePallet();
assert.equal(placed.some((entry) => typeof entry === "string"), false);
empty = true;
placed.length = 0;
onShow = () => { player.dimension = { id: "nether" }; };
await usePallet();
assert.equal(placed.length, 0);
player.dimension = dimension;
onShow = () => { player.location = { x: 100, y: 0, z: 0 }; };
await usePallet();
assert.equal(placed.length, 0);
player.location = { x: 0, y: 0, z: 0 };
onShow = () => { throw new Error("UI unavailable"); };
const warningCount = warnings.length;
await usePallet();
assert.equal(warnings.length, warningCount + 1);
onShow = () => {};
const countBefore = forms.length;
await Promise.all([usePallet(), usePallet()]);
assert.equal(forms.length, countBefore + 1);
assert.equal(placed.at(-1), "minecraft:red_concrete");
player.getBlockFromViewDirection = () => undefined;
placed.length = 0;
await usePallet();
assert.equal(placed.length, 0);

console.log("Bellity pack validation passed: 8 items, 2 blocks, 10 recipes, trapdoor assets/state callbacks, Pallet UI/placement callbacks, levitation callback, light ball, freeze effect, connectable train cart, textures, names, manifests.");
