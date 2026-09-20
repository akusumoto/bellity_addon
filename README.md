# Bellity Weapons

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
