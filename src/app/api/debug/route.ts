import { NextResponse } from "next/server";

export async function GET() {
	const token = process.env.GITHUB_TOKEN;

	return NextResponse.json({
		tokenExists: !!token,
		tokenPrefix: token ? `${token.substring(0, 10)}...` : "なし",
		tokenLength: token?.length || 0,
	});
}
