import { Box, styled, TextField, TextFieldProps } from "@mui/material";

export const CredentialTextField = styled(TextField)<TextFieldProps>(
    ({ theme }) => (
        {
            '& .MuiOutlinedInput-root': {
                paddingRight: '0px',
            },
            '& .MuiInputBase-input': {
                textOverflow: 'ellipsis',

                position: 'relative',

                color: '#fff',
                padding: '13px',
                borderRadius: '4px',
                boxShadow: 'inset 0 0 0 1px #7c7c7c',
                border: '0px',
                transition: 'box-shadow 100ms ease-in-out, color 100ms ease-in-out',
                backgroundColor: '#121212',

                '&:focus:not(hover)': {
                    boxShadow: 'inset 0 0 0 1.5px #fff',
                },

                '&:hover': {
                    boxShadow: 'inset 0 0 0 1px #fff',
                }
            },
            '& fieldset': {
                display: 'none'
            },
            '& .MuiFormHelperText-root': {
                fontSize: '14px',
                marginBlockStart: '8px',
                marginLeft: 0,
                marginRight: 0,
            },
            minBlockSize: '48px',
            inlineSize: '100%',
        }
    ),
);

const InputGroup = styled('div')({
    // Có thể thêm styles cho group nếu cần
});

const LabelGroup = styled('div')({
    fontSize: '0.875rem',
    fontWeight: 700,
});

const LabelContainer = styled('div')({
    alignItems: 'center',
    paddingBlockEnd: '8px',
});

const LabelText = styled('span')({
    color: 'white',
    display: 'inline-block'
})

interface CredentialInputProps extends Omit<TextFieldProps, 'label'> {
    label: string;
    containerProps?: any; // Props cho container chính
    labelProps?: any;
}

export const CredentialInput: React.FC<CredentialInputProps> = ({
    label,
    containerProps,
    labelProps,
    ...textFieldProps
}) => {
    return (
        <InputGroup className="Group" {...containerProps}>
            <LabelGroup className="LabelGroup" {...labelProps}>
                <LabelContainer>
                    <LabelText>{label}</LabelText>
                </LabelContainer>
            </LabelGroup>
            <CredentialTextField {...textFieldProps} />
        </InputGroup>
    );
};

export default CredentialInput;