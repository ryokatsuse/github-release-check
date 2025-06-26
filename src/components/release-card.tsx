import { ExternalLink, GitBranch } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/date-utils";
import type { Release } from "@/types/github";

interface ReleaseCardProps {
	release: Release;
	onClick: () => void;
}

export function ReleaseCard({ release, onClick }: ReleaseCardProps) {
	const { repository } = release;

	return (
		<Card className="hover:shadow-lg transition-shadow cursor-pointer">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={repository.owner.avatar_url}
								alt={repository.owner.login}
							/>
							<AvatarFallback>
								{repository.owner.login.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="font-semibold text-sm leading-tight">
								{repository.name}
							</h3>
							<p className="text-xs text-muted-foreground">
								{repository.owner.login}
							</p>
						</div>
					</div>
					<Badge variant="outline" className="text-xs">
						<GitBranch className="w-3 h-3 mr-1" />
						{release.tag_name}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					<div>
						<h4 className="font-medium text-sm mb-1">
							{release.name || release.tag_name}
						</h4>
						{repository.description && (
							<p className="text-xs text-muted-foreground line-clamp-2">
								{repository.description}
							</p>
						)}
					</div>

					<div className="flex items-center justify-between">
						<time className="text-xs text-muted-foreground">
							{formatDate(release.published_at)}
						</time>
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="sm"
								className="h-7 px-2 text-xs"
								onClick={(e) => {
									e.stopPropagation();
									window.open(repository.html_url, "_blank");
								}}
							>
								<ExternalLink className="w-3 h-3 mr-1" />
								Repo
							</Button>
							<Button
								size="sm"
								className="h-7 px-2 text-xs"
								onClick={(e) => {
									e.stopPropagation();
									onClick();
								}}
							>
								詳細
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
