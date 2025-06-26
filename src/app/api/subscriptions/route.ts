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

		const repoList = subscriptions.map((repo) => ({
			name: repo.full_name,
			description: repo.description,
			updated_at: repo.updated_at,
			html_url: repo.html_url,
		}));

		return NextResponse.json({
			success: true,
			total: subscriptions.length,
			repositories: repoList,
		});
	} catch (error) {
		return NextResponse.json({
			error: error instanceof Error ? error.message : String(error),
		});
	}
}
