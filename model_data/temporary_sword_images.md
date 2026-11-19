# Temporary Sword Image Sources

These generated placeholder images are temporary assets. Replace them when the finished sword artwork is supplied.

Generation mode: built-in `image_gen.imagegen`, one generation call per sword, with `transparent_background: true`. No API CLI fallback was used.

| Asset | Original generated source | Normalized source | Runtime texture | Original size | Runtime size |
|---|---|---|---|---|---|
| Wind Sword | `model_data/wind_sword_generated.png` | `model_data/wind_sword.png` | `resource_pack/textures/items/wind_sword.png` | 1261 x 1247 | 64 x 64 |
| Osu Sword | `model_data/osu_sword_generated.png` | `model_data/osu_sword.png` | `resource_pack/textures/items/osu_sword.png` | 1295 x 1214 | 64 x 64 |

The `*_generated.png` files retain the generated output unchanged. Normalized source PNGs were fitted into a transparent square using nearest-neighbor resampling with preserved alpha and aspect ratio, then copied byte-for-byte to the runtime paths. SHA-256 checks confirm each normalized source matches its runtime texture. The runtime images contain both transparent and visible pixels: Wind Sword has 3344 fully transparent pixels and 752 visible pixels; Osu Sword has 3352 fully transparent pixels and 744 visible pixels. Both runtime textures were visually inspected. Minecraft inventory and handheld rendering still require device verification.

## Wind Sword Prompt

```text
Use case: stylized-concept. Asset type: temporary Minecraft Bedrock inventory and handheld sword PNG sprite. Create one Wind Sword, a simple readable pixel-art sword pointing diagonally from a brown handle at bottom left to a blade tip at top right. Cyan and white wind-themed blade, pale blue small guard, dark outline, limited palette, crisp square pixels and no gradients. Design as if drawn on a 32 by 32 pixel grid then enlarged to the output canvas with nearest-neighbor edges. Center the complete isolated sword with modest transparent padding on all sides. Actual transparent background. No lettering, no watermark, no scene, no shadow cast onto a ground plane, no detached decorations, no multiple swords. Temporary game texture, simple vanilla Minecraft-like silhouette.
```

## Osu Sword Prompt

```text
Use case: stylized-concept. Asset type: temporary Minecraft Bedrock inventory and handheld sword PNG sprite. Create one Osu Sword, a simple readable pixel-art sword pointing diagonally from a brown stick handle at bottom left to a blade tip at top right. Pale gray and ivory air-themed straight blade with a small poppy-red geometric accent near its base, compact red and dark gray crossguard, dark outline, limited palette, crisp square pixels and no gradients. Design as if drawn on a 32 by 32 pixel grid then enlarged to the output canvas with nearest-neighbor edges. Center the complete isolated sword with modest transparent padding on all sides. Actual transparent background. No lettering, no watermark, no scene, no shadow cast onto a ground plane, no detached decorations, no multiple swords. Temporary game texture, simple vanilla Minecraft-like silhouette.
```
