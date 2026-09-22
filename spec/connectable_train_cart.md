# Connectable Train Cart Design Specification

## Summary

| Field | Specification |
|---|---|
| Entity ID | `bellity:connectable_train_cart` |
| Item ID | `bellity:connectable_train_cart` |
| Japanese name | 連結トロッコ |
| English name | Connectable Train Cart |
| Appearance | Vanilla minecart appearance |
| Train size | Up to 8 carts: 1 head and 7 followers |
| Normal spacing | 1.5 blocks between cart centers |
| Current acquisition | Crafting, Creative inventory, or `/summon bellity:connectable_train_cart` |
| Creative inventory group | Items > Minecarts (`minecraft:itemGroup.name.minecart`) |

The Connectable Train Cart is a custom entity that can be joined into a train. It does not modify vanilla minecarts. The head follows normal rail movement, while followers reproduce the recorded path of the head so that the train can travel around curves and over slopes.

## Acquisition

The recipe produces one Connectable Train Cart placement item. Use the item on a normal, powered, detector, or activator rail to place `bellity:connectable_train_cart`. The item has a maximum stack size of one and belongs to the Minecarts group in the Items tab of the Creative inventory.

| | | |
|---|---|---|
| Empty | Empty | Empty |
| Empty | Minecart (`M`) | Chain (`C`) |
| Empty | Empty | Empty |

Recipe pattern: `["   ", " MC", "   "]`

- `M`: `minecraft:minecart`
- `C`: `minecraft:chain`

## Connecting Carts

The connection tool is `minecraft:chain`. Connecting carts uses two interactions:

1. While holding a Chain, interact with the head or any member of the train to select that train. An unconnected cart may be selected as the head of a new train.
2. While still holding the Chain, interact with a standalone Connectable Train Cart within 6 blocks of the selected train's tail.
3. If the train has fewer than 8 carts, append the standalone cart after the current tail.
4. Immediately move the appended cart to the position behind the preceding tail, with 1.5 blocks between their centers. This prevents a newly connected cart from remaining at its old, separate position.

The Chain is not consumed. A connection must be rejected without changing either train when the second cart is already part of a train, the target is more than 6 blocks from the selected train's tail, the selected train has 8 carts, or the selected cart is no longer valid. Two existing trains cannot be merged.

The player must be given clear feedback when the first cart is selected, when a cart is connected, and when a connection is rejected.

## Entity States

The entity has two behavior states:

- Head mode is the default state. It retains minecart rail movement and can receive acceleration from powered rails.
- Follower mode disables independent movement and physical interference as far as the Bedrock entity API permits. The script controls its position and rotation.

The behavior pack provides events for switching a cart into follower mode and for promoting a follower back to head mode.

## Train Data

Each cart stores persistent dynamic properties sufficient to reconstruct the train relationship:

| Property | Type | Purpose |
|---|---|---|
| `train_id` | String | Stable identifier shared by all carts in one train; absent on a standalone cart. |
| `car_index` | Number | Position in the train, from `0` for the head through `7`. |
| `head_id` | String | Entity ID of the train head; the head stores its own ID. |
| `train_length` | Number | Persisted total number of carts, used to prevent linking while part of a train is unloaded. |

The script must not infer a merge merely because carts are physically close. Only a successful two-interaction Chain operation changes membership.

## Follower Movement

The script records the head cart's location and rotation on each update. Each follower uses the recorded route at a path distance corresponding to its index and the 1.5-block center spacing. Tracking by traveled path, rather than a direct offset from the head, is required so followers reproduce curves and slopes.

Immediately after connection, before enough new history exists, the new follower starts at the calculated position directly behind the preceding tail. Tracking must not briefly return it to its pre-connection location.

Only the head reacts independently to powered rails. Followers remain subordinate to the recorded trajectory and must not gain their own powered-rail acceleration.

## Recovery and Failure Handling

- If the head or required route history is in an unloaded chunk, follower updates pause rather than moving carts to invalid positions.
- If any connected cart is destroyed, a persistent pending repair pauses that train until all expected survivors are loaded. The former second cart is promoted when the head was destroyed, remaining indices and head references are updated together, and the promoted cart returns to head mode. Persisting the pending repair prevents a world reload from orphaning later-loaded carts.
- Because route history is held in memory, a world reload must initialize safe history from the saved cart positions or pause movement until usable history exists.
- Invalid or missing carts must be removed from the script's in-memory tracking data without producing repeated Content Log errors.

## Verification Status

Source validation can confirm the entity/resource definitions, identifiers, dynamic-property usage, connection guards, 6-block limit, 8-cart limit, non-consumption of the Chain, initial 1.5-block placement, and follower-tracking code paths. It does not prove rail behavior in Minecraft.

On 2026-09-22, `node --check behavior_pack/scripts/main.js` completed successfully. `node tools/validate.mjs` parsed every Behavior Pack and Resource Pack JSON file and reported `Bellity pack validation passed: 5 items, 5 recipes, light ball, freeze effect, connectable train cart, textures, names, manifests.` `git diff --check` also completed successfully, with only the existing Windows line-ending notices. The `.mcaddon` package was not built, and development packs were not installed during this validation.

Later on 2026-09-22, the Content Log reported that `minecraft:damage_sensor.triggers.deals_damage` rejected the Boolean value `false`. The entity definition was corrected to the schema string `"no"`, preserving immunity to fall damage, and `tools/validate.mjs` gained a regression assertion for that exact value. `node tools/validate.mjs`, `node --check behavior_pack/scripts/main.js`, and `git diff --check` then completed successfully. `install-dev.ps1 -Update` updated both development packs, and `tools/verify-dev.ps1` hash-verified 14 Behavior Pack files and 20 Resource Pack files. Minecraft still needs to reload the pack before absence of the Content Log error can be confirmed; matching installed files does not prove runtime behavior.

The crafting implementation was added on 2026-09-22 with the exact pattern `["   ", " MC", "   "]`. The result is a native entity-placer item restricted to the four rail block types. `node tools/validate.mjs` reported `Bellity pack validation passed: 6 items, 6 recipes, light ball, freeze effect, connectable train cart, textures, names, manifests.` `node --check behavior_pack/scripts/main.js` and `git diff --check` also completed successfully, with only the existing Windows line-ending notices. `install-dev.ps1 -Update` updated both development packs, and `tools/verify-dev.ps1` hash-verified 16 Behavior Pack files and 20 Resource Pack files. Crafting, icon rendering, item consumption, and rail placement remain pending in-game verification.

The item was assigned to `minecraft:itemGroup.name.minecart` on 2026-09-22. The subsequent geometry error was caused by the runtime and editable geometry files declaring `geometry.minecart` while the client entity requested `geometry.bellity.connectable_train_cart`. Both geometry declarations were corrected to the requested identifier. `node tools/validate.mjs` then reported `Bellity pack validation passed: 6 items, 6 recipes, light ball, freeze effect, connectable train cart, textures, names, manifests.` `node --check behavior_pack/scripts/main.js` and `git diff --check` also passed, with only the existing Windows line-ending notices. `install-dev.ps1 -Update` updated both development packs, and `tools/verify-dev.ps1` hash-verified 16 Behavior Pack files and 20 Resource Pack files. Absence of the Geometry and Molang Content Log errors remains pending confirmation after Minecraft reloads the corrected development packs.

The following behavior remains pending until it is tested in Minecraft Bedrock and recorded in `tests/test_checklist.md`: the exact crafting recipe, placement-item icon and name, placement in the Creative inventory's Minecarts group, item consumption in Survival, placement on each supported rail type, rejection away from rails, two-interaction connection feedback, immediate placement behind the tail, visual spacing, curves, slopes, powered rails, head destruction, chunk loading, world reload, Creative availability, vanilla appearance, and multiplayer behavior.
