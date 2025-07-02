import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendRequest } from "@/lib/utils/api";
import { getServerSession } from "next-auth";

const ProfilePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    const tracks = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: "http://localhost:8080/api/v1/tracks/users?page=1&size=10",
        method: "POST",
        body: { id: slug },
    })

    console.log('>>> check tracks: ', tracks)
    return (
        <div>
            profile page slug: {slug}
        </div>
    )
}

export default ProfilePage;