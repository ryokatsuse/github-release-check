import type { DateCategory } from "@/types/github";

export function getDateCategory(date: string): DateCategory {
	const now = new Date();
	const targetDate = new Date(date);
	const diffInMilliseconds = now.getTime() - targetDate.getTime();
	const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

	if (diffInDays === 0) return "TODAY";
	if (diffInDays === 1) return "YESTERDAY";
	if (diffInDays <= 7) return "LAST_WEEK";
	if (diffInDays <= 30) return "LAST_MONTH";
	if (diffInDays <= 365) return "LAST_YEAR";
	return "OLDER";
}

export function formatDate(date: string): string {
	return new Date(date).toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
