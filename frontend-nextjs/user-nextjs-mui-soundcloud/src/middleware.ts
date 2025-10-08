import { withAuth } from "next-auth/middleware"

export default withAuth({
    // Matches the pages config in `[...nextauth]`
    pages: {
        signIn: "/auth/signin",
        signOut: '/',
    },
})

export const config = {
    matcher: [
        "/playlist",
        "/track/upload",
        "/track/:slug",
        "/like"
    ]
}