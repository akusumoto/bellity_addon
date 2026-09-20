import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
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
  ["noboru_netherite_axe", "bellity:noboru_netherite_axe", 5, 1200],
  ["sun_bigman_light", "bellity:sun_bigman_light", undefined, 500],
];
const atlas = json("resource_pack/textures/item_texture.json").texture_data;
const languages = ["en_US", "ja_JP"];

for (const [file, id, damage, durability] of weapons) {
  const item = json(`behavior_pack/items/${file}.json`)["minecraft:item"];
  assert.equal(item.description.identifier, id);
  const nameKey = `item.${id}.name`;
  assert.equal(item.components["minecraft:display_name"]?.value, nameKey);
  assert.equal(item.components["minecraft:damage"], damage);
  assert.equal(item.components["minecraft:durability"].max_durability, durability);
  assert.equal(atlas[file].textures, `textures/items/${file}`);

  const png = readFileSync(resolve(root, `resource_pack/textures/items/${file}.png`));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert(png.readUInt32BE(16) > 0 && png.readUInt32BE(20) > 0);

  for (const locale of languages) {
    const lines = readFileSync(resolve(root, `resource_pack/texts/${locale}.lang`), "utf8").split(/\r?\n/);
    assert(lines.some((line) => line.startsWith(`${nameKey}=`) && line.length > nameKey.length + 1));
  }
}

for (const [file, expectedRows, expectedKey] of [
  ["bellity_sword", ["HG ", " C ", " B "], {
    H: { item: "minecraft:flint_and_steel" },
    G: { item: "minecraft:gold_ingot" },
    C: { item: "minecraft:creeper_head" },
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

assert(existsSync(resolve(root, "behavior_pack/scripts/main.js")));
console.log("Bellity pack validation passed: 3 items, 3 recipes, textures, names, manifests.");
