import type { Release, Repository } from "@/types/github";

const GITHUB_API_BASE = "https://api.github.com";

export class GitHubClient {
	private token: string;

	constructor(token: string) {
		this.token = token;
	}

	private async request<T>(endpoint: string): Promise<T> {
		const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				Accept: "application/vnd.github.v3+json",
			},
		});

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status}`);
		}

		return response.json();
	}

	async getSubscriptions(): Promise<Repository[]> {
		return this.request<Repository[]>("/user/subscriptions");
	}

	async getStarredRepos(): Promise<Repository[]> {
		return this.request<Repository[]>("/user/starred?per_page=100");
	}

	async getRepositoryReleases(owner: string, repo: string): Promise<Release[]> {
		// 最新の10件のリリースのみを取得（パフォーマンス向上）
		return this.request<Release[]>(
			`/repos/${owner}/${repo}/releases?per_page=10&page=1`,
		);
	}
}
