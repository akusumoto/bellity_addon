# ちょっとネザライトの斧

[共通仕様](README.md) / アイテムID：`bellity:noboru_netherite_axe`

## アイテム仕様

| 項目 | 仕様 |
|---|---|
| 分類 | 斧 |
| 日本語名 | ちょっとネザライトの斧 |
| 英語名 | Chotto Netherite Axe |
| 表示名キー | `item.bellity:noboru_netherite_axe.name` |
| 追加ダメージ | `minecraft:damage: 5`。基本攻撃力1と合わせて攻撃力6を想定 |
| 最大耐久値 | 1200 |
| 最大スタック数 | 1 |
| 画像 | `resource_pack/textures/items/noboru_netherite_axe.png` |
| 制作素材 | `model_data/noboru_netherite_axe.png`、`model_data/noboru_netherite_axe.bbmodel` |

クリエイティブインベントリでは装備の斧グループに表示する。手持ち表示を有効にし、`minecraft:is_axe` と `minecraft:is_tool` のタグを付ける。`minecraft:digger` で `wood` タグを持つブロックの破壊速度を6に設定する。特殊能力用のスクリプトは使用しない。

## クラフト

作業台で次の3×3配置から1個作る。`-` は空欄。

```text
N N -
- B -
- B -
```

| 記号 | 素材ID | 素材名 |
|---|---|---|
| N | `minecraft:netherite_ingot` | ネザライトインゴット |
| B | `minecraft:stick` | 棒 |

レシピIDと出力は `bellity:noboru_netherite_axe`。共通仕様どおり、作業台タグと `AlwaysUnlocked` を指定する。クリエイティブインベントリと `/give` でも取得できる。

## 実装ファイルと確認

- アイテム：`behavior_pack/items/noboru_netherite_axe.json`
- レシピ：`behavior_pack/recipes/noboru_netherite_axe.json`
- 実機では表示名・画像・クラフト、攻撃力、耐久値の減少、木材系ブロックの採掘速度を確認する。
- 修理素材、エンチャント可否、斧固有の追加効果は未決定。
