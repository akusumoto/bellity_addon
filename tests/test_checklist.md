# Bellity Addon Device Checklist

- [ ] Chotto Netherite Axe crafts at a crafting table with Netherite Ingots in the top left and top middle slots, and Sticks in the center and bottom center slots.
- [ ] No recipe error appears in the Content Log after reloading the updated development pack.

Target Version: ____ Date Checked: ____

- [ ] Can apply the Bellity Addon BP/RP to the world, and there are no errors in the Content Log.
- [ ] The 5 items can be obtained with `/give`.
- [ ] The Japanese and English display names and the 5 images are correct.
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
