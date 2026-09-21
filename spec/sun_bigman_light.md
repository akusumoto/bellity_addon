# Sun Bigman Light

[Common Specifications](README.md) / Item ID: `bellity:sun_bigman_light`

## Item Specifications

| Item | Specification |
|---|---|
| Category | Throwable Weapon |
| Japanese Name | 太陽の巨人の光 |
| English Name | Sun Bigman Light |
| Display Name Key | `item.bellity:sun_bigman_light.name` |
| Additional Damage on Hit | 10 |
| Maximum Durability | 500 |
| Maximum Stack Size | 1 |
| Image | `resource_pack/textures/items/sun_bigman_light.png` |
| Production Assets | `model_data/sun_bigman_light.png`, `model_data/sun_bigman_light.bbmodel` |

Display in the equipment category in the creative inventory and enable handheld display. The `minecraft:use_modifiers` use duration is 0.1, movement multiplier is 1.0. The `minecraft:cooldown` category is `sun_bigman_light`, duration is 0.35 seconds.

## Crafting

Craft 1 item on the crafting table from the following 3x3 layout. `-` is empty.

```text
T - -
- A -
- - R
```

| Symbol | Material ID | Material Name |
|---|---|---|
| T | `minecraft:torch` | Torch |
| A | `minecraft:arrow` | Arrow |
| R | `minecraft:trident` | Trident |

The recipe ID and output are `bellity:sun_bigman_light`. As per common specifications, specify the crafting table tag and `AlwaysUnlocked`.

## Throwing Processing

In the use event of `bellity:throw_light`, fire a dedicated projectile "Light Ball" (`bellity:light_ball`) in the player's line of sight. The thrown item itself is not consumed; reduce durability by 1 for each successful throw. Remove the handheld item on the throw that exhausts durability. The interval for consecutive throws is a minimum of 7 game ticks.

The initial velocity, trajectory, gravity, flight distance, hitbox, throwing sound, and sound/particles upon hitting are matched to the standard snowball. The throwing sound is `random.bow`, volume is 0.5, and pitch ranges from 0.33 to 0.5. Upon hitting, do not play a unique sound, similar to a standard snowball, and display 6 `snowballpoof` particles.

If the Light Ball fired from this weapon hits an entity, it deals 10 damage to the target and sets them on fire for 5 seconds. If it hits a block, remove it from the tracking target. The production asset for the projectile's image is `model_data/sunlight_ball.png`, and the distribution texture is `resource_pack/textures/entity/light_ball.png`. Implement the processing in `behavior_pack/scripts/main.js` and output a warning to the content log upon exception.

## Implementation Files and Verification

- Item: `behavior_pack/items/sun_bigman_light.json`
- Recipe: `behavior_pack/recipes/sun_bigman_light.json`
- Projectile: `behavior_pack/entities/light_ball.json`
- Projectile Display: `resource_pack/entity/light_ball.entity.json`, `resource_pack/animations/light_ball.animation.json`, `resource_pack/render_controllers/light_ball.render_controllers.json`, `resource_pack/textures/entity/light_ball.png`. For the model, use the built-in `geometry.item_sprite`.
- On actual devices, verify the display name, image, crafting, firing and appearance of the Light Ball, the same initial velocity/trajectory/gravity/flight distance/hitbox/throwing sound/hitting sound/hitting particles as a snowball, hit damage, burning, durability consumption, and the restriction on consecutive throws.
- Projectile recovery specifications will be considered in the future.