import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthSignin from "@/components/features/auth/auth.signin";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Đăng nhập - Soundcloud",
}

const SignInPage = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect('/');
    }

    return (
        <div>
            <AuthSignin />
        </div>
    )
}

export default SignInPage;