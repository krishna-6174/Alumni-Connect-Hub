import React, { createContext, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableRow} from "@mui/material";
import 'quill/dist/quill.snow.css'; // Import Quill CSS
import QuillEditor from "../Editor/QuillEditor";
interface ApproveDialogContextProps {
  showApproveDialog: (data: UserData, onConfirm: () => void, sourcePage: string) => void;
}

interface ApproveDialogProps {
  open: boolean;
  data: UserData | null;
  onConfirm: () => void;
  sourcePage: string;
}

interface UserData {
  [key: string]: string | number; // Ensure only strings or numbers are used
}

export const ApproveDialogContext = createContext<ApproveDialogContextProps | null>(null);

const ApproveDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = useState<ApproveDialogProps>({
    open: false,
    data: null,
    onConfirm: () => {},
    sourcePage: '',
  });
  const showApproveDialog = (data: UserData, onConfirm: () => void, sourcePage: string) => {
    setDialog({
      open: true,
      data,
      onConfirm,
      sourcePage,
    });
  };

  const handleClose = () => {
    setDialog((prevVals) => ({ ...prevVals, open: false }));
  };

  // Effect to initialize Quill editors and set content
  

  return (
    <ApproveDialogContext.Provider value={{ showApproveDialog }}>
      {children}
      <Dialog open={dialog.open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{(dialog.sourcePage === "Alumni Data") ? "Approve User Data" : 
                        (dialog.sourcePage === "Approved Alumni Data") ? "Approved User Data":
                        (dialog.sourcePage==="Approved Job Data")?"Approved Job Data":
                        (dialog.sourcePage === "Job Data") ? "Approve Job Data" : 
                        (dialog.sourcePage === "Event Data") ? "Event Data" :
                        (dialog.sourcePage === "JobAlumni") ? "Posted Alumni Data" : " "}</DialogTitle>
        <DialogContent>
          {dialog.data && (
            <Table>
              <TableBody>
                {Object.entries(dialog.data).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{key}</TableCell>
                    <TableCell>
                    {key === "company_info" ? (
                        // <div ref={companyInfoContainerRef} />
                        <QuillEditor content={(dialog.data?.company_info as string) } />

                      ) : key === "role_info" ? (
                        // <div ref={roleInfoContainerRef} style={{ height: '200px' }} />
                        <QuillEditor content={(dialog.data?.role_info as string) } />
                      ):key === "description" ? (
                        // <div ref={companyInfoContainerRef} />
                        <QuillEditor content={(dialog.data?.description as string) } />

                      ) : key === "profile" ? (
                        <img src={value as string} alt="Profile" width={200} height={200} />
                      ) : typeof value === 'string' && value === '' ? (
                        ' --- '
                      ) : (
                        typeof value === 'string' || typeof value === 'number' ? value : '-----'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            sx={{
              backgroundColor: 'grey.600',
              display: (dialog.sourcePage === "JobAlumni"||dialog.sourcePage === "Event Data"||dialog.sourcePage === "Approved Alumni Data"||dialog.sourcePage==="Approved Job Data") ? 'none' : 'block',
              color: 'white',
              '&:hover': {
                backgroundColor: 'grey.800',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              dialog.onConfirm();
              handleClose();
            }}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {(dialog.sourcePage === "JobAlumni"||dialog.sourcePage === "Event Data"||dialog.sourcePage === "Approved Alumni Data"||dialog.sourcePage==="Approved Job Data") ? 'OK' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </ApproveDialogContext.Provider>
  );
};

export default ApproveDialogProvider;
