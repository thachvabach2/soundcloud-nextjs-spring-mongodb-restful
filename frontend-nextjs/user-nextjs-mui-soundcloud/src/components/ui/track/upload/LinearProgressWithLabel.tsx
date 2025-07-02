import { Box, LinearProgress, LinearProgressProps, Typography } from "@mui/material"

export const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
    return (
        <>
            <Box sx={{ flex: 1 }} >
                <LinearProgress
                    variant="determinate"
                    {...props}
                    sx={{
                        height: { xs: '8px', md: '6px' },
                        backgroundColor: 'rgb(221, 221, 221)',
                    }}
                />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block', whiteSpace: 'nowrap' } }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'text.primary' }}
                >
                    {`Uploading ${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </>
    )
}