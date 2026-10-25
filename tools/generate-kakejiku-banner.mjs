import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Derive display variants without changing the editable Blockbench source.
const root = resolve(import.meta.dirname, "..");
const source = JSON.parse(readFileSync(resolve(root, "model_data/kakejiku_banner.geo.json"), "utf8"));
const base = source["minecraft:geometry"][0];
const geometries = [];
for (let direction = 0; direction < 16; direction++) {
  const geometry = structuredClone(base);
  geometry.description.identifier = `geometry.bellity.kakejiku_banner.floor_${direction}`;
  if (direction !== 0) geometry.bones[0].rotation = [0, direction * 22.5, 0];
  geometries.push(geometry);
}
const wall = structuredClone(base);
wall.description.identifier = "geometry.bellity.kakejiku_banner.wall";
wall.description.visible_bounds_offset = [0, 0, 0];
// Keep the supplied crossbar and cloth. Wall banners have no standing pole.
wall.bones[0].cubes = wall.bones[0].cubes.slice(1).map((cube) => ({
  ...cube,
  origin: [cube.origin[0], cube.origin[1] - 16, cube.origin[2] + 7],
}));
geometries.push(wall);
writeFileSync(resolve(root, "resource_pack/models/blocks/kakejiku_banner.geo.json"),
  `${JSON.stringify({ format_version: source.format_version, "minecraft:geometry": geometries }, null, 2)}\n`);
copyFileSync(resolve(root, "model_data/kakejiku_banner_texture.png"),
  resolve(root, "resource_pack/textures/blocks/kakejiku_banner_texture.png"));

const material = { "*": { texture: "kakejiku_banner", render_method: "alpha_test" } };
const permutations = [];
for (let direction = 0; direction < 16; direction++) {
  const angle = direction * Math.PI / 8;
  const corners = base.bones[0].cubes.flatMap(({ origin: [x, , z], size: [width, , depth] }) =>
    [x, x + width].flatMap((cx) => [z, z + depth].map((cz) => [
      cx * Math.cos(angle) + cz * Math.sin(angle),
      -cx * Math.sin(angle) + cz * Math.cos(angle),
    ])));
  const minX = Math.min(...corners.map(([x]) => x));
  const maxX = Math.max(...corners.map(([x]) => x));
  const minZ = Math.min(...corners.map(([, z]) => z));
  const maxZ = Math.max(...corners.map(([, z]) => z));
  permutations.push({
    condition: `q.block_state('bellity:mount') == 'floor' && q.block_state('bellity:rotation') == ${direction}`,
    components: {
      "minecraft:geometry": `geometry.bellity.kakejiku_banner.floor_${direction}`,
      "minecraft:selection_box": { origin: [minX, 0, minZ], size: [maxX - minX, 16, maxZ - minZ] },
    },
  });
}
for (const [direction, rotation] of [[0, 0], [4, 90], [8, 180], [12, 270]]) {
  permutations.push({
    condition: `q.block_state('bellity:mount') == 'wall' && q.block_state('bellity:rotation') == ${direction}`,
    components: {
      "minecraft:geometry": "geometry.bellity.kakejiku_banner.wall",
      "minecraft:transformation": { rotation: [0, rotation, 0] },
      "minecraft:selection_box": { origin: [-7, 0, 5], size: [14, 14, 3] },
    },
  });
}
// Native placement-face state is available before script placement callbacks.
// Keep support filtering independent of the script-selected visual states.
for (const face of ["up", "north", "south", "east", "west"]) {
  permutations.push({
    condition: `q.block_state('minecraft:block_face') == '${face}'`,
    components: { "minecraft:placement_filter": { conditions: [{ allowed_faces: [face] }] } },
  });
}
const block = {
  format_version: "1.21.110",
  "minecraft:block": {
    description: {
      identifier: "bellity:kakejiku_banner",
      menu_category: { category: "items", group: "minecraft:itemGroup.name.banner" },
      traits: { "minecraft:placement_position": { enabled_states: ["minecraft:block_face"] } },
      states: { "bellity:mount": ["floor", "wall"], "bellity:rotation": { values: { min: 0, max: 15 } } },
    },
    components: {
      "minecraft:display_name": "tile.bellity:kakejiku_banner.name",
      "minecraft:geometry": "geometry.bellity.kakejiku_banner.floor_0",
      "minecraft:material_instances": material,
      "minecraft:item_visual": { geometry: "geometry.bellity.kakejiku_banner.floor_0", material_instances: material },
      "minecraft:collision_box": false,
      "minecraft:selection_box": { origin: [-7, 0, -2], size: [14, 16, 3] },
      "minecraft:light_dampening": 0,
      "minecraft:destructible_by_mining": { seconds_to_destroy: 1.5 },
      "minecraft:destructible_by_explosion": { explosion_resistance: 1 },
      "minecraft:placement_filter": { conditions: [{ allowed_faces: ["up", "north", "south", "east", "west"] }] },
      "minecraft:loot": "loot_tables/blocks/kakejiku_banner.json",
      "bellity:banner": {},
    },
    permutations,
  },
};
writeFileSync(resolve(root, "behavior_pack/blocks/kakejiku_banner.json"), `${JSON.stringify(block, null, 2)}\n`);
console.log("Generated Kakejiku Banner geometry, block permutations, and unchanged texture copy.");
