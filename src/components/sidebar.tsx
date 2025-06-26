import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DateCategory, Repository } from "@/types/github";

interface SidebarProps {
	repositories: Repository[];
	selectedCategory: DateCategory | "ALL";
	onCategoryChange: (category: DateCategory | "ALL") => void;
	releaseCounts: Record<DateCategory | "ALL", number>;
}

const categoryLabels: Record<DateCategory | "ALL", string> = {
	ALL: "すべて",
	TODAY: "今日",
	YESTERDAY: "昨日",
	LAST_WEEK: "先週",
	LAST_MONTH: "先月",
	LAST_YEAR: "昨年",
	OLDER: "それ以前",
};

export function Sidebar({
	repositories,
	selectedCategory,
	onCategoryChange,
	releaseCounts,
}: SidebarProps) {
	return (
		<div className="w-80 h-screen overflow-y-auto bg-muted/30 border-r">
			<div className="p-6 space-y-6">
				<div>
					<h2 className="text-lg font-semibold mb-4">期間でフィルター</h2>
					<div className="space-y-2">
						{(Object.keys(categoryLabels) as (DateCategory | "ALL")[]).map(
							(category) => (
								<button
									key={category}
									type="button"
									onClick={() => onCategoryChange(category)}
									className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
										selectedCategory === category
											? "bg-primary text-primary-foreground"
											: "hover:bg-muted"
									}`}
								>
									<span>{categoryLabels[category]}</span>
									<Badge variant="secondary">
										{releaseCounts[category] || 0}
									</Badge>
								</button>
							),
						)}
					</div>
				</div>

				<div>
					<h2 className="text-lg font-semibold mb-4">購読リポジトリ</h2>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">統計</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">購読数:</span>
									<span className="font-medium">{repositories.length}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">総リリース:</span>
									<span className="font-medium">{releaseCounts.ALL || 0}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
