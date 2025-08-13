'use server'

import { cookies } from "next/headers"

export const changeLanguageCookieAction = async (locale: string) => {
    const cookieStore = await cookies();

    cookieStore.set({
        name: 'sc_locale',
        value: locale,
        secure: true,
        sameSite: 'none',
        httpOnly: false,
        path: '/'
    });
}

export const getLanguageCookieAction = async () => {
    const cookieStore = await cookies();

    const localeCookie = cookieStore.get('sc_locale')?.value;
    const languages = ['en', 'vi'];

    if (localeCookie && languages.includes(localeCookie)) {
        return localeCookie;
    } else {
        cookieStore.set({
            name: 'sc_locale',
            value: 'en',
            secure: true,
            sameSite: 'none',
            httpOnly: false,
            path: '/'
        });
        return 'en';
    }
}