import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppHeader from "@/components/layout/header/app.header";
import AppFooter from "@/components/layout/footer/app.footer";
import { Metadata } from "next";
import { getLanguageCookieAction } from "@/actions/actions.cookie";

export const metadata: Metadata = {
    title: "SoundCloud - Web Player: Music for everyone",
    description: 'Description from layout',
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const languageInCookie = getLanguageCookieAction();


    return (
        <>
            <CssBaseline />
            <AppHeader languageInCookie={languageInCookie} />

            <Box
                component={'div'}
                sx={{
                    paddingX: '24px',
                    paddingTop: '24px',
                    paddingBottom: '60px',
                    width: '100%',
                    margin: '0 auto',
                    maxWidth: '1248px',
                }}
            >
                {children}
            </Box>
            <div style={{ marginBottom: '50px' }}></div>
            <AppFooter />
        </>
    );
}