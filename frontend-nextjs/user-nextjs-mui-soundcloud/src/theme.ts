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
                text: {
                    primary: '#121212',
                },
                primary: {
                    main: '#1ed760',
                    // contrastText: '#fff',
                },
                background: {
                    default: '#fff',
                },
            },
        },
        dark: {
            palette: {
                text: {
                    primary: '#fff',
                },
                primary: {
                    main: '#1ed760',
                },
                background: {
                    default: '#121212',
                    paper: '#1d1d1d',
                },
            },
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
        MuiInput: {
            styleOverrides: {
                root: ({ theme }) => [
                    {
                        '&::before': {
                            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                        },
                        '&:hover:not(.Mui-disabled, .Mui-error):before': {
                            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                        },
                        '&.Mui-focused:after': {
                            borderBottom: '1.5px solid #121212',
                        },
                    },
                    theme.applyStyles('dark', {
                        '&::before': {
                            borderBottom: '1px solid grey',
                        },
                        '&:hover:not(.Mui-disabled, .Mui-error):before': {
                            borderBottom: '1px solid #fff',
                        },
                        '&.Mui-focused:after': {
                            borderBottom: '1.5px solid #fff',
                        },
                    })
                ],
            },
        },
    },
});


export default theme;