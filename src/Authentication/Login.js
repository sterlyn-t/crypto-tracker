import React, { useState } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { CryptoState } from '../CryptoContext';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth } from '../firebase';
import { Classnames } from 'react-alice-carousel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    text: {
        //color: "white",
        backgroundColor: "black"
    }
});

const Login = ({ handleClose }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAlert } = CryptoState();

    const classes = useStyles();

    const handleSubmit = async () => {
        if (!email || !password){
            setAlert({
                open: true,
                message: "Please fill all the fields",
                type: "error"
            });
            return;
        }

        try {

            const result = await signInWithEmailAndPassword(auth, email, password);

            setAlert({
                open: true,
                message: `Login successful. Welcome ${result.user.email}`,
                type: "success",
            });


        } catch(error){
            setAlert({
                open: true,
                message: error.message,
                type: "error"
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
        label="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        className={classes.textfield}
        />
        <TextField
        variant="outlined"
        type="password"
        label="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        className={classes.textfield}
        />
        <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: "#EEBC1D" }}
        onClick={handleSubmit}
        >Login</Button>
        </Box>
    )
}

export default Login
