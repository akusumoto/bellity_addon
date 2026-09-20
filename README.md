# ベリティアドオン

Minecraft Bedrock Edition 1.21.110 以降向けの武器アドオンです。共通仕様と各武器の詳細は [設計書一覧](spec/README.md) にまとめています。

| 武器 | 入手方法 | 詳細 |
|---|---|---|
| ベリティソード | 作業台、クリエイティブ、`/give` | [設計書](spec/bellity_sword.md) |
| ちょっとネザライトの斧 | 作業台、クリエイティブ、`/give` | [設計書](spec/noboru_netherite_axe.md) |
| 太陽の巨人の光 | 作業台、クリエイティブ、`/give` | [設計書](spec/sun_bigman_light.md) |

## ビルドと導入

PowerShell でプロジェクト直下から `./build.ps1` を実行します。検証に成功すると `dist/bellity_addon.mcaddon` を生成します。このファイルを Minecraft にインポートし、ワールドで Behavior Pack と Resource Pack の両方を有効にしてください。

開発用パックは、初回に `./install-dev.ps1` で配置します。既存の Bellity 開発用パックを更新する場合は `./install-dev.ps1 -Update` を実行し、`./tools/verify-dev.ps1` で配置先とソースの一致を確認します。更新後はワールドを再読み込みしてください。

取得コマンド：

```text
/give @s bellity:bellity_sword
/give @s bellity:noboru_netherite_axe
/give @s bellity:sun_bigman_light
```

## 実機確認

日英の表示名、画像、3つのクラフト、各武器の性能を [実機チェックリスト](tests/test_checklist.md) に沿って確認します。コンテンツログは `%appdata%\Minecraft Bedrock\logs` にあります。現行ビルドの Minecraft 上での動作確認は未完了です。
