# Bellity Weapons

## Chotto Netherite Axe recipe (1.0.2)

The axe is now craftable at a crafting table. Place Netherite Ingots in the top left and top middle slots, then Sticks in the center and bottom center slots. The exact pattern and IDs are in [AXE_RECIPE_SPEC.md](AXE_RECIPE_SPEC.md). The older note below saying the axe has no recipe is superseded by this section.

## 2026-09-20 in-game fix

The 1.0.1 pack added explicit localized names to all three items and unlock data to the original two crafting recipes. Import [the rebuilt add-on](dist/bellity_addon.mcaddon), enable its Behavior Pack and Resource Pack, then reload the world. Confirm that the recipe errors are gone from the Content Log and craft all three items at a crafting table. The source validation and packaging checks passed; this updated build still needs an in-game check.

For an existing development-pack installation, run `./install-dev.ps1 -Update` and then `./tools/verify-dev.ps1`. Reload the world to pick up the updated files.

Minecraft Bedrock Edition 用の武器アドオンです。`behavior_pack` と `resource_pack` が編集可能なソースで、`dist/bellity_addon.mcaddon` が配布用ファイルです。

## 武器

| ID | 表示名 | 攻撃力 | 耐久値 | 入手方法 |
|---|---|---:|---:|---|
| `bellity:bellity_sword` | ベリティソード | 32 | 1233 | 3×3クラフト |
| `bellity:noboru_netherite_axe` | ちょっとネザライトの斧 | 6 | 1200 | クリエイティブまたは `/give`（レシピ未定） |
| `bellity:sun_bigman_light` | 太陽の巨人の光 | 10（命中時） | 500 | 3×3クラフト |

剣は有効な命中ごとに8種類のアイテムから等確率で1個を落とします。投擲武器は使用時に耐久値を1消費し、命中したエンティティに10ダメージと5秒の炎上を与えます。弾には標準の雪玉エンティティを使用します。画像はインベントリと手持ちアイテムに適用されます。

## ビルドと導入

PowerShell でこのフォルダから `./build.ps1` を実行します。構文・素材・レシピの検証後、`dist/bellity_addon.mcaddon` を生成します。これを開いて Minecraft にインポートし、ワールドの Behavior Pack と Resource Pack を有効にしてください。Script API を使うため、Minecraft Bedrock 1.21.110 以降が必要です。

開発用パックとして使う場合は `./install-dev.ps1` を実行します。既存の Bellity フォルダがある場合は上書きせずに停止します。変更を反映するにはワールドを再読み込みしてください。

取得コマンド：

```text
/give @s bellity:bellity_sword
/give @s bellity:noboru_netherite_axe
/give @s bellity:sun_bigman_light
```

## 実機確認

1. 3つのアイテムが表示され、日本語と英語の名前・画像が正しいことを確認します。
2. 剣は火打ち石の打ち金と金インゴットを上段左・中央、クリーパーの顔を中央、棒を下段中央に配置してクラフトします。
3. 太陽の巨人の光は松明を上段左、矢を中央、トライデントを下段右に配置してクラフトします。
4. 剣でモブを叩き、アイテムが1個落ちることを確認します。
5. 斧の攻撃力・耐久値、投擲武器の命中ダメージ・炎上・耐久消費を確認します。
6. `%appdata%\Minecraft Bedrock\logs` の Content Log にエラーがないことを確認します。

Minecraft 上での動作は、この環境ではまだ確認していません。
