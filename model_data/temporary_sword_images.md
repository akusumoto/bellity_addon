# Historical Temporary Sword Image Sources

This document records the former generated placeholder assets. On 2026-11-20, user-supplied artwork replaced both `model_data/wind_sword.png` and `model_data/osu_sword.png` and their runtime item textures. Those current files are no longer generated placeholders. The user-supplied `.bbmodel` files are retained as editable originals; runtime rendering remains a flat item icon with no geometry changes. The new artwork has not been verified in Minecraft.

Generation mode: built-in `image_gen.imagegen`, one generation call per sword, with `transparent_background: true`. No API CLI fallback was used.

The following table describes the original generation pipeline and its sizes. The former normalized-source and runtime paths now contain user-supplied artwork, so these historical sizes and pixel counts do not describe their current contents.

| Asset | Preserved original generated source | Former normalized source path | Former runtime texture path | Original generated size | Former runtime size |
|---|---|---|---|---|---|
| Wind Sword | `model_data/wind_sword_generated.png` | `model_data/wind_sword.png` | `resource_pack/textures/items/wind_sword.png` | 1261 x 1247 | 64 x 64 |
| Osu Sword | `model_data/osu_sword_generated.png` | `model_data/osu_sword.png` | `resource_pack/textures/items/osu_sword.png` | 1295 x 1214 | 64 x 64 |

The `*_generated.png` files retain the generated output unchanged. At generation time, normalized source PNGs were fitted into a transparent square using nearest-neighbor resampling with preserved alpha and aspect ratio, then copied byte-for-byte to the runtime paths. SHA-256 checks confirmed each former normalized source matched its runtime texture. The former runtime images contained both transparent and visible pixels: Wind Sword had 3344 fully transparent pixels and 752 visible pixels; Osu Sword had 3352 fully transparent pixels and 744 visible pixels. Both former runtime textures were visually inspected. These observations refer only to the generated placeholders, not the replacement artwork.

## Wind Sword Prompt

```text
Use case: stylized-concept. Asset type: temporary Minecraft Bedrock inventory and handheld sword PNG sprite. Create one Wind Sword, a simple readable pixel-art sword pointing diagonally from a brown handle at bottom left to a blade tip at top right. Cyan and white wind-themed blade, pale blue small guard, dark outline, limited palette, crisp square pixels and no gradients. Design as if drawn on a 32 by 32 pixel grid then enlarged to the output canvas with nearest-neighbor edges. Center the complete isolated sword with modest transparent padding on all sides. Actual transparent background. No lettering, no watermark, no scene, no shadow cast onto a ground plane, no detached decorations, no multiple swords. Temporary game texture, simple vanilla Minecraft-like silhouette.
```

## Osu Sword Prompt

```text
Use case: stylized-concept. Asset type: temporary Minecraft Bedrock inventory and handheld sword PNG sprite. Create one Osu Sword, a simple readable pixel-art sword pointing diagonally from a brown stick handle at bottom left to a blade tip at top right. Pale gray and ivory air-themed straight blade with a small poppy-red geometric accent near its base, compact red and dark gray crossguard, dark outline, limited palette, crisp square pixels and no gradients. Design as if drawn on a 32 by 32 pixel grid then enlarged to the output canvas with nearest-neighbor edges. Center the complete isolated sword with modest transparent padding on all sides. Actual transparent background. No lettering, no watermark, no scene, no shadow cast onto a ground plane, no detached decorations, no multiple swords. Temporary game texture, simple vanilla Minecraft-like silhouette.
```
