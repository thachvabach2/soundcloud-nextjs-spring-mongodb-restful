import "@/styles/globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { AppProvider } from "./provider";
import AppFooter from "@/components/layout/footer/app.footer";

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <AppProvider locale={locale} messages={messages}>
                    {children}
                    <AppFooter />
                </AppProvider>
            </body>
        </html>
    );
}
