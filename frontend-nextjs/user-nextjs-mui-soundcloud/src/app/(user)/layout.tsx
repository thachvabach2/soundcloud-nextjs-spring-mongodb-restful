import { CssBaseline } from "@mui/material";
import AppHeader from "@/components/layout/header/app.header";
import AppFooter from "@/components/layout/footer/app.footer";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <CssBaseline />
            <AppHeader />
            {children}
            <AppFooter />
        </>
    );
}
