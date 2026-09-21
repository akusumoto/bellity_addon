# 太陽の巨人の光

[共通仕様](README.md) / アイテムID：`bellity:sun_bigman_light`

## アイテム仕様

| 項目 | 仕様 |
|---|---|
| 分類 | 投擲武器 |
| 日本語名 | 太陽の巨人の光 |
| 英語名 | Sun Bigman Light |
| 表示名キー | `item.bellity:sun_bigman_light.name` |
| 命中時の追加ダメージ | 10 |
| 最大耐久値 | 500 |
| 最大スタック数 | 1 |
| 画像 | `resource_pack/textures/items/sun_bigman_light.png` |
| 制作素材 | `model_data/sun_bigman_light.png`、`model_data/sun_bigman_light.bbmodel` |

クリエイティブインベントリでは装備カテゴリに表示し、手持ち表示を有効にする。`minecraft:use_modifiers` の使用時間は0.1、移動倍率は1.0。`minecraft:cooldown` のカテゴリは `sun_bigman_light`、時間は0.35秒。

## クラフト

作業台で次の3×3配置から1個作る。`-` は空欄。

```text
T - -
- A -
- - R
```

| 記号 | 素材ID | 素材名 |
|---|---|---|
| T | `minecraft:torch` | 松明 |
| A | `minecraft:arrow` | 矢 |
| R | `minecraft:trident` | トライデント |

レシピIDと出力は `bellity:sun_bigman_light`。共通仕様どおり、作業台タグと `AlwaysUnlocked` を指定する。

## 投擲処理

`bellity:throw_light` の使用イベントで、プレイヤーの視線方向へ専用投射物「ライトボール」（`bellity:light_ball`）を発射する。投げたアイテム本体は消費せず、成功した投擲ごとに耐久値を1減らす。耐久値が尽きる投擲では手持ちアイテムを取り除く。連続投擲の間隔は最低7ゲームティック。

投擲時の初速、軌道、重力、飛距離、当たり判定、投擲音、命中時の音とパーティクルは標準の雪玉に合わせる。投擲音は `random.bow`、音量は0.5、ピッチは0.33から0.5の範囲とする。命中時は標準の雪玉と同様に独自の音を再生せず、`snowballpoof` を6個表示する。

この武器から発射したライトボールがエンティティに命中した場合、対象へ10ダメージを与え、5秒間炎上させる。ブロック命中時は追跡対象から外す。投射物の画像の制作元は `model_data/sunlight_ball.png`、配布用テクスチャは `resource_pack/textures/entity/light_ball.png` とする。処理は `behavior_pack/scripts/main.js` に実装し、例外時はコンテンツログに警告を出す。

## 実装ファイルと確認

- アイテム：`behavior_pack/items/sun_bigman_light.json`
- レシピ：`behavior_pack/recipes/sun_bigman_light.json`
- 投射物：`behavior_pack/entities/light_ball.json`
- 投射物の表示：`resource_pack/entity/light_ball.entity.json`、`resource_pack/animations/light_ball.animation.json`、`resource_pack/render_controllers/light_ball.render_controllers.json`、`resource_pack/textures/entity/light_ball.png`。モデルには組み込みの `geometry.item_sprite` を使う。
- 実機では表示名・画像・クラフト、ライトボールの発射と外観、雪玉と同じ初速・軌道・重力・飛距離・当たり判定・投擲音・命中音・命中パーティクル、命中ダメージ、炎上、耐久消費、連続投擲の制限を確認する。
- 投射物の回収仕様は今後検討する。
