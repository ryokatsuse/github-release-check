# GitHub Release Checker

GitHub の購読リポジトリから Release 情報を RSS のように表示する Next.js アプリケーション

## 概要

このアプリケーションは、GitHub で Subscribe している リポジトリの Release 通知を有効にしたものから、新しいリリース情報を取得し、RSS リーダーのような形式で表示します。

## 主な機能

- 購読リポジトリのリリース情報を一覧表示
- カード形式での見やすいUI
- 日付によるフィルタリング（TODAY、YESTERDAY、LAST_WEEK など）
- リポジトリの詳細情報をモーダルで表示
- GitHub リポジトリページへの直接リンク

## 技術スタック

- **Frontend**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Code Quality**: Biome (linting/formatting)
- **Git Hooks**: lefthook
- **Package Manager**: pnpm
- **Deployment**: Vercel

## 開発環境のセットアップ

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env.local
# GitHub Personal Access Token を設定

# 開発サーバーの起動
pnpm dev
```

## GitHub API の設定

1. GitHub の [Personal Access Tokens](https://github.com/settings/tokens) で新しいトークンを作成
2. 必要な権限: `repo`, `notifications`
3. `.env.local` に `GITHUB_TOKEN=your_token_here` を設定

## デプロイ

Vercel での自動デプロイに対応しています。

```bash
# ビルド確認
pnpm build

# 本番環境での起動
pnpm start
```
