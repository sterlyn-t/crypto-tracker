import { Snackbar } from '@material-ui/core';
import React from 'react';
import { CryptoState } from '../CryptoContext';
import MuiAlert from '@material-ui/lab/Alert';
const Alert = () => {
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setAlert({open: false});
    };

    const { alert, setAlert } = CryptoState();
    return (
        <Snackbar         
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleClose}>
            <MuiAlert
            onClose={handleClose}
            elevation={10}
            severity={alert.type}
            variant="filled"
            >
                {alert.message}
            </MuiAlert>
        </Snackbar>
    )
}

export default Alert
