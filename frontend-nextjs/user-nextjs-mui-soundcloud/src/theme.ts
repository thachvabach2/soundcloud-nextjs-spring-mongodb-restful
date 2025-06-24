'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    colorSchemes: {
        light: {
            palette: {
                background: {
                    default: '#34a853',
                },
                AppBar: {
                    defaultBg: '#34a853' // not working
                }
            },
        },
        dark: {

        }
    },
    cssVariables: {
        colorSchemeSelector: '.encore-%s-theme',
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ":root": {
                    '--custom-mui-width-container': '1248px',
                },
                body: {
                    maxWidth: 'var(--custom-mui-width-container)',
                    margin: '0 auto',
                    color: '#121212',
                }
            }
        },
        // Example
        MuiAlert: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            props: { severity: 'info' },
                            style: {
                                backgroundColor: '#60a5fa',
                            },
                        },
                    ],
                },
            },
        },
    },
});


export default theme;