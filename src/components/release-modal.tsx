import { Calendar, ExternalLink, GitBranch } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/date-utils";
import type { Release } from "@/types/github";

interface ReleaseModalProps {
	release: Release | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ReleaseModal({
	release,
	open,
	onOpenChange,
}: ReleaseModalProps) {
	if (!release) return null;

	const { repository } = release;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-center space-x-3 mb-4">
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={repository.owner.avatar_url}
								alt={repository.owner.login}
							/>
							<AvatarFallback>
								{repository.owner.login.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<DialogTitle className="text-xl">{repository.name}</DialogTitle>
							<p className="text-sm text-muted-foreground">
								{repository.owner.login}
							</p>
						</div>
						<Badge variant="outline">
							<GitBranch className="w-3 h-3 mr-1" />
							{release.tag_name}
						</Badge>
					</div>
				</DialogHeader>

				<div className="space-y-6">
					<div>
						<h3 className="text-lg font-semibold mb-2">
							{release.name || release.tag_name}
						</h3>
						{repository.description && (
							<p className="text-muted-foreground mb-4">
								{repository.description}
							</p>
						)}
					</div>

					<div className="flex items-center space-x-4 text-sm text-muted-foreground">
						<div className="flex items-center">
							<Calendar className="w-4 h-4 mr-1" />
							{formatDate(release.published_at)}
						</div>
					</div>

					{release.body && (
						<div>
							<h4 className="font-medium mb-2">リリースノート</h4>
							<div className="bg-muted/50 rounded-lg p-4">
								<pre className="whitespace-pre-wrap text-sm text-muted-foreground">
									{release.body}
								</pre>
							</div>
						</div>
					)}

					<div className="flex space-x-3 pt-4">
						<Button
							onClick={() => window.open(repository.html_url, "_blank")}
							variant="outline"
						>
							<ExternalLink className="w-4 h-4 mr-2" />
							リポジトリを見る
						</Button>
						<Button onClick={() => window.open(release.html_url, "_blank")}>
							<ExternalLink className="w-4 h-4 mr-2" />
							GitHubでリリースを見る
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
