import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const json = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

const bp = json("behavior_pack/manifest.json");
const rp = json("resource_pack/manifest.json");
assert.notEqual(bp.header.uuid, rp.header.uuid);
assert(bp.dependencies.some((d) => d.uuid === rp.header.uuid));
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
  assert.equal(item.components["minecraft:damage"], damage);
  assert.equal(item.components["minecraft:durability"].max_durability, durability);
  assert.equal(atlas[file].textures, `textures/items/${file}`);

  const png = readFileSync(resolve(root, `resource_pack/textures/items/${file}.png`));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert(png.readUInt32BE(16) > 0 && png.readUInt32BE(20) > 0);

  for (const locale of languages) {
    const lines = readFileSync(resolve(root, `resource_pack/texts/${locale}.lang`), "utf8");
    assert(lines.includes(`item.${id}.name=`));
  }
}

for (const [file, expectedRows, expectedKeys] of [
  ["bellity_sword", ["HG ", " C ", " B "], ["H", "G", "C", "B"]],
  ["sun_bigman_light", ["T  ", " A ", "  R"], ["T", "A", "R"]],
]) {
  const recipe = json(`behavior_pack/recipes/${file}.json`)["minecraft:recipe_shaped"];
  assert.deepEqual(recipe.pattern, expectedRows);
  assert.deepEqual(Object.keys(recipe.key).sort(), expectedKeys.sort());
  assert.equal(recipe.result.item, `bellity:${file}`);
}

assert(existsSync(resolve(root, "behavior_pack/scripts/main.js")));
console.log("Bellity pack validation passed: 3 items, 2 recipes, textures, names, manifests.");
