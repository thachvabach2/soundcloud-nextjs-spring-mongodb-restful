'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    colorSchemes: { light: true },
    cssVariables: {
        colorSchemeSelector: 'class',
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
                    color: '#121212'
                }
            }
        },
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
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#121212',
                    boxShadow: 'none',
                },
            }
        },
    },
    palette: {
        background: {
            default: '#ffffff'
        },
    }
});

export default theme;