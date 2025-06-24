export const metadata = {
    title: 'Login - SoundCloud',
    description: 'Music for you'
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            {children}
        </>
    );
}
