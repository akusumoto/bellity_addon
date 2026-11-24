# Bellity Addon Device Checklist

## Distribution Package: 2026-11-21

Rebuilt `dist/bellity_addon.mcaddon` with the current user-supplied sword textures, Behavior Pack 1.0.14, and Resource Pack 1.0.10. All Behavior Pack script syntax checks and source validation passed. Package verification confirmed all 78 entries match the source by SHA-256 and use forward-slash paths, without unexpected or duplicate entries. This packaging step did not update installed development packs or establish additional in-game results.

## Wind Sword Artwork Refresh: 2026-11-20

Copied the updated `model_data/wind_sword.png` unchanged to `resource_pack/textures/items/wind_sword.png`. Source validation passed, including equality between the supplied and runtime PNGs. Updated the development packs to BP 1.0.14 and RP 1.0.10, with the matching RP dependency. Installed-file verification confirmed SHA-256 equality for all 40 BP files and 38 RP files. The new Wind Sword appearance remains pending in-game verification. No `.mcaddon` was rebuilt.

## Sword Artwork Deployment: 2026-11-20

Copied the user-supplied Wind Sword and Osu Sword PNGs unchanged from `model_data/` to their runtime item-texture paths. Source validation passed. `install-dev.ps1 -Update` deployed Behavior Pack 1.0.13 and Resource Pack 1.0.9, with the BP dependency matching RP 1.0.9. `tools/verify-dev.ps1` confirmed matching file counts and SHA-256 hashes for all 40 Behavior Pack files and 38 Resource Pack files. The supplied `.bbmodel` projects remain editable sources; runtime rendering remains a flat item icon with no geometry changes. New-image appearance in Minecraft remains pending verification. No `.mcaddon` was rebuilt; the existing distribution archive still contains the previous artwork.

## Distribution Package: 2026-11-19

Created `dist/bellity_addon.mcaddon` after user confirmation of the corrected sword movement. The archive contains Behavior Pack 1.0.12 and Resource Pack 1.0.8; the BP dependency matches RP 1.0.8. All Behavior Pack script syntax checks and source validation passed. Package verification confirmed all 78 archive files match the source by SHA-256, with forward-slash entry paths and no unexpected or duplicate entries. Package import on another device remains unverified. This packaging step did not update installed development packs.

## Wind Sword and Osu Sword

The user has confirmed the corrected main movement behavior in Minecraft Bedrock; other checks in this section remain pending. User-supplied images replaced the generated placeholders on 2026-11-20; their in-game rendering remains unverified. Source validation and mock tests do not establish rendering, damage, collision, or movement distances. Deployment and packaging results are recorded separately below.

Source verification on 2026-11-19 passed pack validation, syntax checks for both modified/new runtime scripts, and 15 isolated knockback-sword tests. Tests cover positive melee attribution, event ordering, projectile and unrelated-damage rejection, native-motion resistance estimates, additive sprint/enchantment velocity, repeated slides, obstacle stalling, and invalid/dimension-changed targets. Movement distances and the resistance estimate remain unverified in Minecraft. No `.mcaddon` was built and no installed development packs were updated.

Subsequent development deployment on 2026-11-19: repeated source validation, both script syntax checks, all 15 mock tests, and `git diff --check` passed. `install-dev.ps1 -Update` updated the existing Bellity BP and RP. `tools/verify-dev.ps1` confirmed matching file counts and SHA-256 hashes for all 39 Behavior Pack files and 38 Resource Pack files, including both swords, recipes, the shared script, and temporary textures. No `.mcaddon` was built. Reload the Minecraft world; all device checks below remain pending.

Device failure reported on 2026-11-19: Osu Sword hits did not produce the requested 10-block slide, and Wind Sword hits did not produce the requested 7-block rise and 5-block horizontal travel. These were failed device results, despite the preceding source and deployment checks. The runtime correction removes velocity-sample inference as an activation gate and replaces same-tick contact matching with sword-specific hit callbacks correlated with positive melee damage within two ticks. This failure record is superseded for the main movement behavior by the user confirmation below; resistance and other detailed behavior remain unverified.

Correction deployed on 2026-11-19 as Behavior Pack version 1.0.12: pack validation, syntax checks for `main.js`, `knockback_swords.js`, and `knockback_resistance.js`, all 23 regression/model tests, and `git diff --check` passed. Regression tests include first hits without native velocity changes and events crossing tick boundaries. Isolated motion models cover the approximate 7-block rise/5-block horizontal launch and 10-block slide; they do not establish Minecraft results. `install-dev.ps1 -Update` updated both development packs, and `tools/verify-dev.ps1` confirmed matching counts and SHA-256 hashes for all 40 Behavior Pack files and 38 Resource Pack files. No `.mcaddon` was built. Reload the world and retest both swords on unobstructed flat ground against a non-resistant mob without sprinting or Knockback enchantments.

User confirmation on 2026-11-19: after the correction was deployed, the user confirmed that both reported movement issues were fixed in Minecraft. This records successful correction of the Osu Sword's requested slide and the Wind Sword's requested launch. No exact measurement log, tested entity, device details, or separate results for recipes, enchantments, resistance, water, or multiplayer were supplied.

Artwork update on 2026-11-20: user-supplied `model_data/wind_sword.png` and `model_data/osu_sword.png` replace the generated temporary images at the runtime item-texture paths. The corresponding `.bbmodel` files remain editable source assets. Runtime rendering remains a flat item icon; no geometry changes are included. The original generated PNGs remain as historical assets. Inventory and handheld rendering of the new artwork require fresh device verification.

- [ ] Both swords load without Content Log errors, appear in the Creative sword group, stack to one, and are obtainable with `/give @s bellity:wind_sword` and `/give @s bellity:osu_sword`.
- [ ] Names are Wind Sword / ウィンドソード and Osu Sword / オスソード; the user-supplied images added on 2026-11-20 render correctly in inventory and first-person and third-person hand views.
- [ ] Wind Sword has total attack damage 9 and maximum durability 1927; Osu Sword has total attack damage 6 and maximum durability 2032. Check durability consumption and breakage separately.
- [ ] Wind Sword recipe ` C /GWG/DSD` consumes one Wind Charge, two Short Grass, two Sticks, and two Water Bottles, producing one sword. Tall Grass, Grass Blocks, diamonds, empty bottles, and non-water potions are rejected.
- [ ] Osu Sword recipe `AAP/AAP/ S ` consumes four custom Air Blocks, two Poppies, and one Stick, producing one sword.
- [ ] Both swords support vanilla Bedrock sword enchantments, levels, mutual exclusions, and acquisition methods. No unspecified material repair is available.
- [ ] Damaging melee hits against hostile mobs, passive mobs, and damage-enabled players activate the ability; misses, fully blocked hits, PvP-disabled damage, projectile damage, and other unrelated damage do not.
- [ ] Wind Sword produces a vanilla Wind Charge impact visual and sound at the struck target, without a projectile, area damage, separate impact damage, or block interaction.
- [x] User confirmed that the corrected Wind Sword resolves the reported 7-block rise and 5-block horizontal-travel behavior on 2026-11-19. Exact measurements, target, device, and conditions were not supplied.
- [x] User confirmed that the corrected Osu Sword resolves the reported 10-block slide behavior on 2026-11-19. Exact measurements, target, device, and conditions were not supplied.
- [ ] Record measured baseline distances for both swords on unobstructed flat ground, against a stationary target without resistance, sprinting, or Knockback enchantments. Check separately that Osu Sword adds no upward launch.
- [ ] Normal sprint and Knockback-enchantment bonuses remain additive for each sword, including when both bonuses apply together.
- [ ] Resistance reduces the special movement and immunity prevents it, including bosses and players wearing resistant equipment. Record resistance-helper coverage and limitations for custom entities.
- [ ] Walls and ceilings block movement; neither sword teleports targets through terrain. Slopes, cliffs, water, currents, and airborne motion affect distance naturally.
- [ ] Targets retain normal fall damage. Damaging hits while airborne or already sliding can reactivate the appropriate movement, with no additional cooldown.
- [ ] A new Osu Sword hit restarts sliding from the current position away from the latest attacker, rather than extending the previous destination.
- [ ] Target death, despawning, dimension changes, repeated attacks, and multiple attackers cause no stale movement state or Content Log errors. Reloading the world preserves the items and resumes normal behavior.

## General Weapons and Pack Loading

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

## Gold Shield

- [ ] `/give @s bellity:gold_shield` and the Creative inventory provide the item, with English name "Gold Shield", Japanese name "ゴールド盾", and maximum stack size one.
- [ ] The exact `["WGW", "WWW", " W "]` crafting-table recipe consumes six Warped Planks and one Gold Ingot and produces one Gold Shield.
- [ ] The item has maximum durability 551 and can be placed in the offhand slot.
- [ ] The inventory image matches `model_data/gold_shield.png`; the held model matches the bones and UV data from `model_data/gold_shield.geo.json`, using the unchanged supplied texture and namespaced runtime geometry without Content Log errors.
- [ ] Check first-person and third-person rendering in the main hand and offhand, including ordinary held and sneaking poses.
- [ ] Saving and reloading preserves the item. Record observed damage and durability behavior separately; shield blocking, damage protection, and durability consumption on blocking are not implemented.

All Gold Shield checks above are pending in-game verification. Blocking behavior remains TODO. Source validation and matching deployed-file hashes do not establish in-game behavior.

On 2026-10-25, `node tools/validate.mjs`, syntax checks for all three Behavior Pack scripts, and `git diff --check` passed. Validation covers durability 551, the exact recipe, both names, the byte-identical supplied texture, unchanged geometry except its namespaced identifier, and attachable animation/render references. `install-dev.ps1 -Update` updated both development packs; `tools/verify-dev.ps1` confirmed matching file counts and SHA-256 hashes for all 30 Behavior Pack files and 33 Resource Pack files. No `.mcaddon` package was built. Reload the world for device verification.

## Kakejiku Banner

- [ ] Creative inventory and `/give @s bellity:kakejiku_banner` provide the item, with English name "Kakejiku Banner", Japanese name "掛け軸", and maximum stack size 16.
- [ ] Inventory, handheld, standing, and wall appearances match the supplied `model_data/kakejiku_banner_texture.png` and `model_data/kakejiku_banner.geo.json`, without Content Log errors.
- [ ] Floor placement supports all 16 headings in 22.5-degree steps; wall placement supports all four horizontal directions and removes the standing pole.
- [ ] Ceiling placement is rejected; floor and wall placements require support. Record behavior when support is removed.
- [ ] Survival placement consumes one item and Creative placement retains it; invalid placement does not consume the item.
- [ ] Players can pass through the banner, light is not dampened, and selection remains within the base cell. The model extends above that cell; verify upper-cloth targeting and nearby-block overlap.
- [ ] Breaking normally drops one banner. Check approximately 1.5-second bare-hand breaking, blast resistance behavior, and wood sounds under controlled conditions.
- [ ] Placement state and appearance survive saving and reloading. Multiple players and world-height or unloaded-neighbor boundaries cause no script errors.
- [ ] Record loom, dye, pattern, map marker, waving, furnace fuel, axe speed, water, and piston behavior separately. Native banner parity for these features remains TODO; no crafting recipe is provided pending the wool-color decision.

All Kakejiku Banner checks above are pending in-game verification. Source validation and matching development-pack hashes do not establish these runtime results.

On 2026-10-25, `node tools/validate.mjs`, syntax checks for the modified main script, new banner script, and generator, and `git diff --check` passed. Source checks cover the supplied texture, derived geometry, stack size, names, drops, all 20 visual states and their selection bounds/support filters, and mocked placement callbacks including ceiling rejection and invalid-player handling. `install-dev.ps1 -Update` updated both development packs; `tools/verify-dev.ps1` confirmed matching file counts and SHA-256 hashes for all 34 Behavior Pack files and 36 Resource Pack files. No `.mcaddon` was built. Reload the world for device verification.

## Rainbow Armor

Later on 2026-11-24, after source validation, validation-module syntax checks, and `git diff --check` passed again, `install-dev.ps1 -Update` deployed Rainbow Armor to the existing Windows development packs. `tools/verify-dev.ps1` confirmed all 48 Behavior Pack files and 52 Resource Pack files match the source by file count and SHA-256. Installed versions are BP 1.0.15 and RP 1.0.11. No `.mcaddon` was built, and imported packs were not updated or removed. Reload Minecraft/the world before device verification; the checks below remain pending.

At the initial implementation stage on 2026-11-24, `node tools/validate.mjs` passed for the complete pack (16 items, 3 blocks, 17 recipes), including all four Rainbow Armor definitions, exact Stone/Cobblestone recipes, localized names, byte-for-byte supplied icons and worn texture, attachable references, and slot-specific geometry. Syntax checks for both validation modules and `git diff --check` passed. Behavior Pack version is 1.0.15; Resource Pack version is 1.0.11. Deployment and packaging were not performed at that stage; the later development deployment is recorded above.

All checks below are pending in Minecraft Bedrock. Item/recipe definitions, source-image equality, and rendering references can be checked locally; they do not prove runtime protection, enchantments, infinite durability, or appearance. No Rainbow Armor device results have been recorded.

Known compatibility gap: smithing armor trims are not implemented for Rainbow Armor, unlike vanilla iron armor. There are no trim recipes or trim rendering; this is not a pending check of an implemented feature.

- [ ] Load both packs without Content Log errors. Creative equipment inventory and `/give` provide `bellity:rainbow_helmet`, `bellity:rainbow_chestplate`, `bellity:rainbow_leggings`, and `bellity:rainbow_boots`, each stacking to one.
- [ ] Verify Japanese names "虹色のヘルメット", "虹色のチェストプレート", "虹色のレギンス", and "虹色のブーツ" and matching English names "Rainbow Helmet", "Rainbow Chestplate", "Rainbow Leggings", and "Rainbow Boots".
- [ ] Each inventory icon matches its supplied `model_data/rainbow_<piece>.png` image. Equipped armor uses the unchanged `model_data/rainbow_armor_layer_1.png` artwork.
- [ ] Helmet recipe `["SSS", "R R", "   "]` consumes 3 Stone and 2 Cobblestone and produces one helmet.
- [ ] Chestplate recipe `["S S", "SSS", "R R"]` consumes 5 Stone and 2 Cobblestone and produces one chestplate; bottom-center remains empty.
- [ ] Leggings recipe `["SSS", "S S", "R R"]` consumes 5 Stone and 2 Cobblestone and produces one pair of leggings.
- [ ] Boots recipe `["   ", "S S", "R R"]` consumes 2 Stone and 2 Cobblestone and produces one pair of boots.
- [ ] For all four recipes, `S` accepts only Stone (`minecraft:stone`), and `R` accepts only Cobblestone (`minecraft:cobblestone`). Check recipe-book entries and reject all-Stone, all-Cobblestone, reversed-material, and Smooth Stone substitutions.
- [ ] Each piece equips only in its intended armor slot and can be replaced or removed normally. Compare equipping behavior with the corresponding iron armor.
- [ ] Controlled damage comparisons match iron armor for each piece (2/6/5/2 armor points) and the complete set (15 armor points), without extra knockback resistance or damage effects.
- [ ] Repeated damage never consumes durability or breaks any piece, including while Thorns is equipped.
- [ ] Enchanting-table and anvil behavior matches applicable iron armor enchantments and enchantability. Check Protection and piece-specific enchantment effects; record any compatibility gap involving Unbreaking, Mending, or other durability-dependent enchantments.
- [ ] Check all pieces on standard and slim players, from first-person and third-person views, while walking, crouching, and swimming, and on armor stands. Verify enchantment glint and correct movement of head, torso, arms, and legs.
- [ ] Check the full rainbow set and mixed vanilla/rainbow sets for UV seams, invisible surfaces, and clipping, especially when leggings and boots are worn together.
- [ ] Other players see the correct armor. Saving and reloading preserves equipment and enchantments, with no Content Log errors.

## Development Deployment Record: 2026-10-12

After correcting the Air Sword texture to use `model_data/air_sword.png`, source validation and both script syntax checks passed again. The installed Resource Pack still contained the previous Air Sword texture before the update. `install-dev.ps1 -Update` deployed the correction, and `tools/verify-dev.ps1` confirmed that all 24 Behavior Pack files and 26 Resource Pack files match the source by file count and SHA-256 hash. Reload the Minecraft world to load the corrected texture; its in-game appearance remains pending verification.

Source validation (`node tools/validate.mjs`) and JavaScript syntax checks for `scripts/main.js` and `scripts/pallet.js` passed. `install-dev.ps1 -Update` updated both installed development packs, including the current Air Block, Air Sword, and Pallet files. `tools/verify-dev.ps1` confirmed matching file counts and SHA-256 hashes for all 24 Behavior Pack files and 26 Resource Pack files. No `.mcaddon` package was built. Reload the Minecraft world to load the updated packs; Pallet device checks remain pending.
