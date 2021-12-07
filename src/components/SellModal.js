import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { AppBar, Button, Tabs, Tab, Box } from '@material-ui/core';

import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { auth } from '../firebase';
import  { CryptoState}  from '../CryptoContext';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
      color: "white",
      borderRadius: 10,
      width: 400,
      backgroundColor: theme.palette.background.paper,
  },
  google: {
      padding: 24,
      paddingTop: 0,
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      gap: 20,
      fontSize: 20,
  }

}));

export default function BuyModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { setAlert } = CryptoState();

  return (
    <div>
              <Button
              variant="outlined"
              style={{
                width: "47%",
                height: 40,
                marginBottom: 10,
                backgroundColor: "#EEBC1D"
              }}
              onClick={handleOpen}
              >
                 Sell
              </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <AppBar
              position="static"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ borderRadius: 10 }}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            {/* {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <Signup handleClose={handleClose} />} */}

            <Box className={classes.google}>
                <span>OR</span>
                <GoogleButton 
                 style={{ width: "100%", outline: "none"}}
                 //onClick={signInWithGoogle}
                 />
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

