import AppBar from "@mui/material/AppBar";
import { AppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";

export const CustomAppBar = styled(AppBar)<AppBarProps>(({ theme }) => [
    {
        color: '#121212',
        boxShadow: 'none',
        backgroundColor: '#fff',
    },
    theme.applyStyles('dark', {
        backgroundColor: '#000000',
        backgroundImage: 'none'
    }),
]);