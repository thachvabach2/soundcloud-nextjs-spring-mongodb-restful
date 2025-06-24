import { Box, styled } from "@mui/material";

const ProviderButton = styled(Box)(
    ({ theme }) => (
        {
            overflowWrap: "anywhere",
            backgroundColor: 'transparent',
            borderRadius: '9999px',
            cursor: 'pointer',
            textAlign: 'center',
            touchAction: 'manipulation',
            transitionDuration: '33ms',
            transitionProperty: 'background-color, border-color, color, box-shadow, filter, transform',
            verticalAlign: 'middle',
            border: '1px solid #818181',
            color: '#ffffff',
            minBlockSize: '48px',
            display: "flex",
            alignItems: 'center',
            justifyContent: 'center',
            inlineSize: '100%',

            paddingBlock: '7px',
            paddingInline: '31px',

            fontWeight: 700,

            '&: hover': {
                border: '1px solid #ffffff'
            }
        }
    ),
);
export default ProviderButton;