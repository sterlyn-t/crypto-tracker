import { createUserWithEmailAndPassword } from '@firebase/auth';
import { Box, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { CryptoState } from '../CryptoContext';
import { auth } from '../firebase';
import { makeStyles } from '@material-ui/core/styles';

const Signup = ({ handleClose }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { setAlert } = CryptoState();

    const useStyles = makeStyles({
        text: {
            backgroundColor: "black"
        },
        textfield: {
            outline: "solid 1px white",
        }
    });
    const classes = useStyles();
    const handleSubmit = async () => {
        if(password !== confirmPassword) {
            setAlert({
                open: true,
                message: "Passwords do not match",
                type: "error",
            });
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            setAlert({
                open: true,
                message: `Sign up Successful. Welcome ${result.user.email}`,
                type: 'success',
            })
            handleClose();
        } catch(error) {
            setAlert({
                open: true,
                message: error.message,
                type: 'error'
            });
            return;
        }
    }

    return (
        <Box p={3}
             style={{ display: "flex", flexDirection: "column", gap: "20px"}}>
        <TextField
        variant="outlined"
        type="email"
        //label="Enter Email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        className={classes.textfield}
        autoFocus
        />
        <TextField
        variant="outlined"
        type="password"
        //label="Enter Password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        className={classes.textfield}
        onFocus
        />
        <TextField
        variant="outlined"
        type="password"
        //label="Confirm Password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        className={classes.textfield}
        onFocus
        />
        <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: "#EEBC1D" }}
        onClick={handleSubmit}
        >Sign Up</Button>
        </Box>
    )
}

export default Signup
