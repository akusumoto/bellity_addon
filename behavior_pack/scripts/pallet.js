import { ActionFormData } from "@minecraft/server-ui";
import { Direction } from "@minecraft/server";

const CONCRETE_OPTIONS = [
  { label: "赤", icon: "textures/blocks/concrete_red" },
  { label: "オレンジ", icon: "textures/blocks/concrete_orange" },
  { label: "黄色", icon: "textures/blocks/concrete_yellow" },
  { label: "緑", icon: "textures/blocks/concrete_green" },
  { label: "空色", icon: "textures/blocks/concrete_light_blue" },
  { label: "青", icon: "textures/blocks/concrete_blue" },
  { label: "紫", icon: "textures/blocks/concrete_purple" },
  { label: "桃", icon: "textures/blocks/concrete_pink" },
];
const openForms = new Set();
const FACE_OFFSETS = {
  [Direction.Down]: { x: 0, y: -1, z: 0 },
  [Direction.Up]: { x: 0, y: 1, z: 0 },
  [Direction.North]: { x: 0, y: 0, z: -1 },
  [Direction.South]: { x: 0, y: 0, z: 1 },
  [Direction.West]: { x: -1, y: 0, z: 0 },
  [Direction.East]: { x: 1, y: 0, z: 0 },
};

function getPlacementTarget(player) {
  const hit = player.getBlockFromViewDirection({ maxDistance: 6 });
  const offset = hit && FACE_OFFSETS[hit.face];
  if (!offset) return undefined;
  return {
    dimension: player.dimension,
    location: {
      x: hit.block.location.x + offset.x,
      y: hit.block.location.y + offset.y,
      z: hit.block.location.z + offset.z,
    },
  };
}

export async function openPallet({ source: player }) {
  if (player.typeId !== "minecraft:player" || !player.isValid || openForms.has(player.id)) return;
  openForms.add(player.id);
  try {
    const target = getPlacementTarget(player);
    const form = new ActionFormData()
      .title({ translate: "item.bellity:pallet.name" })
      .body("セットするコンクリートを選択");
    for (const option of CONCRETE_OPTIONS) {
      form.button(option.label, option.icon);
    }
    const response = await form.show(player);
    if (response.canceled || !player.isValid) return;
    const option = CONCRETE_OPTIONS[response.selection];
    if (!option) return;
    if (!target || player.dimension.id !== target.dimension.id ||
        Math.hypot(player.location.x - (target.location.x + 0.5),
          player.location.y - (target.location.y + 0.5),
          player.location.z - (target.location.z + 0.5)) > 7) {
      player.sendMessage("Aim at a nearby block before using the Pallet.");
      return;
    }
    const block = target.dimension.getBlock(target.location);
    if (!block?.isAir) {
      player.sendMessage("The Pallet needs an empty space beside the targeted block.");
      return;
    }
    const color = option.icon.slice("textures/blocks/concrete_".length);
    block.setType(`minecraft:${color}_concrete`);
  } catch (error) {
    console.warn(`Pallet form failed: ${error}`);
  } finally {
    openForms.delete(player.id);
  }
}
