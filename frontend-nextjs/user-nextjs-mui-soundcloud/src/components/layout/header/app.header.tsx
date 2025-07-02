'use client'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Tab, Tabs, Tooltip, useColorScheme } from '@mui/material';
import { signOut, useSession } from "next-auth/react"
import { CustomAppBar } from '@/components/ui/layout/CustomAppBar';
import Link from 'next/link';

const pages = ['Playlists', 'Likes', 'Upload'];

// styled-component
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f3f3f3',
    '&:focus-within': {
        border: '1px solid black',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '30ch',
        },
    },
}));

const AppHeader = () => {
    const { data: session } = useSession()
    // console.log('>>> check session: ', session);

    //
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    //
    const [value, setValue] = React.useState('playlist');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    // dark mode
    const { mode, setMode } = useColorScheme();
    if (!mode) {
        return null;
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <CustomAppBar
                    position='fixed'
                    sx={{
                        maxWidth: 'var(--custom-mui-width-container)',
                        left: 0,
                        right: 0,
                        margin: '0 auto',
                        background: '#ffffff',
                    }}
                >
                    <Toolbar>
                        {/* Pages Mobile */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                cursor: 'pointer',
                            }}
                        >
                            <Link href={'/'}>SoundCloud</Link>
                        </Typography>

                        {/* Search */}
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>

                        <Box sx={{ flexGrow: 1 }} />
                        {
                            session
                                ?
                                <>
                                    {/* Pages PC */}
                                    <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            // slotProps={{
                                            //     indicator: {
                                            //         style: { display: 'none' }
                                            //     }
                                            // }}
                                            aria-label="basic tabs example"
                                            sx={{
                                                paddingRight: '20px',
                                                "button": {
                                                    textTransform: 'none',
                                                    fontSize: '1rem',
                                                }
                                            }}
                                        >
                                            <Tab
                                                value={'playlist'}
                                                label={<Link href={'/playlist'}>Playlists</Link>}
                                            />
                                            <Tab
                                                value={'like'}
                                                label={<Link href={'/like'}>Likes</Link>}
                                            />
                                            <Tab
                                                value={'upload'}
                                                label={<Link href={'/track/upload'}>Upload</Link>}
                                            // sx={{ textTransform: 'none', fontSize: '1rem' }}
                                            />
                                        </Tabs>
                                    </Box>

                                    {/* avatar */}
                                    <Box sx={{ flexGrow: 0 }}>
                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                                <Avatar>BD</Avatar>
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            anchorEl={anchorElUser}
                                            id="account-menu"
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                            disableScrollLock={true}
                                            keepMounted
                                            slotProps={{
                                                paper: {
                                                    elevation: 0,
                                                    sx: {
                                                        overflow: 'visible',
                                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                        mt: 1.5,
                                                        '& .MuiAvatar-root': {
                                                            width: 32,
                                                            height: 32,
                                                            ml: -0.5,
                                                            mr: 1,
                                                        },
                                                        '&::before': {
                                                            content: '""',
                                                            display: 'block',
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 14,
                                                            width: 10,
                                                            height: 10,
                                                            bgcolor: 'background.paper',
                                                            transform: 'translateY(-50%) rotate(45deg)',
                                                            zIndex: 0,
                                                        },
                                                    },
                                                },
                                            }}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            <Link href={`/profile/${session?.user?._id}`}>
                                                <MenuItem>
                                                    Profile
                                                </MenuItem>
                                            </Link>

                                            <MenuItem
                                                onClick={() => {
                                                    handleCloseUserMenu;
                                                    signOut({ callbackUrl: '/' });
                                                }}
                                            >
                                                Sign out
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                </>
                                :
                                <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                                    <Tabs
                                        value={'sign-in'}
                                        // onChange={handleChange}
                                        aria-label="basic tabs example"
                                        sx={{
                                            // paddingRight: '20px',
                                            "button": {
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                            }
                                        }}
                                    >
                                        <Tab
                                            value={'sign-in'}
                                            label={<Link href={'/auth/signin'}>Sign in</Link>}
                                        />
                                        <Tab
                                            value={'create-account'}
                                            label={<Link href={'/create-account'}>Create Account</Link>}

                                        />
                                        <Tab
                                            value={'upload'}
                                            label={<Link href={'/track/upload'}>Upload</Link>}
                                        />
                                    </Tabs>
                                </Box>
                        }
                        <select
                            value={mode}
                            onChange={(event) => {
                                setMode(event.target.value as 'light' | 'dark' | 'system');
                                // For TypeScript, cast `event.target.value as 'light' | 'dark' | 'system'`:
                            }}
                        >
                            <option value="system">System</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </Toolbar>
                </CustomAppBar>
            </Box >
            <Toolbar />
        </>

    )
}

export default AppHeader;