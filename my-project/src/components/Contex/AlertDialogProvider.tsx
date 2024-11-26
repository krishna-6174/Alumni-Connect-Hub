import React, { createContext, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface AlertDialogContextProps {
  showAlertDialog: (title: string, message: string, onConfirm: () => void) => void;
}

interface AlertDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export const AlertDialogContext = createContext<AlertDialogContextProps | null>(null);

const AlertDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = useState<AlertDialogProps>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showAlertDialog = (title: string, message: string, onConfirm: () => void) => {
    setDialog({
      open: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleClose = () => {
    setDialog((prevVals) => ({ ...prevVals, open: false }));
  };

  return (
    <AlertDialogContext.Provider value={{ showAlertDialog }}>
      {children}

      <Dialog open={dialog.open} onClose={handleClose}>
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>{dialog.message}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dialog.onConfirm();
              handleClose();
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </AlertDialogContext.Provider>
  );
};

export default AlertDialogProvider;
