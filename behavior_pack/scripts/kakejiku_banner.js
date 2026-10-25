const MOUNT_STATE = "bellity:mount";
const ROTATION_STATE = "bellity:rotation";

// The supplied model faces north. Positive geometry rotations turn it west.
const WALL_ROTATIONS = { North: 0, West: 4, South: 8, East: 12 };

export function registerKakejikuBanner(blockComponentRegistry) {
  blockComponentRegistry.registerCustomComponent("bellity:banner", {
    beforeOnPlayerPlace(event) {
      try {
        let mount;
        let rotation;
        if (event.face === "Up") {
          if (!event.player) {
            event.cancel = true;
            return;
          }
          const yaw = event.player.getRotation().y;
          if (!Number.isFinite(yaw)) throw new Error("Invalid player rotation");
          mount = "floor";
          rotation = ((Math.round((yaw + 180) / 22.5) % 16) + 16) % 16;
        } else if (typeof WALL_ROTATIONS[event.face] === "number") {
          mount = "wall";
          rotation = WALL_ROTATIONS[event.face];
        } else {
          event.cancel = true;
          return;
        }

        event.permutationToPlace = event.permutationToPlace
          .withState(MOUNT_STATE, mount)
          .withState(ROTATION_STATE, rotation);
      } catch (error) {
        event.cancel = true;
        console.warn(`Kakejiku Banner placement failed: ${error}`);
      }
    },
  });
}
