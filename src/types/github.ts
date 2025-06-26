export interface Repository {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	owner: {
		login: string;
		avatar_url: string;
	};
	updated_at: string;
	created_at: string;
}

export interface Release {
	id: number;
	tag_name: string;
	name: string | null;
	body: string | null;
	html_url: string;
	published_at: string;
	repository: Repository;
	dateCategory?: DateCategory;
}

export type DateCategory =
	| "TODAY"
	| "YESTERDAY"
	| "LAST_WEEK"
	| "LAST_MONTH"
	| "LAST_YEAR"
	| "OLDER";
