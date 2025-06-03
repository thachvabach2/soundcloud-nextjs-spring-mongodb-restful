import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from '@/theme';
import "./globals.css";

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {children}
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
