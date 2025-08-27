import "@/styles/globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { AppProvider } from "./provider";

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <AppProvider locale={locale} messages={messages}>
                    {children}
                </AppProvider>
            </body>
        </html>
    );
}
