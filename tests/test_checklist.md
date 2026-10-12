# Bellity Addon Device Checklist

- [ ] Chotto Netherite Axe crafts at a crafting table with Netherite Ingots in the top left and top middle slots, and Sticks in the center and bottom center slots.
- [ ] No recipe error appears in the Content Log after reloading the updated development pack.

Target Version: ____ Date Checked: ____

- [ ] Can apply the Bellity Addon BP/RP to the world, and there are no errors in the Content Log.
- [ ] All custom items and the Air Block can be obtained with `/give`.
- [ ] The Japanese and English display names, inventory images, and placed-block rendering are correct.
- [ ] The Bellity Sword can be crafted with the specified 3x3 layout.
- [ ] The Bellity Sword has an attack damage of 32 and a durability of 1233.
- [ ] One item from the candidates drops on every valid hit with the Bellity Sword.
- [ ] The Chotto Netherite Axe has an attack damage of 6 and a durability of 1200.
- [ ] Wood blocks can be mined faster than usual with the Chotto Netherite Axe.
- [ ] The Gizagiza Sword can be obtained with `/give @s bellity:gizagiza_sword`.
- [ ] The Gizagiza Sword is displayed with an appearance based on `model_data/gizagiza_sword.png`, and the Japanese name "ギザギザ剣" and English name "Gizagiza Sword" are correct.
- [ ] The Gizagiza Sword has an attack damage of 10 and a durability of 1200.
- [ ] Under the conditions of no enchantments, no sprinting, and the same target and terrain, the knockback distance of the Gizagiza Sword is approximately twice that of a normal sword.
- [ ] No script error appears in the Content Log even if the target is almost directly above or below, or if the position cannot be obtained upon hitting with the Gizagiza Sword.
- [ ] The Gizagiza Sword can be crafted in a 3x3 layout by placing an Iron Ingot in the top center, Iron Ingots in all 3 middle slots, and a Stick in the bottom center.
- [ ] The Sun Bigman Light can be crafted with the specified 3x3 layout.
- [ ] Using the Sun Bigman Light shoots a light ball and reduces durability by 1.
- [x] The fired light ball is displayed with an appearance based on `model_data/sunlight_ball.png` and does not look like a standard snowball (Confirmed by user on 2026-09-21).
- [ ] The initial velocity, trajectory, gravity, flight distance, and hitbox of the light ball are the same as a standard snowball.
- [ ] The same sound as a standard snowball plays when thrown.
- [ ] Like a standard snowball, no unique hit sound plays when hitting an entity or block.
- [ ] The same particles as a standard snowball are displayed when hitting an entity or block.
- [ ] Hitting with the light ball deals 10 damage and inflicts burning for 5 seconds.
- [ ] No errors occur in the damage and burning processes even if the light ball hits a block.
- [ ] The throwing weapon breaks when durability runs out.
- [ ] The Creepy Horse Eye can be crafted in a 3x3 layout by surrounding an Ender Eye in the center with 8 Coal.
- [ ] After applying or reloading the packs, `main.js` loads without an early-execution `MolangVariableMap` constructor error in the Content Log.
- [ ] Holding the Creepy Horse Eye and right-clicking activates it on the spot without consuming the item.
- [ ] Each successful Creepy Horse Eye activation plays `model_data/creepy_horse_eye_activate.ogg` exactly once without a Content Log error, including the first use and later uses after the cooldown; record its audible range and nearby-player behavior.
- [ ] On the first activation after loading the world, white particles appear without a script error in the Content Log.
- [ ] Only enemies in the `monster` family within a 7-block radius of the player at activation remain anchored and retain their captured body/head direction for 10 seconds.
- [ ] Enemies outside the effect range, enemies that enter the range after activation, players, friendly mobs, items, and projectiles do not freeze.
- [ ] During the freeze, walking, flying, turning, knockback, falling, and movement by water currents are corrected every tick.
- [ ] Frozen enemies visibly tremble slightly around the captured position without drifting away, and return to the exact captured position when the effect ends.
- [ ] After 10 seconds, frozen enemies can move and turn normally again.
- [ ] Verify and record any attacks, ability processing, vocalizations, or model animations that continue during the freeze; stable Script API 2.0.0 cannot universally suspend these for arbitrary vanilla mobs.
- [ ] Cannot be reused for 20 seconds after activation, and can be reused after 20 seconds.
- [ ] White particles are displayed within a 7-block radius sphere only during the effect, and do not remain after it wears off.
- [ ] No script error appears in the Content Log even with enemy death, despawning, dimension travel, multiple entities, or overlapping use by multiple players.
- [ ] Weapons are retained even if you save and reload the world.

## Connectable Train Cart

- [ ] The exact 3x3 recipe with a Minecart in the center and a Chain to its right produces one Connectable Train Cart placement item.
- [ ] The placement item appears in the Items tab's Minecarts group in the Creative inventory, can be obtained with `/give @s bellity:connectable_train_cart`, displays the supplied Connectable Train Cart icon and localized name, and stacks to one.
- [ ] In Survival, using the placement item on normal, powered, detector, and activator rails consumes one item and creates `bellity:connectable_train_cart` on the selected rail.
- [ ] Using the placement item away from a supported rail does not place the entity or consume the item.
- [ ] The entity can also be created with `/summon bellity:connectable_train_cart ~ ~ ~`.
- [ ] Its Japanese name is "連結トロッコ," its English name is "Connectable Train Cart," and its appearance matches a vanilla minecart.
- [ ] The cart body is aligned lengthwise with straight rails rather than rendered sideways, and its orientation follows curves and slopes correctly.
- [ ] While holding a Chain, interacting with a head, standalone cart, or member of a train selects the corresponding train and gives clear selection feedback.
- [ ] After selecting a train, interacting with a standalone cart within 6 blocks of its tail appends it after the current tail and gives clear success feedback.
- [ ] Connecting a cart does not consume the Chain.
- [ ] The newly connected cart is immediately moved behind the preceding tail instead of remaining at its old position, with approximately 1.5 blocks between cart centers.
- [ ] A cart more than 6 blocks from the selected train's tail is not connected and clear rejection feedback is given.
- [ ] Selecting a train and then interacting with a cart that already belongs to another train does not merge the trains.
- [ ] A ninth cart cannot be appended to an eight-cart train, and rejection does not change the existing train.
- [ ] Only the head accelerates independently on powered rails; followers remain subordinate and maintain approximately 1.5-block center spacing.
- [ ] Followers reproduce the head's route around straight rails, curves, ascending rails, and descending rails without visibly cutting corners, derailing, or accumulating separation.
- [ ] Destroying the head promotes the second cart, preserves the remaining order, and allows the promoted cart to move as a head.
- [ ] Saving and reloading the world preserves train membership and order without snapping followers to invalid positions or producing Content Log errors.
- [ ] Unloading and reloading chunks containing all or part of a train does not scatter or delete carts and produces no repeated Content Log errors.
- [ ] Two players connecting or operating different trains do not overwrite each other's selection or train state.

All Connectable Train Cart checks above are pending in-game verification. Source validation or matching deployed-file hashes must not be used to mark them complete.

## Air Block

- [ ] `/give @s bellity:air_block` and the Creative inventory provide the block, with the Japanese name "空気ブロック" and English name "Air Block".
- [ ] The exact nine-White-Concrete crafting recipe produces one Air Block.
- [ ] Air Blocks stack to 64.
- [ ] Inventory rendering and the placed model match `model_data/air_block.geo.json` and `model_data/air_block_texture.png` from all sides without missing textures or geometry errors.
- [ ] Placement, default solid cube collision, and selection work correctly.
- [ ] Breaking and dropped-item behavior work correctly; record observed breaking time and blast behavior while explicit balance values remain TODO.
- [ ] Placed blocks remain correct after saving and reloading the world.

## Air Sword

- [ ] `/give @s bellity:air_sword` and the Creative inventory provide the sword, with the Japanese name "空気ソード", English name "Air Sword", and unchanged image from `model_data/air_sword.png`.
- [ ] The exact recipe with Air Blocks in the top-center and middle-center slots and Black Concrete in the bottom-center slot produces one Air Sword.
- [ ] Air Swords stack to one and appear in the sword equipment group with correct handheld rendering.
- [ ] Under controlled conditions, total attack damage is 6.
- [ ] Repeated successful hits and normal sword use never consume durability or break the sword.
- [ ] Successful hits apply Levitation I for 10 seconds to eligible living targets; missed or unsuccessful attacks do not apply it.
- [ ] Repeated hits refresh the effect duration without increasing its level.
- [ ] Friendly mobs and players with damage enabled can receive the effect, and vanilla immune targets retain their immunity.
- [ ] Target death, despawning, and overlapping multiplayer attacks do not produce Content Log errors.
- [ ] Saving and reloading preserves the sword and its behavior.

All Air Block and Air Sword checks above are pending in-game verification. Source checks do not establish these runtime results.

## Pallet

- [ ] The Creative inventory and `/give @s bellity:pallet` provide the item, with English name "Pallet", Japanese name "パレット", the unchanged image from `model_data/pallet.png`, and maximum stack size one.
- [ ] The exact recipe `[" T ", "TBT", "TPT"]` using Spruce Planks, a Brush, and Purple Concrete produces one Pallet.
- [ ] Using the item opens the server form with body "セットするコンクリートを選択" and ordered buttons "赤", "オレンジ", "黄色", "緑", "空色", "青", "紫", "桃", each with the matching concrete icon; "空色" uses Light Blue Concrete.
- [ ] Each selection places one matching concrete block in the empty cell adjacent to the captured aimed face. Verify all eight colors and all six block faces.
- [ ] The target is captured when the menu opens, with a six-block raycast; aiming elsewhere while choosing does not change the destination.
- [ ] Cancellation, missing targets, occupied destinations, moving beyond the response reach, and dimension changes place no concrete. Existing blocks remain intact.
- [ ] The Pallet is retained after use, and placement requires no concrete inventory.
- [ ] Rapid repeated use does not open duplicate forms, and simultaneous players do not share targets or choices.
- [ ] UI cancellation, player disconnection, unloaded destinations, and world-height boundaries produce no unhandled script errors; later uses still work.
- [ ] Saving and reloading preserves the Pallet and placed concrete. Pack loading, menu icons, and use produce no Content Log errors.

All Pallet checks above are pending in-game verification. Source validation and mock callbacks do not establish these runtime results.

## Decorate Trapdoor

- [ ] Japanese name is 模様付きのトラップドア; English name is Decorate Trapdoor. Creative grouping, `/give @s bellity:decorate_trapdoor`, and stack size 64 work.
- [ ] Exact `QBQ / QSQ / QBQ` recipe consumes six Quartz Blocks, two Black Dyes, and one Sea Lantern, producing one trapdoor.
- [ ] Supplied texture and model render in inventory, hand, and world without Content Log errors.
- [ ] Check all four directions and top/bottom halves, including angled side placement. Hinge is against the support; closed plates are 3/16 block thick and open plates remain inside their cell.
- [ ] Interaction toggles once and plays the appropriate trapdoor sound. Sneaking permits adjacent placement. Multiple players see the same state.
- [ ] Collision and selection follow the plate in all 16 direction/half/open combinations; an open plate permits passage through the remaining cell.
- [ ] Lever, button, dust, and powered-block rising/falling edges open/close the trapdoor. Manual toggles remain until the next power edge. Record directional repeater/comparator/observer polling limitations.
- [ ] Breaking normally drops one trapdoor. Saving/reloading preserves placement and open state; loaded trapdoors resume power checks.
- [ ] Test world-height and unloaded-neighbor boundaries without script errors. Waterlogging, ladder climbing, and piston parity are compatibility gaps and require separate follow-up.

All Decorate Trapdoor checks above remain pending in Minecraft. On 2026-10-12, `node tools/validate.mjs`, syntax checks for all three Behavior Pack scripts, and `git diff --check` passed. Validation covers the exact recipe and texture, geometry variants, all 16 visual/collision permutations, six placement faces, and mocked manual/power transitions. Source checks and mocked callbacks do not establish in-game behavior.

On 2026-10-12, source validation and syntax checks for `scripts/main.js`, `scripts/decorate_trapdoor.js`, and `scripts/pallet.js` passed before deployment. `install-dev.ps1 -Update` successfully updated both installed development packs, and `tools/verify-dev.ps1` confirmed matching file counts and SHA-256 hashes for all 28 Behavior Pack files and 28 Resource Pack files. No `.mcaddon` package was built. Reload the Minecraft world to load the updated packs; all Decorate Trapdoor in-game checks remain pending.

### Decorate Trapdoor Parsing Fix: 2026-10-12

The device Content Log reported that `itemGroup.name.trapdoor` lacked a namespace, preventing the block from parsing. The missing block then caused invalid recipe-result errors and an unused `bellity:trapdoor` component warning. Corrected the Creative group to `minecraft:itemGroup.name.trapdoor` and added source validation for namespaced block groups. Source validation passed. Updated both development packs and verified all 28 Behavior Pack files and 28 Resource Pack files by count and SHA-256. Rebuilt `dist/bellity_addon.mcaddon` and confirmed all 56 packaged files match the source. Reload the world and recheck the Content Log; device confirmation of this fix is pending.

## Development Deployment Record: 2026-10-12

After correcting the Air Sword texture to use `model_data/air_sword.png`, source validation and both script syntax checks passed again. The installed Resource Pack still contained the previous Air Sword texture before the update. `install-dev.ps1 -Update` deployed the correction, and `tools/verify-dev.ps1` confirmed that all 24 Behavior Pack files and 26 Resource Pack files match the source by file count and SHA-256 hash. Reload the Minecraft world to load the corrected texture; its in-game appearance remains pending verification.

Source validation (`node tools/validate.mjs`) and JavaScript syntax checks for `scripts/main.js` and `scripts/pallet.js` passed. `install-dev.ps1 -Update` updated both installed development packs, including the current Air Block, Air Sword, and Pallet files. `tools/verify-dev.ps1` confirmed matching file counts and SHA-256 hashes for all 24 Behavior Pack files and 26 Resource Pack files. No `.mcaddon` package was built. Reload the Minecraft world to load the updated packs; Pallet device checks remain pending.
