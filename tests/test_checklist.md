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
- [ ] Holding the Creepy Horse Eye and right-clicking activates it on the spot without consuming the item.
- [ ] Only enemies in the `monster` family within a 7-block radius of the player at the time of activation are frozen in their position and rotation for 10 seconds.
- [ ] Enemies outside the effect range, enemies that enter the range after activation, players, friendly mobs, items, and projectiles do not freeze.
- [ ] During the freeze, movement by walking, flying, knockback, falling, and water currents is stopped, and they can move again after 10 seconds.
- [ ] Cannot be reused for 20 seconds after activation, and can be reused after 20 seconds.
- [ ] White particles are displayed within a 7-block radius sphere only during the effect, and do not remain after it wears off.
- [ ] No script error appears in the Content Log even with enemy death, despawning, dimension travel, multiple entities, or overlapping use by multiple players.
- [ ] Weapons are retained even if you save and reload the world.