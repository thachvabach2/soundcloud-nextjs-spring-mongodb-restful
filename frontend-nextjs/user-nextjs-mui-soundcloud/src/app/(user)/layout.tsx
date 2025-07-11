import { Box, CssBaseline } from "@mui/material";
import AppHeader from "@/components/layout/header/app.header";
import AppFooter from "@/components/layout/footer/app.footer";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <CssBaseline />
            <AppHeader />
            <Box component={'div'} sx={{ paddingX: '24px', paddingTop: '24px', paddingBottom: '60px' }}>
                {children}
            </Box>
            <div style={{ marginBottom: '50px' }}></div>
            <AppFooter />
        </>
    );
}