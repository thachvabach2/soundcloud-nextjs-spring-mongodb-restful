import { NextRequest } from "next/server";

export const dynamic = 'auto'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const fileName = searchParams.get('audio');

    return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${fileName}`);
}