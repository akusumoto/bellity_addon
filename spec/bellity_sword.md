# ベリティソード

[共通仕様](README.md) / アイテムID：`bellity:bellity_sword`

## アイテム仕様

| 項目 | 仕様 |
|---|---|
| 分類 | 剣 |
| 日本語名 | ベリティソード |
| 英語名 | Bellity Sword |
| 表示名キー | `item.bellity:bellity_sword.name` |
| 追加ダメージ | `minecraft:damage: 31`。基本攻撃力1と合わせて攻撃力32を想定 |
| 最大耐久値 | 1233 |
| 最大スタック数 | 1 |
| 画像 | `resource_pack/textures/items/bellity_sword.png` |
| 制作素材 | `model_data/bellity_sword.png`、`model_data/bellity_sword.bbmodel` |

クリエイティブインベントリでは装備の剣グループに表示する。手持ち表示を有効にし、`minecraft:is_sword` タグを付ける。

## クラフト

作業台で次の3×3配置から1個作る。`-` は空欄。

```text
H G -
- C -
- B -
```

| 記号 | 素材ID | 素材名 |
|---|---|---|
| H | `minecraft:flint_and_steel` | 火打ち石と打ち金 |
| G | `minecraft:gold_ingot` | 金インゴット |
| C | `minecraft:creeper_head` | クリーパーの頭 |
| B | `minecraft:stick` | 棒 |

レシピIDと出力は `bellity:bellity_sword`。共通仕様どおり、作業台タグと `AlwaysUnlocked` を指定する。

## 特殊能力

`bellity:random_drop_on_hit` を付ける。エンティティへの命中イベントで `hadEffect` が真の場合、命中位置に次の8種類から等確率で1個をドロップする。

`minecraft:apple`、`minecraft:coal`、`minecraft:iron_ingot`、`minecraft:gold_ingot`、`minecraft:redstone`、`minecraft:lapis_lazuli`、`minecraft:emerald`、`minecraft:diamond`。

処理は `behavior_pack/scripts/main.js` に実装する。ドロップ処理で例外が起きた場合はコンテンツログに警告を出す。

## 実装ファイルと確認

- アイテム：`behavior_pack/items/bellity_sword.json`
- レシピ：`behavior_pack/recipes/bellity_sword.json`
- 実機では表示名・画像・クラフト、攻撃力、耐久値の減少、命中時のドロップを確認する。
- 修理素材、エンチャント可否、レアリティは未決定。
