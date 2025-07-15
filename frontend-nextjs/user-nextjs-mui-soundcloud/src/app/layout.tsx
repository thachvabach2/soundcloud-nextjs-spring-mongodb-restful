import "@/styles/globals.css";
import { InitColorSchemeScript, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from '@/theme';
import NextAuthWrapper from "@/lib/auth/next.auth.wrapper";
import { ToastProvider } from "@/hooks/toast";
import { TrackContextProvider } from "@/context/track.context.provider";
import BProgressProvider from "@/context/bprogress.provider";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <AppRouterCacheProvider>
                    <InitColorSchemeScript attribute=".encore-%s-theme" />
                    <ThemeProvider theme={theme} defaultMode="light">
                        <NextAuthWrapper>
                            <BProgressProvider>
                                <ToastProvider>
                                    <TrackContextProvider>
                                        {children}
                                    </TrackContextProvider>
                                </ToastProvider>
                            </BProgressProvider>
                        </NextAuthWrapper>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
