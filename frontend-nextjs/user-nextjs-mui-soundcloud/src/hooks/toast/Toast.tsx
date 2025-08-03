'use client'
import Alert from "@mui/material/Alert"
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar"
import * as React from "react"
import { FC } from "react"
import { ToastMessage } from "@/hooks/toast/use.toast"

export type ToastStyle = Omit<
    SnackbarProps,
    "TransitionProps" | "onClose" | "open" | "children" | "message"
>

export type ToastProps = {
    message: ToastMessage
    onExited: () => void
} & ToastStyle

// https://mui.com/material-ui/react-snackbar/#consecutive-snackbars
export const Toast: FC<ToastProps> = ({
    message,
    onExited,
    autoHideDuration,
    ...props
}) => {
    const [open, setOpen] = React.useState(true)

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return
        }
        setOpen(false)
    }

    return (
        <Snackbar
            key={message.key}
            open={open}
            onClose={handleClose}
            slotProps={{
                transition: {
                    onExited
                }
            }}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={autoHideDuration ?? 3000}
            {...props}
        >
            <Alert severity={message.severity}>{message.message}</Alert>
        </Snackbar>
    )
}
