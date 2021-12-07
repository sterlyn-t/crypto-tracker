import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { AppBar, Button, Tabs, Tab, Box, Typography, TextField } from '@material-ui/core';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { auth } from '../firebase';
import  { CryptoState}  from '../CryptoContext';
import { numberWithCommas } from './Banner/Carousel';
import { doc, setDoc, onSnapshot } from '@firebase/firestore';
import { db } from '../firebase';

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
      //backgroundColor: theme.palette.background.paper,
      backgroundColor: "black"
  },
  google: {
      padding: 24,
      paddingTop: 0,
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      gap: 20,
      fontSize: 20,
  },
  textField: {
    '& input[type=number]': {
        '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0
    }
  }

}));

export default function BuyModal({ coin }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [buyPrice, setBuyPrice] = useState(null);
  const [dollars, setDollars] = useState(0);


  const [transaction, setTransaction] = useState("");
  const handleOpen = (transaction) => {
    if(transaction === "buy"){
        setTransaction("buy");
    } else {
        if(transaction === "sell"){
            setTransaction("sell");
        }
    }
    console.log(transaction);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [coinQuantity, setCoinQuantity] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  useEffect(() => {
    const currentPrice = coin?.market_data.current_price[currency.toLowerCase()];
    setCurrentPrice(currentPrice);
     // Incorporating a spread fee of 1.75%
    setBuyPrice(numberWithCommas(((1.75/100)*currentPrice + currentPrice).toFixed(2)));
    setSellPrice(numberWithCommas((currentPrice - (1.75/100)*currentPrice ).toFixed(2)));
  }, []);


  const renderCoinQuantity = (event) => {
    const quantity = ((event.target.value)/currentPrice).toFixed(8);
    setCoinQuantity(quantity);

    // Ensures that $0 is always displayed
    if (event.target.value === ""){
        setDollars(0);
    } else {
        setDollars(event.target.value);
    } 
  }

  const [dollarQuantity, setDollarQuantity] = useState(0);
  const renderDollarQuantity = (event) => {
      let quantity = (((event.target.value)*currentPrice)).toFixed(2);
      quantity = (quantity - (1.75/100)*quantity).toFixed(2);
      if (event.target.value === ""){
          setCoinQuantity(0);
      } else {
          setCoinQuantity((event.target.value));
      }
      setDollarQuantity(quantity);
  }

  const { setAlert, coins, symbol, currency, user, portfolio } = CryptoState();

  const inPortfolio = portfolio.includes(coin?.id);

  const [transactionType, setTransactionType] = useState("");
  const handleBuy = async(event) => {
    setDollars(dollars);
    setTransactionType("buy");
    const balanceRemaining = dollars;
    const userRef = doc(db, "userInfo", user.uid);

    const data = {
        coinId: coin?.id,
        coinQuantity: coinQuantity,
        transactionType: transactionType
    };

    if (dollars !== null){

    try{
        await setDoc(userRef,
            {accountBalance: dollars,
             portfolioInfo: [data]
            },
            { merge: "true" }
            );
            setAlert({
                open: true,
                message: `Successfully bought ${coinQuantity} ${coin.name} !`,
                type: "success"
              });
            setTimeout(() => {
                handleClose();
            }, 1000);
            
    } catch (error){
        setAlert({
            open: true,
            message: error.message,
            type: "error"
          });
    }
  }
}

  useEffect(() => {
    if (user) {
        const userRef = doc(db, "userInfo", user.uid);
        //Checking if database is updated 
        var unsubscribe = onSnapshot(userRef, user => {
            if(user.exists()) {
                setDollars(user.data().accountBalance);
            } else {
                console.log("No items in the watchlist");
            }
        });
        return () => {
            unsubscribe();
        };
    };
}, [user]);

  return (
    <div>
        <div>
              <Button
              id="buy"
              variant="outlined"
              style={{
                width: "47%",
                height: 40,
                marginBottom: 10,
                backgroundColor: "#EEBC1D"
              }}
              onClick={() => {handleOpen("buy")}}
              >
                 Buy
              </Button>
              <Button
              id="sell"
              variant="outlined"
              style={{
                width: "47%",
                height: 40,
                marginBottom: 10,
                marginLeft: 16,
                backgroundColor: "#EEBC1D"
              }}
              onClick={() => {handleOpen("sell")}}
              >
                 Sell
              </Button>
        </div>
     {transaction === "buy" ? 
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
         <Box>
          <div className={classes.paper}>
          <Box>
            <Box style={{      padding: 24,
                                paddingTop: 0,
                                //display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                gap: 20,
                                fontSize: 8,}}>
            <Typography variant="subtitle1">From Dollars</Typography>
            <br/>
            <TextField 
            label=""
            placeholder=""
            defaultValue={dollars}
            type="number"
            className={classes.textField}
            style={{backgroundColor: "white", position: "relative"}}
            onChange={renderCoinQuantity}
            />
            <Typography variant="subtitle1">{dollars}</Typography>
            </Box>
            <Box style={{      padding: 24,
                                paddingTop: 0,
                                //display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                gap: 20,
                                fontSize: 8,}}>
            <Typography variant="subtitle1" style={{ align: "center"}}>Buy price $ {buyPrice} </Typography>
            </Box>
            <Box style={{      padding: 24,
                                paddingTop: 0,
                                //display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                gap: 20,
                                fontSize: 8,}}>
            <Typography variant="subtitle1">To {coin?.name}</Typography>
            <br/>
            <Typography variant="subtitle1"> {coinQuantity}</Typography>
            </Box>
            </Box>
            <Box style={{      padding: 24,
                                paddingTop: 0,
                                //display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                gap: 20,
                                fontSize: 20,}}>
            <Button
            variant="contained"
             size="large"
             style={{ backgroundColor: "#EEBC1D", alignContent: "center", alignItems: "center" }}
             onClick={handleBuy}
             >Buy {coin?.name}</Button>
             </Box>
          </div>
          </Box>
        </Fade>
      </Modal> 
      : 
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
             <Box>
              <div className={classes.paper}>
              <Box>
                <Box style={{      padding: 24,
                                    paddingTop: 0,
                                    //display: "flex",
                                    flexDirection: "column",
                                    textAlign: "center",
                                    gap: 20,
                                    fontSize: 8,}}>
                <Typography variant="subtitle1">From {coin.name}</Typography>
                <br/>
                <TextField 
                label=""
                placeholder=""
                defaultValue={coinQuantity}
                type="number"
                className={classes.textField}
                style={{backgroundColor: "white", position: "relative"}}
                onChange={renderDollarQuantity}
                />
                <Typography variant="subtitle1">{coinQuantity}</Typography>
                </Box>
                <Box style={{      padding: 24,
                                    paddingTop: 0,
                                    //display: "flex",
                                    flexDirection: "column",
                                    textAlign: "center",
                                    gap: 20,
                                    fontSize: 8,}}>
                <Typography variant="subtitle1" style={{ align: "center"}}>Sell price $ {sellPrice} </Typography>
                </Box>
                <Box style={{      padding: 24,
                                    paddingTop: 0,
                                    //display: "flex",
                                    flexDirection: "column",
                                    textAlign: "center",
                                    gap: 20,
                                    fontSize: 8,}}>
                <Typography variant="subtitle1">To Dollars</Typography>
                <br/>
                <Typography variant="subtitle1">{dollarQuantity}</Typography>
                </Box>
                </Box>
                <Box style={{      padding: 24,
                                    paddingTop: 0,
                                    //display: "flex",
                                    flexDirection: "column",
                                    textAlign: "center",
                                    gap: 20,
                                    fontSize: 20,}}>
                <Button
                variant="contained"
                 size="large"
                 style={{ backgroundColor: "#EEBC1D", alignContent: "center", alignItems: "center" }}
                 onClick={handleBuy}
                 >Sell {coin?.name}</Button>
                 </Box>
              </div>
              </Box>
            </Fade>
          </Modal>
      }
    </div>
  );
}

