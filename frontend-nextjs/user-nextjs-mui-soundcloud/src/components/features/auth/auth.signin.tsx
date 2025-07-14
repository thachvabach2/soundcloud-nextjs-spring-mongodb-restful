'use client'
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import CredentialInput from "@/components/ui/auth/CredentialInput";
import ProviderButton from "@/components/ui/auth/ProviderButton";
import Link from "next/link";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

const AuthSignin = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
    const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

    const [errorUsername, setErrorUsername] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');

    const hasTypedUsernameRef = useRef<boolean>(false);
    const hasTypedPassword = useRef<boolean>(false);

    const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(true);

    const buttonSubmitRef = useRef<HTMLButtonElement>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!isLoading) {
            const button = buttonSubmitRef.current;
            if (button) {
                button.dispatchEvent(new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            }
        }
    }, [isLoading]);

    const handleSubmit = async () => {
        setIsErrorUsername(false);
        setIsErrorPassword(false);
        setErrorUsername('');
        setErrorPassword('');

        //handle call api
        setIsLoading(true);
        const res = await signIn('credentials', {
            username: username,
            password: password,
            redirect: false,
        })
        setIsLoading(false);
        if (!res?.error) {
            setIsLoginSuccess(true);
            redirect('/');
        } else {
            setIsLoginSuccess(false);
        }
    }

    const handleOnChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setUsername(value);

        if (value.length > 0) {
            hasTypedUsernameRef.current = true;
        }

        if (hasTypedUsernameRef.current === true) {
            const newErrorUsername = value ? '' : 'Vui lòng nhập tên người dùng SoundCloud hoặc địa chỉ email.';
            if (newErrorUsername !== errorUsername) {
                setIsErrorUsername(true);
                setErrorUsername(newErrorUsername);
            }
        }
    }

    const handleOnChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value);

        if (value.length > 0) {
            hasTypedPassword.current = true;
        }

        if (hasTypedPassword.current === true) {
            const newErrorPassword = value ? '' : 'Vui lòng nhập mật khẩu của bạn.';
            if (newErrorPassword !== errorPassword) {
                setIsErrorPassword(true);
                setErrorPassword(newErrorPassword);
            }
        }
    }

    return (
        <>
            <Stack className="main" sx={{ height: '100vh', overflowX: "hidden", backgroundColor: '#121212' }}>
                <Box
                    component={'div'}
                    sx={{
                        background: { sm: '#121212', md: 'linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgb(0, 0, 0) 100%)' },
                        flex: '3 1 0%',
                        justifyContent: 'center',
                        padding: '32px',
                        display: 'flex',
                    }}
                >
                    <Box sx={{ maxWidth: '734px', width: '100%' }}>
                        <Box className="login-container" style={{ backgroundColor: '#121212', color: '#ffffff', borderRadius: 8, paddingBottom: '32px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '32px', paddingBottom: '8px' }}>
                                <Link href={'/'}>
                                    <Box component={'div'} sx={{ backgroundColor: '#ffff', borderRadius: '50%', cursor: 'pointer' }}>
                                        <GraphicEqOutlinedIcon style={{ fontSize: 36 }} sx={{ color: '#121212' }} />
                                    </Box>
                                </Link>

                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center', marginBottom: '32px' }}>
                                Đăng nhập vào SoundCloud
                            </Typography>
                            {!isLoginSuccess && <Alert variant="filled" severity="error"
                                sx={{
                                    mx: { md: '50px' },
                                    mb: '20px',
                                }}
                            >
                                Tên người dùng hoặc mật khẩu không chính xác.
                            </Alert>}
                            <Stack className="list-provider" sx={{ width: { sm: '100%', md: '324px' }, margin: '0 auto', color: '#ffffff' }} spacing={1}>
                                <ProviderButton onClick={() => signIn('github')}>
                                    <Box component={'span'}>
                                        <GitHubIcon sx={{ width: '1.5rem', height: '1.5rem', color: '' }} />
                                    </Box>
                                    <Box style={{ margin: 'auto' }}>
                                        Đăng nhập với Github
                                    </Box>
                                </ProviderButton>
                                <ProviderButton>
                                    <Box component={'span'}>
                                        <GoogleIcon sx={{ width: '1.5rem', height: '1.5rem', color: '#ea4335' }} />
                                    </Box>
                                    <Box style={{ margin: 'auto' }}>
                                        Đăng nhập với Google
                                    </Box>
                                </ProviderButton><ProviderButton>

                                    <Box style={{ margin: 'auto' }}>
                                        Tiếp tục bằng số điện thoại
                                    </Box>
                                </ProviderButton>
                            </Stack>
                            <Divider sx={{ marginX: { md: '100px' }, my: '32px', borderTop: '1px solid rgb(41, 41, 41)' }} />
                            <Box component={'div'} className="login-form" sx={{ width: { sm: '100%', md: '324px' }, margin: '0 auto' }}>
                                <Stack sx={{ pb: '24px' }} spacing={2}>
                                    <CredentialInput
                                        label="Email hoặc tên người dùng"
                                        placeholder="Email hoặc tên người dùng"
                                        error
                                        helperText={isErrorUsername ? errorUsername : ''}
                                        autoComplete="off"
                                        onChange={handleOnChangeUsername}
                                    />

                                    <CredentialInput
                                        label="Mật khẩu"
                                        placeholder="Mật khẩu"
                                        type={showPassword ? 'text' : 'password'}
                                        error
                                        helperText={isErrorPassword ? errorPassword : ''}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment
                                                        position="end"
                                                        sx={{ position: 'absolute', right: '12px' }}
                                                    >
                                                        <IconButton
                                                            aria-label={
                                                                showPassword ? 'hide the password' : 'display the password'
                                                            }
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            sx={{
                                                                paddingX: 0,
                                                                mr: 0,
                                                                '&:hover .MuiSvgIcon-root': {
                                                                    transform: 'scale(1.04)',
                                                                    color: '#ffffff',
                                                                },
                                                            }}>
                                                            {showPassword
                                                                ?
                                                                <VisibilityOutlinedIcon
                                                                    sx={{
                                                                        color: '#B3B3B3',
                                                                        fontSize: '26px',
                                                                    }}
                                                                />
                                                                :
                                                                <VisibilityOffOutlined
                                                                    sx={{
                                                                        color: '#B3B3B3',
                                                                        fontSize: '26px',
                                                                    }}
                                                                />
                                                            }
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }
                                        }}
                                        onChange={handleOnChangePassword}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !isLoading) {
                                                const button = buttonSubmitRef.current;

                                                // trigger :active
                                                button?.dispatchEvent(new MouseEvent('mousedown', {
                                                    bubbles: true,
                                                    cancelable: true,
                                                    view: window
                                                }))

                                                handleSubmit();
                                            }
                                        }}
                                    />
                                </Stack>
                                <Box sx={{ textAlign: 'center', paddingBlockEnd: '32px' }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            bgcolor: '#1ed760',
                                            color: '#000000',
                                            fontWeight: '700',
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            borderRadius: '9999px',
                                            minBlockSize: '48px',

                                            touchAction: 'manipulation',
                                            transitionDuration: '33ms',
                                            transitionProperty: 'background-color, border-color, color, box-shadow, filter, transform',

                                            '&:hover': {
                                                transform: 'scale(1.03)',
                                                bgcolor: '#3be477'
                                            },
                                        }}
                                        onClick={() => { handleSubmit(), console.log(`Username/password: ${username}/${password}`) }}
                                        ref={buttonSubmitRef}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Box>
                                <Box component={'div'} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Box component={'span'}
                                        sx={{
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            marginBottom: '24px',

                                            '&:hover': {
                                                color: '#1ed760',
                                            }
                                        }}
                                    >
                                        Đăng nhập không cần mật khẩu
                                    </Box>
                                </Box>
                            </Box>
                            <Box component={'div'} className="sign-up" sx={{ textAlign: 'center', paddingBlockEnd: '16px' }}>
                                <Box component={'span'} sx={{ color: '#b3b3b3' }}>
                                    Bạn có tài khoản chưa?
                                </Box>
                                <Box component={'span'}
                                    sx={{
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        ml: { md: '8px' },
                                        display: { xs: 'block', md: 'inline' },
                                        paddingTop: '10px',

                                        '&:hover': {
                                            color: '#1ed760',
                                        }
                                    }}
                                >
                                    Đăng ký SoundCloud
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {/* <footer>Copyright@2025</footer> */}
            </Stack >
        </>
    )
}

export default AuthSignin;