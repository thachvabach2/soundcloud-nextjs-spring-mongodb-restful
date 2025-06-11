import { NextRequest } from "next/server";

// default
export const dynamic = 'auto'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const fileName = searchParams.get('audio');

    console.log('>>>> check searchParams: ', fileName);
    return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${fileName}`);
}