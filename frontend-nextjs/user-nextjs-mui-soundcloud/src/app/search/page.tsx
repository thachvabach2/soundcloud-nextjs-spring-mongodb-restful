import { searchTracksWithName } from "@/actions/actions.track";
import SearchTrack from "@/components/features/search/search.track";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const searchP = await searchParams;
    const query = searchP?.q as string;

    return {
        title: `${query} results on Soundcloud`,
        description: `Looking for something? Find artists, songs, albums, playlists, and more.`
    }
}

const SearchPage = async ({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const searchP = await searchParams;
    const query = searchP?.q as string;

    const res = await searchTracksWithName(query);

    if (!res.data) {
        notFound();
    }

    console.log('>>> check searchparams in server component:', query)
    return (
        <>
            <SearchTrack
                dataSearch={res.data?.result}
                query={query}
            />
        </>
    )
}

export default SearchPage;