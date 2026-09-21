# ベリティアドオン 設計書

## 目的と範囲

Minecraft Bedrock Edition に固有の武器と使用型アイテムを追加するアドオン。Behavior Pack と Resource Pack のゲーム内表示名は「ベリティアドオン」とする。アイテム定義、レシピ、画像はアイテムごとに分離し、名前空間は `bellity`、対象バージョンは Minecraft Bedrock 1.21.110 以降とする。

現在の個別仕様：

| アイテム | ID | 分類 | 状態 | 詳細 |
|---|---|---|---|---|
| ベリティソード | `bellity:bellity_sword` | 剣 | 実装済み | [bellity_sword.md](bellity_sword.md) |
| ちょっとネザライトの斧 | `bellity:noboru_netherite_axe` | 斧 | 実装済み | [noboru_netherite_axe.md](noboru_netherite_axe.md) |
| 太陽の巨人の光 | `bellity:sun_bigman_light` | 投擲武器 | 実装済み | [sun_bigman_light.md](sun_bigman_light.md) |
| ギザギザ剣 | `bellity:gizagiza_sword` | 剣 | 実装済み | [gizagiza_sword.md](gizagiza_sword.md) |
| クリーピーホースの目 | `bellity:creepy_horse_eye` | 使用型アイテム | 実装済み・実機未確認 | [creepy_horse_eye.md](creepy_horse_eye.md) |

## パック構成

```text
behavior_pack/
├─ manifest.json
├─ items/                 # 各アイテムの定義
├─ recipes/               # 作業台レシピ
├─ entities/              # ライトボールの投射物定義
└─ scripts/main.js        # 命中・投擲・フリーズ処理
resource_pack/
├─ manifest.json
├─ entity/                # ライトボールの表示定義
├─ animations/            # ライトボールの表示アニメーション
├─ render_controllers/    # ライトボールの描画設定
├─ textures/item_texture.json
├─ textures/items/        # 各アイテム画像
├─ textures/entity/       # ライトボール画像
└─ texts/                 # 言語ファイル
model_data/                # Blockbench 制作素材
tools/validate.mjs         # ソース検証
tests/test_checklist.md    # 実機確認項目
dist/bellity_addon.mcaddon # 配布用パック
```

Behavior Pack はアイテム、レシピ、Script API の動作を定義し、Resource Pack は表示名と画像を提供する。Behavior Pack は Resource Pack と `@minecraft/server` 2.0.0 に依存する。現在のパックバージョンは Behavior Pack が `1.0.9`、Resource Pack が `1.0.5`。両パックの `min_engine_version` は `1.21.110` とする。

## 共通仕様

- アイテムIDは `bellity:<item_id>`、ファイル名は英小文字・数字・アンダースコアを使用する。
- 各アイテムは `minecraft:display_name` から `item.bellity:<item_id>.name` を参照し、同じキーを `ja_JP.lang` と `en_US.lang` に定義する。
- 各アイテム画像を `resource_pack/textures/items/` に置き、`item_texture.json` に登録する。元画像は `model_data/` に保存する。
- 5個の作業台レシピは `minecraft:recipe_shaped`、`format_version: 1.20.10`、`crafting_table` タグ、`AlwaysUnlocked` を使用する。配置と素材は各アイテム設計書に記載する。
- アイテム定義は `format_version: 1.21.110` を使用する。特殊処理が必要なアイテムだけカスタムアイテムコンポーネントを使い、`scripts/main.js` に登録する。
- 現在の実装では実験機能を使用しない。将来必要になった場合は互換性と実装条件を個別に検討する。

## ビルドと開発パック

プロジェクト直下で `./build.ps1` を実行する。スクリプト構文と `tools/validate.mjs` の検証に成功すると、両パックを `dist/bellity_addon.mcaddon` にまとめる。配布パックを使う場合は Minecraft にインポートし、Behavior Pack と Resource Pack の両方をワールドで有効にする。

Windows版 Minecraft Bedrock の開発パック配置先：

```text
%appdata%\Minecraft Bedrock\Users\Shared\games\com.mojang\development_behavior_packs\Bellity_BP
%appdata%\Minecraft Bedrock\Users\Shared\games\com.mojang\development_resource_packs\Bellity_RP
```

初回は `./install-dev.ps1`、既存の開発パック更新は `./install-dev.ps1 -Update` を使う。更新後は `./tools/verify-dev.ps1` でソースと配置済みファイルを照合し、Minecraft のワールドを再読み込みする。

## 検証基準と未確認事項

- ソース検証では5アイテムの定義、表示名キー、画像、5レシピの配置・素材・出力・アンロック設定、マニフェスト依存関係、ライトボールとクリーピーホースの目の主要スクリプト処理を確認する。
- 実機検証では両パックの読み込み、Content Log、日英表示名、画像、取得方法、各アイテムの動作、保存後の保持を確認する。確認項目は [test_checklist.md](../tests/test_checklist.md) に記録する。
- 2026-09-21 に `./build.ps1` を実行し、5アイテム・5レシピのソース検証と `dist/bellity_addon.mcaddon` の生成が成功した。アーカイブ内にクリーピーホースの目のアイテム定義、レシピ、スクリプト、画像が含まれることを確認した。
- 同日に `./install-dev.ps1 -Update` で開発パックを更新し、`./tools/verify-dev.ps1` で Behavior Pack 13ファイル、Resource Pack 14ファイルがソースと一致することを確認した。Minecraft 上でのクリーピーホースの目の動作確認は未実施。
- 修理素材、エンチャント可否、パックアイコン、3Dモデル、配布向けバランスは今後検討する。アイテム固有の未確認事項は各設計書に記載する。

## 拡張とバランス方針

剣、斧、投擲武器、使用型アイテムを基礎に、槍、短剣、ハンマー、手裏剣、投げナイフなどを追加できる構成とする。攻撃力だけでなく、射程、使用間隔、耐久値、素材の入手難度、特殊能力を含めて調整し、強力な武器はPvEとPvPの両方で検証する。

画像は透過PNGのピクセルアートとし、Blockbenchの制作素材を保持する。16×16と32×32の統一、輪郭、光源方向、色数は今後調整する。3Dモデルは現在の範囲外とし、採用時は一人称・三人称表示、持ち方、attachableを個別に確認する。

アイテムコンポーネントで実現できる機能を優先し、命中、投擲、フリーズなど必要な処理に Script API を使う。マルチプレイ、保存後の保持、ワールド再読み込み時の動作も実機確認対象とする。

## アイテム追加手順

1. ID、名称、性能、取得方法、未解決事項をこの一覧と個別設計書に記録する。
2. アイテム定義、画像、画像登録、日英翻訳を追加し、必要に応じてレシピとスクリプトを追加する。
3. `tools/validate.mjs` と実機チェックリストを更新し、`./build.ps1` で検証・梱包する。
4. 開発パックまたは配布パックで実機検証し、結果をチェックリストに記録する。
