import { AppBar, AppBarProps, Button, styled } from "@mui/material";


export const CustomAppBar = styled(AppBar)<AppBarProps>(({ theme }) => ({
    color: '#121212',
    boxShadow: 'none',
}),
);