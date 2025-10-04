"use client";

import { FC, ReactNode } from "react";
import { InitColorSchemeScript, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from '@/theme';
import NextAuthWrapper from "@/lib/auth/next.auth.wrapper";
import { ToastProvider } from "@/hooks/toast";
import { TrackContextProvider } from "@/context/track.context.provider";
import BProgressProvider from "@/context/bprogress.provider";
import { NextIntlClientProvider } from "next-intl";
import { SWRConfig } from 'swr'
import { SWR_CONFIG } from "@/lib/constants";

export interface IAppProvider {
    children: ReactNode;
    locale: string;
    messages: Record<string, any>
}

export const AppProvider: FC<IAppProvider> = (props) => {
    const { children, locale, messages } = props;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <>
            <AppRouterCacheProvider>
                <InitColorSchemeScript attribute=".encore-%s-theme" />
                <ThemeProvider theme={theme} defaultMode="light">
                    <NextAuthWrapper>
                        <BProgressProvider>
                            <ToastProvider>
                                <TrackContextProvider>
                                    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
                                        <SWRConfig value={SWR_CONFIG}>
                                            {children}
                                        </SWRConfig>
                                    </NextIntlClientProvider>
                                </TrackContextProvider>
                            </ToastProvider>
                        </BProgressProvider>
                    </NextAuthWrapper>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </>
    )
}