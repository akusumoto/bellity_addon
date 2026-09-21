# ギザギザ剣

[共通仕様](README.md) / アイテムID：`bellity:gizagiza_sword`

## アイテム仕様

| 項目 | 仕様 |
|---|---|
| 分類 | 剣 |
| 日本語名 | ギザギザ剣 |
| 英語名 | Gizagiza Sword |
| 表示名キー | `item.bellity:gizagiza_sword.name` |
| 追加ダメージ | `minecraft:damage: 9`。基本攻撃力1と合わせて攻撃力10を想定 |
| 最大耐久値 | 1200 |
| 最大スタック数 | 1 |
| 画像 | `resource_pack/textures/items/gizagiza_sword.png` |
| 制作素材 | `model_data/gizagiza_sword.png`、`model_data/gizagiza_sword.bbmodel` |

ベリティソードと同様に、クリエイティブインベントリでは装備の剣グループに表示する。手持ち表示を有効にし、`minecraft:is_sword` タグを付ける。ここに記載した攻撃力、耐久値、特殊能力を除く基本的な扱いは、他の剣と同様とする。

## クラフト

作業台で次の3×3配置から1個作る。`-` は空欄。

```text
- I -
I I I
- B -
```

| 記号 | 素材ID | 素材名 |
|---|---|---|
| I | `minecraft:iron_ingot` | 鉄インゴット |
| B | `minecraft:stick` | 棒 |

レシピIDと出力は `bellity:gizagiza_sword`。`minecraft:recipe_shaped` として定義し、共通仕様どおり作業台タグと `AlwaysUnlocked` を指定する。クリエイティブインベントリと `/give @s bellity:gizagiza_sword` でも取得できるようにする。

## 特殊能力

エンティティへの命中時のノックバックを、同じ条件で通常の剣を使用した場合の2倍とする。通常攻撃で発生するノックバックに加えて、同程度の追加ノックバックを対象へ与える方式を基本とする。

特殊能力はカスタムアイテムコンポーネント `bellity:double_knockback_on_hit` と `behavior_pack/scripts/main.js` で実装する。攻撃者から対象への水平方向へ強さ0.4の追加ノックバックを与え、垂直方向には追加しない。両者の水平位置が一致するときは攻撃者の視線方向を使い、それでも水平方向を決められない場合は追加処理を行わない。ノックバック耐性、ダッシュ攻撃、ノックバックのエンチャントなどによる差は、Minecraft の標準挙動との整合性を実機で確認する。

## 実装ファイルと確認

- アイテム：`behavior_pack/items/gizagiza_sword.json`
- レシピ：`behavior_pack/recipes/gizagiza_sword.json`
- 特殊能力：`behavior_pack/scripts/main.js`
- 表示名：`resource_pack/texts/ja_JP.lang`、`resource_pack/texts/en_US.lang`
- 画像登録：`resource_pack/textures/item_texture.json`
- 実機では表示名、画像、取得方法、指定したレシピでのクラフト、攻撃力、耐久値の減少、ノックバックを確認する。
- ノックバックは、エンチャントなし・ダッシュなし・同じ対象と地形という条件で通常の剣と比較し、押し出し距離がおおむね2倍になることを確認する。
- 2026-09-21 に `./build.ps1` でアイテムと指定レシピのソース検証、パッケージ生成が成功した。配布アーカイブ内のレシピも `pattern: [" I ", "III", " B "]`、鉄インゴットと棒、出力1個であることを確認した。`./install-dev.ps1 -Update` で開発用パックへ配置し、`./tools/verify-dev.ps1` で配置内容がソースと一致することを確認した。Minecraft上でのクラフト、表示、性能、ノックバックは未確認。
- 修理素材、エンチャント可否、レアリティは未決定。
