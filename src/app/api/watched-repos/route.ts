import { NextResponse } from "next/server";
import { GitHubClient } from "@/lib/github";

export async function GET() {
	try {
		const token = process.env.GITHUB_TOKEN;

		if (!token) {
			return NextResponse.json({ error: "No token" });
		}

		const client = new GitHubClient(token);

		// 複数のエンドポイントを試す
		try {
			// 1. /user/subscriptions (現在使用中)
			const subscriptions = await client.getSubscriptions();

			// 2. Starred repositories も試す（リリース情報があるものが多い）
			const starred = await client.request<any[]>("/user/starred?per_page=50");

			return NextResponse.json({
				success: true,
				subscriptions: {
					count: subscriptions.length,
					repos: subscriptions.slice(0, 5).map((r) => r.full_name),
				},
				starred: {
					count: starred.length,
					repos: starred.slice(0, 5).map((r) => r.full_name),
				},
			});
		} catch (error) {
			return NextResponse.json({
				error: error instanceof Error ? error.message : String(error),
			});
		}
	} catch (error) {
		return NextResponse.json({
			error: error instanceof Error ? error.message : String(error),
		});
	}
}
