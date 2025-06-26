"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ReleaseCard } from "@/components/release-card";
import { ReleaseModal } from "@/components/release-modal";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import type { DateCategory, Release, Repository } from "@/types/github";

export default function Home() {
	const [releases, setReleases] = useState<Release[]>([]);
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<
		DateCategory | "ALL"
	>("ALL");
	const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");

	const fetchReleases = useCallback(async () => {
		setIsLoading(true);
		setError("");
		try {
			const response = await fetch("/api/releases");
			const data = await response.json();

			if (data.success) {
				setReleases(data.releases);
				const uniqueRepos = Array.from(
					new Map(
						data.releases.map((release: Release) => [
							release.repository.id,
							release.repository,
						]),
					).values(),
				) as Repository[];
				setRepositories(uniqueRepos);
			} else {
				setError(data.error);
			}
		} catch {
			setError("リリース情報の取得に失敗しました");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchReleases();
	}, [fetchReleases]);

	const filteredReleases = releases.filter((release) => {
		if (selectedCategory === "ALL") return true;
		return release.dateCategory === selectedCategory;
	});

	const releaseCounts = releases.reduce(
		(counts, release) => {
			counts.ALL = (counts.ALL || 0) + 1;
			if (release.dateCategory) {
				counts[release.dateCategory] = (counts[release.dateCategory] || 0) + 1;
			}
			return counts;
		},
		{} as Record<DateCategory | "ALL", number>,
	);

	const handleReleaseClick = (release: Release) => {
		setSelectedRelease(release);
		setModalOpen(true);
	};

	if (error) {
		return (
			<div className="min-h-screen p-8 bg-background">
				<div className="max-w-4xl mx-auto">
					<div className="text-center py-12">
						<h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
						<p className="text-muted-foreground mb-6">{error}</p>
						<Button onClick={fetchReleases}>
							<RefreshCw className="w-4 h-4 mr-2" />
							再試行
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="flex">
				<Sidebar
					repositories={repositories}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
					releaseCounts={releaseCounts}
				/>

				<main className="flex-1 p-6">
					<header className="mb-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold">GitHub Release Checker</h1>
								<p className="text-muted-foreground mt-1">
									{selectedCategory === "ALL"
										? "すべてのリリース"
										: `${selectedCategory}のリリース`}{" "}
									({filteredReleases.length}件)
								</p>
							</div>
							<Button
								onClick={fetchReleases}
								disabled={isLoading}
								variant="outline"
							>
								<RefreshCw
									className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
								/>
								更新
							</Button>
						</div>
					</header>

					{isLoading ? (
						<div className="text-center py-12">
							<RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
							<p className="text-muted-foreground">リリース情報を取得中...</p>
						</div>
					) : filteredReleases.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground">
								{selectedCategory === "ALL"
									? "リリースが見つかりませんでした"
									: `${selectedCategory}のリリースはありません`}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredReleases.map((release) => (
								<ReleaseCard
									key={`${release.repository.id}-${release.id}`}
									release={release}
									onClick={() => handleReleaseClick(release)}
								/>
							))}
						</div>
					)}
				</main>
			</div>

			<ReleaseModal
				release={selectedRelease}
				open={modalOpen}
				onOpenChange={setModalOpen}
			/>
		</div>
	);
}
