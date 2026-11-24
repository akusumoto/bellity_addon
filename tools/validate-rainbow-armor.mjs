import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Source checks only: protection, enchanting, animation, and durability behavior
// still require observation in Minecraft Bedrock.
export function validateRainbowArmor(root) {
  const json = (file) => JSON.parse(readFileSync(resolve(root, file), "utf8"));
  const bytes = (file) => readFileSync(resolve(root, file));
  const atlas = json("resource_pack/textures/item_texture.json").texture_data;
  const parts = [
    ["helmet", "head", "armor_head", 2, ["SSS", "R R", "   "], "Rainbow Helmet", "虹色のヘルメット"],
    ["chestplate", "chest", "armor_torso", 6, ["S S", "SSS", "R R"], "Rainbow Chestplate", "虹色のチェストプレート"],
    ["leggings", "legs", "armor_legs", 5, ["SSS", "S S", "R R"], "Rainbow Leggings", "虹色のレギンス"],
    ["boots", "feet", "armor_feet", 2, ["   ", "S S", "R R"], "Rainbow Boots", "虹色のブーツ"],
  ];
  const controllers = {};
  for (const file of readdirSync(resolve(root, "resource_pack/render_controllers"))) {
    if (file.endsWith(".json")) Object.assign(controllers, json(`resource_pack/render_controllers/${file}`).render_controllers);
  }
  const wornTexture = "textures/models/armor/rainbow_armor_layer_1";
  const sourceTexture = bytes("model_data/rainbow_armor_layer_1.png");
  assert.deepEqual(bytes(`resource_pack/${wornTexture}.png`), sourceTexture,
    "Rainbow worn texture must preserve supplied artwork");
  assert.equal(sourceTexture.readUInt32BE(16), 64);
  assert.equal(sourceTexture.readUInt32BE(20), 32);

  for (const [part, slot, enchantmentSlot, protection, pattern, english, japanese] of parts) {
    const name = `rainbow_${part}`;
    const id = `bellity:${name}`;
    const item = json(`behavior_pack/items/${name}.json`)["minecraft:item"];
    assert.equal(item.description.identifier, id);
    assert.equal(item.description.menu_category.category, "equipment");
    const c = item.components;
    assert.equal(c["minecraft:display_name"].value, `item.${id}.name`);
    assert.equal(c["minecraft:icon"], name);
    assert.equal(c["minecraft:max_stack_size"], 1);
    assert.equal(c["minecraft:wearable"].slot, `slot.armor.${slot}`);
    assert.equal(c["minecraft:wearable"].protection, protection);
    assert.deepEqual(c["minecraft:enchantable"], { slot: enchantmentSlot, value: 9 });
    assert.equal(c["minecraft:durability"], undefined, `${name}: infinite durability must not be a finite value`);
    assert.equal(c["minecraft:damage_absorption"], undefined, `${name}: use vanilla armor protection`);
    assert(!Object.keys(c).some((key) => key.startsWith("bellity:")), `${name}: armor needs no custom damage script`);
    assert.equal(atlas[name].textures, `textures/items/${name}`);
    const icon = bytes(`resource_pack/textures/items/${name}.png`);
    assert.equal(icon.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.deepEqual(icon, bytes(`model_data/${name}.png`), `${name}: preserve supplied inventory icon`);
    for (const [locale, displayName] of [["en_US", english], ["ja_JP", japanese]]) {
      const matchingLines = readFileSync(resolve(root, `resource_pack/texts/${locale}.lang`), "utf8")
        .split(/\r?\n/).filter((line) => line.startsWith(`item.${id}.name=`));
      assert.deepEqual(matchingLines, [`item.${id}.name=${displayName}`], `${name}: one exact localized name`);
    }

    const recipe = json(`behavior_pack/recipes/${name}.json`)["minecraft:recipe_shaped"];
    assert.equal(recipe.description.identifier, id);
    assert.deepEqual(recipe.pattern, pattern);
    assert.deepEqual(recipe.key, { S: { item: "minecraft:stone" }, R: { item: "minecraft:cobblestone" } });
    assert.deepEqual(recipe.tags, ["crafting_table"]);
    assert.deepEqual(recipe.unlock, { context: "AlwaysUnlocked" });
    assert.deepEqual(recipe.result, { item: id, count: 1 });

    const attachable = json(`resource_pack/attachables/${name}.json`)["minecraft:attachable"].description;
    assert.equal(attachable.identifier, id);
    assert.equal(attachable.textures.default, wornTexture);
    assert(attachable.materials.enchanted, `${name}: enchanted material required`);
    assert(attachable.textures.enchanted, `${name}: enchanted glint texture required`);
    const geometry = json(`resource_pack/models/entity/${name}.geo.json`)["minecraft:geometry"];
    const model = geometry.find((entry) => entry.description.identifier === attachable.geometry.default);
    assert(model, `${name}: default geometry reference must resolve`);
    assert.equal(model.description.texture_width, sourceTexture.readUInt32BE(16));
    assert.equal(model.description.texture_height, sourceTexture.readUInt32BE(20));
    assert(model.bones.some((bone) => bone.cubes?.length), `${name}: equipped mesh must not be empty`);
    const expectedMeshBones = {
      helmet: ["hat", "head"],
      chestplate: ["body", "leftArm", "rightArm"],
      leggings: ["body", "leftLeg", "rightLeg"],
      boots: ["leftLeg", "rightLeg"],
    }[part];
    const meshBones = model.bones.filter((bone) => bone.cubes?.length);
    assert.deepEqual(meshBones.map((bone) => bone.name).sort(), expectedMeshBones,
      `${name}: render only this armor piece, not the full set`);
    for (const bone of meshBones) {
      for (const cube of bone.cubes) {
        assert(cube.size.every((value) => Number.isFinite(value) && value > 0), `${name}: valid cube size`);
        assert(cube.origin.every(Number.isFinite), `${name}: valid cube origin`);
        if (part === "boots") {
          assert(cube.origin[1] >= 0 && cube.origin[1] + cube.size[1] <= 4,
            "Boots cover only the lower leg, leaving the leggings visible");
        }
        if (part === "leggings" && bone.name === "body") {
          assert(cube.origin[1] >= 12 && cube.origin[1] + cube.size[1] <= 16,
            "Leggings body geometry must be limited to the waistband");
        }
      }
    }
    for (const controllerReference of attachable.render_controllers) {
      const controllerName = typeof controllerReference === "string" ? controllerReference : Object.keys(controllerReference)[0];
      const controller = controllers[controllerName];
      // Vanilla controllers are resolved by the base Resource Pack. Dedicated
      // Bellity controllers must be present in this pack.
      if (controllerName.startsWith("controller.render.bellity.")) assert(controller, `${name}: missing render controller`);
      if (controller) {
        assert.equal(controller.geometry, "Geometry.default");
        const encoded = JSON.stringify(controller).toLowerCase();
        assert(encoded.includes("material.enchanted") && encoded.includes("texture.enchanted"), `${name}: glint references must resolve`);
      }
    }
    for (const texture of Object.values(attachable.textures)) {
      if (texture === wornTexture) assert(existsSync(resolve(root, `resource_pack/${texture}.png`)));
    }
  }
}
