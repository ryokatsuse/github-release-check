import { NextResponse } from "next/server";
import { GitHubClient } from "@/lib/github";

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
		const subscriptions = await client.getSubscriptions();

		return NextResponse.json({
			success: true,
			subscriptions: subscriptions.slice(0, 5),
			total: subscriptions.length,
		});
	} catch (error) {
		console.error("GitHub API test failed:", error);
		return NextResponse.json(
			{ error: "Failed to connect to GitHub API" },
			{ status: 500 },
		);
	}
}
