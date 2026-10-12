const OPEN_STATE = "bellity:open";
const POWERED_STATE = "bellity:powered";
const NEIGHBORS = [
  { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 },
];

function setOpen(block, open, permutation = block.permutation) {
  const changed = permutation.getState(OPEN_STATE) !== open;
  block.setPermutation(permutation.withState(OPEN_STATE, open));
  if (changed) {
    block.dimension.playSound(open ? "open.wooden_trapdoor" : "close.wooden_trapdoor", block.center());
  }
}

function isPowered(block) {
  if ((block.getRedstonePower() ?? 0) > 0) return true;
  // Stable server 2.0 has no custom-block redstone update callback. Poll
  // adjacent powered blocks; directional circuit parity needs device checks.
  return NEIGHBORS.some((offset) => {
    try {
      return (block.offset(offset)?.getRedstonePower() ?? 0) > 0;
    } catch {
      // A neighboring chunk can be unloaded, or outside world height limits.
      return false;
    }
  });
}

function updatePower({ block }) {
  try {
    const powered = isPowered(block);
    const permutation = block.permutation;
    if (powered === permutation.getState(POWERED_STATE)) return;
    setOpen(block, powered, permutation.withState(POWERED_STATE, powered));
  } catch (error) {
    console.warn(`Decorate Trapdoor redstone update failed: ${error}`);
  }
}

export function registerDecorateTrapdoor(blockComponentRegistry) {
  blockComponentRegistry.registerCustomComponent("bellity:trapdoor", {
    beforeOnPlayerPlace(event) {
      // Side placement hinges against the supporting block.
      const hinge = { North: "south", South: "north", East: "west", West: "east" }[event.face];
      if (hinge) event.permutationToPlace = event.permutationToPlace.withState("minecraft:cardinal_direction", hinge);
    },
    onPlayerInteract({ block, player }) {
      if (!player || player.isSneaking) return;
      try {
        setOpen(block, !block.permutation.getState(OPEN_STATE));
      } catch (error) {
        console.warn(`Decorate Trapdoor interaction failed: ${error}`);
      }
    },
    onPlace: updatePower,
    onTick: updatePower,
  });
}
