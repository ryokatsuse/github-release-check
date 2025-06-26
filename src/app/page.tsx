"use client";

import { useState } from "react";

export default function Home() {
	const [testResult, setTestResult] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);

	const testGitHubConnection = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/test-github");
			const data = await response.json();

			if (data.success) {
				setTestResult(
					`✅ GitHub API接続成功！\n購読リポジトリ数: ${data.total}\n最初の5件を取得しました。`,
				);
			} else {
				setTestResult(`❌ GitHub API接続失敗: ${data.error}`);
			}
		} catch (error) {
			setTestResult(`❌ エラー: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen p-8 bg-background">
			<main className="max-w-4xl mx-auto">
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-foreground mb-2">
						GitHub Release Checker
					</h1>
					<p className="text-muted-foreground">
						購読リポジトリのリリース情報をRSSのように表示します
					</p>
				</header>

				<div className="space-y-6">
					<div className="border rounded-lg p-6">
						<h2 className="text-2xl font-semibold mb-4">
							GitHub API接続テスト
						</h2>
						<button
							type="button"
							onClick={testGitHubConnection}
							disabled={isLoading}
							className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
						>
							{isLoading ? "テスト中..." : "GitHub API接続をテスト"}
						</button>

						{testResult && (
							<div className="mt-4 p-4 bg-muted rounded-md">
								<pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
							</div>
						)}
					</div>

					<div className="border rounded-lg p-6">
						<h2 className="text-2xl font-semibold mb-4">次のステップ</h2>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground">
							<li>GitHub APIトークンの設定確認</li>
							<li>購読リポジトリの取得</li>
							<li>リリース情報の表示UI作成</li>
							<li>日付フィルタリング機能の実装</li>
						</ul>
					</div>
				</div>
			</main>
		</div>
	);
}
