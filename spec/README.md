# ベリティアドオン 設計書

## 目的と対象

Minecraft Bedrock Edition に独自の武器や使用型アイテムを追加するアドオン。ゲーム内に表示するパック名は、Behavior Pack と Resource Pack の両方で「ベリティアドオン」とする。アイテムごとにアイテム定義・レシピ・画像を分ける。名前空間は `bellity`、対象バージョンは Minecraft Bedrock 1.21.110 以降とする。

現在の個別仕様：

| アイテム | ID | 分類 | 状態 | 詳細 |
|---|---|---|---|---|
| ベリティソード | `bellity:bellity_sword` | 剣 | 実装済み | [bellity_sword.md](bellity_sword.md) |
| ちょっとネザライトの斧 | `bellity:noboru_netherite_axe` | 斧 | 実装済み | [noboru_netherite_axe.md](noboru_netherite_axe.md) |
| 太陽の巨人の光 | `bellity:sun_bigman_light` | 投擲武器 | 実装済み | [sun_bigman_light.md](sun_bigman_light.md) |
| ギザギザ剣 | `bellity:gizagiza_sword` | 剣 | 実装済み | [gizagiza_sword.md](gizagiza_sword.md) |
| クリーピーホースの目 | `bellity:creepy_horse_eye` | 使用型アイテム | 設計済み・未実装 | [creepy_horse_eye.md](creepy_horse_eye.md) |

## パック構成

```text
behavior_pack/
├─ manifest.json
├─ items/                 # アイテムごとの定義
├─ recipes/               # アイテムごとの作業台レシピ
├─ entities/              # ライトボールの投射物定義
└─ scripts/main.js        # 剣のドロップと投擲処理
resource_pack/
├─ manifest.json
├─ entity/                # ライトボールの表示定義
├─ animations/            # ライトボールの表示アニメーション
├─ render_controllers/    # ライトボールの描画設定
├─ textures/item_texture.json
├─ textures/items/        # アイテムごとの画像
├─ textures/entity/       # ライトボールの画像
└─ texts/
   ├─ languages.json
   ├─ ja_JP.lang
   └─ en_US.lang
model_data/                # Blockbench の制作素材
tools/validate.mjs         # ソース検証
tests/test_checklist.md    # 実機確認項目
dist/bellity_addon.mcaddon # 配布用パック
```

Behavior Pack はアイテム、レシピ、Script API の動作を定義する。Resource Pack は表示名と画像を提供する。Behavior Pack は Resource Pack と `@minecraft/server` 2.0.0 に依存する。現在のパックバージョンは Behavior Pack が `1.0.8`、Resource Pack が `1.0.4`。両パックの `min_engine_version` は `1.21.110`。

## 共通仕様

- アイテム識別子は `bellity:<item_id>` とし、ファイル名には英小文字・数字・アンダースコアを使用する。
- 各アイテムは `minecraft:display_name` で `item.bellity:<item_id>.name` を参照する。同じキーを `ja_JP.lang` と `en_US.lang` の両方に定義する。
- 各アイテムの画像を `resource_pack/textures/items/` に置き、`item_texture.json` に登録する。画像の制作元は `model_data/` に保管する。
- 実装済みの4つのクラフトレシピは `format_version: 1.20.10` の `minecraft:recipe_shaped` を使い、`tags` に `crafting_table`、`unlock.context` に `AlwaysUnlocked` を指定する。3×3の配置と素材は各武器の設計書に記載する。
- アイテム定義は `format_version: 1.21.110`。特殊処理が必要なアイテムのみカスタムアイテムコンポーネントを使用する。現行の剣と投擲武器は `scripts/main.js` で登録している。ギザギザ剣は命中時に通常攻撃へ水平方向の追加ノックバックを加える。
- 実験的機能は現行実装では使用しない。将来必要になった場合は互換性と導入条件を個別に検討する。

## ビルドと開発用パック

プロジェクト直下で `./build.ps1` を実行する。スクリプト構文と `tools/validate.mjs` の検証が通った場合に、両パックを `dist/bellity_addon.mcaddon` にまとめる。配布用パックを使う場合は Minecraft にインポートし、ワールドで Behavior Pack と Resource Pack を有効にする。

Windows 版 Minecraft Bedrock の開発用パックの配置先：

```text
%appdata%\Minecraft Bedrock\Users\Shared\games\com.mojang\development_behavior_packs\Bellity_BP
%appdata%\Minecraft Bedrock\Users\Shared\games\com.mojang\development_resource_packs\Bellity_RP
```

初回は `./install-dev.ps1`、既存の Bellity 開発用パックの更新は `./install-dev.ps1 -Update` を使う。更新後は `./tools/verify-dev.ps1` でソースと配置先のファイルを照合し、Minecraft のワールドを再読み込みする。

## 検証基準と未確認事項

- 現行のソース検証では、実装済み4アイテムの定義、表示名キー、画像、4レシピの配置・素材・出力・アンロック設定、マニフェストの依存関係を確認する。クリーピーホースの目は、実装時に検証対象へ追加する。
- 現行の実機確認では、両パックの読み込み、コンテンツログのエラー、実装済み4アイテムの日英の表示名、画像、取得方法、各武器の動作、セーブ後の保持を確認する。確認項目は [test_checklist.md](../tests/test_checklist.md) に記録する。クリーピーホースの目は、実装後に確認対象へ追加する。
- ソース検証は完了している。2026-09-21 に `./build.ps1` で4アイテム・4レシピを検証し、`dist/bellity_addon.mcaddon` を生成した。アーカイブ内のギザギザ剣レシピが指定配置・素材・出力を保持することも確認した。`./install-dev.ps1 -Update` で開発用パックへ配置し、`./tools/verify-dev.ps1` で Behavior Pack の11ファイルと Resource Pack の13ファイルがソースと一致することを確認した。ギザギザ剣を含むMinecraft上での動作確認は未実施。
- 修理素材、エンチャント可否、パックアイコン、3Dモデル化、配布時のバランスは今後検討する。アイテム固有の未決事項は各設計書に記載する。

## 拡張とバランスの方針

実装済みの剣・斧・投擲武器の3種類を基盤とし、将来は槍、短剣、ハンマー、手裏剣、投げナイフなどを追加できる構成にする。武器ごとの攻撃力だけでなく、射程、使用間隔、耐久値、素材の入手難度、特殊能力を合わせて調整する。特にネザライト装備より強い武器には相応の入手コストか制約を設け、対モブ戦と対人戦の両方で確認する。

画像は透過PNGのピクセルアートとし、Blockbench の制作素材を残す。16×16と32×32のどちらを標準にするかは未決定。アイテム間で輪郭、光源方向、色数をできるだけ揃える。3Dモデルは現行版の対象外とし、採用時は一人称・三人称の表示、持ち方、アタッチャブルを個別に確認する。

アイテムコンポーネントで実現できる機能はそれを優先し、命中処理や投擲処理など必要な機能に Script API を使う。マルチプレイ、セーブ後の保持、ワールド再読み込み時の動作も実機確認の対象とする。

## アイテムを追加する手順

1. この一覧と新しいアイテムの個別設計書に、ID、名称、性能、入手方法、未決事項を記載する。
2. アイテム定義、画像、テクスチャ登録、日英の翻訳を追加する。必要に応じてレシピとスクリプトも追加する。
3. `tools/validate.mjs` と実機チェックリストを更新し、`./build.ps1` で検証・パッケージ化する。
4. 開発用パックまたは配布用パックで実機確認し、結果をチェックリストに記録する。
