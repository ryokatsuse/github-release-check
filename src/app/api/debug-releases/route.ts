import { NextResponse } from "next/server";
import { GitHubClient } from "@/lib/github";

export async function GET() {
	try {
		const token = process.env.GITHUB_TOKEN;

		if (!token) {
			return NextResponse.json({ error: "No token" });
		}

		const client = new GitHubClient(token);
		const subscriptions = await client.getSubscriptions();

		// 最初の5個のリポジトリの詳細情報を取得
		const debugInfo = [];
		const testRepos = subscriptions.slice(0, 5);

		for (const repo of testRepos) {
			try {
				const releases = await client.getRepositoryReleases(
					repo.owner.login,
					repo.name,
				);

				debugInfo.push({
					repo: repo.full_name,
					totalReleases: releases.length,
					latestRelease: releases[0]
						? {
								name: releases[0].name || releases[0].tag_name,
								published_at: releases[0].published_at,
								isRecent:
									new Date(releases[0].published_at) >=
									new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
							}
						: null,
					allReleaseDates: releases.slice(0, 3).map((r) => ({
						name: r.name || r.tag_name,
						date: r.published_at,
						daysAgo: Math.floor(
							(Date.now() - new Date(r.published_at).getTime()) /
								(24 * 60 * 60 * 1000),
						),
					})),
				});
			} catch (error) {
				debugInfo.push({
					repo: repo.full_name,
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}

		return NextResponse.json({
			success: true,
			totalSubscriptions: subscriptions.length,
			dateThreshold: new Date(
				Date.now() - 90 * 24 * 60 * 60 * 1000,
			).toISOString(),
			debugInfo,
		});
	} catch (error) {
		return NextResponse.json({
			error: error instanceof Error ? error.message : String(error),
		});
	}
}
