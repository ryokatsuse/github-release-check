import { NextResponse } from "next/server";
import { getDateCategory } from "@/lib/date-utils";
import { GitHubClient } from "@/lib/github";
import type { Release } from "@/types/github";

export async function GET() {
	try {
		const token = process.env.GITHUB_TOKEN;

		if (!token) {
			return NextResponse.json(
				{ error: "GitHub token not configured" },
				{ status: 500 },
			);
		}

		const client = new GitHubClient(token);

		// 購読リポジトリとスターリポジトリの両方を取得
		const [subscriptions, starred] = await Promise.all([
			client.getSubscriptions(),
			client.getStarredRepos(),
		]);

		// 重複を除去して統合
		const allRepos = new Map();
		[...subscriptions, ...starred].forEach((repo) => {
			allRepos.set(repo.id, repo);
		});
		const repositories = Array.from(allRepos.values());

		// 3ヶ月前の日付を計算（十分なデータを確保）
		const threeMonthsAgo = new Date();
		threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

		const allReleases: Release[] = [];
		let processedRepos = 0;

		// バッチ処理でレート制限を回避（5個ずつ並列処理）
		const batchSize = 5;
		for (let i = 0; i < repositories.length; i += batchSize) {
			const batch = repositories.slice(i, i + batchSize);

			const batchPromises = batch.map(async (repo) => {
				try {
					const releases = await client.getRepositoryReleases(
						repo.owner.login,
						repo.name,
					);

					// 直近3ヶ月のリリースのみをフィルタリング
					const recentReleases = releases.filter((release) => {
						const releaseDate = new Date(release.published_at);
						return releaseDate >= threeMonthsAgo;
					});

					if (recentReleases.length > 0) {
						return recentReleases.map((release) => ({
							...release,
							repository: repo,
						}));
					}
					return [];
				} catch (error) {
					console.warn(
						`Failed to fetch releases for ${repo.full_name}:`,
						error,
					);
					return [];
				}
			});

			const batchResults = await Promise.all(batchPromises);
			allReleases.push(...batchResults.flat());
			processedRepos += batch.length;

			// バッチ間で少し待機（レート制限対策）
			if (i + batchSize < repositories.length) {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		}

		const sortedReleases = allReleases.sort(
			(a, b) =>
				new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
		);

		const releasesWithCategories = sortedReleases.map((release) => ({
			...release,
			dateCategory: getDateCategory(release.published_at),
		}));

		return NextResponse.json({
			success: true,
			releases: releasesWithCategories,
			total: releasesWithCategories.length,
			repositories: repositories.length,
			subscriptions: subscriptions.length,
			starred: starred.length,
			processedRepos,
			dateFilter: threeMonthsAgo.toISOString(),
		});
	} catch (error) {
		console.error("Failed to fetch releases:", error);
		return NextResponse.json(
			{ error: "Failed to fetch releases" },
			{ status: 500 },
		);
	}
}
