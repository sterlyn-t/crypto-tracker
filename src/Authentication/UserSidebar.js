import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { CryptoState } from '../CryptoContext';
import { Avatar } from '@material-ui/core';
import { signOut } from '@firebase/auth';
import { auth } from '../firebase';
import { numberWithCommas } from '../components/Banner/Carousel';
import { AiFillDelete }  from 'react-icons/ai';
import { doc, getDoc, setDoc, onSnapshot } from '@firebase/firestore';
import { db } from '../firebase'; 
import { IoAddSharp } from 'react-icons/io5';
import { IoMdAddCircle } from "react-icons/io";
import { TextField, InputAdornment } from '@material-ui/core';
import { BsCheck } from 'react-icons/bs';

const useStyles = makeStyles({
    container: {
        width: 350,
        padding: 25,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace"
    },
    profile: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        height: "92%"
    },
    picture: {
        width: 200,
        height: 200,
        cursor: "pointer",
        backgroundColor: "#EEBC1D",
        objectFit: "contain"
    },
    logout: {
        height: "8%",
        width: "100%",
        backgroundColor: "#EEBC1D",
        marginTop: 20
    },
    watchList: {
        flex: 1,
        width: "100%",
        backgroundColor: "grey",
        borderRadius: 10,
        padding: 15,
        paddingTop: 10,
        display: "flex",
        flexDirection: "column",
        alginItems: "center",
        gap: 12,
        overflowY: "scroll"
    },
    coin: {
      padding: 10,
      borderRadius: 5,
      color: "black",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#EEBC1D",
      boxShadow: "0 0 3px black"
    },
    availableFunds: {
      flex: 1,
      width: "100%",
      backgroundColor: "grey",
      borderRadius: 10,
      padding: 15,
      paddingTop: 10,
      display: "flex",
      flexDirection: "column",
      alginItems: "center",
      gap: 12,
  },
});


export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const { user, setAlert, watchlist, coins, symbol } = CryptoState();

  const [addedFunds, setAddedFunds] = useState(0);
  const [toggleFundsInput, setToggleFundsInput] = useState(false);
  const toggleInput = (event) => {
    setToggleFundsInput(true);
    setAddedFunds(event.target.value);
  }

  const [initialAccountBalance, setInitialAccountBalance] = useState(0);

  useEffect(() => {
    if (user) {
        const userRef = doc(db, "userInfo", user.uid);
        //Checking if database is updated 
        var unsubscribe = onSnapshot(userRef, user => {
            if(user.exists()) {
                setInitialAccountBalance(user.data().accountBalance);
            } else {
                console.log("No items in the watchlist");
            }
        });
        return () => {
            unsubscribe();
        };
    };
}, [user]);

  const addFunds = async(event) => {
   const userRef = doc(db, "userInfo", user.uid);
   const newAccountBalance = parseFloat(addedFunds) + parseFloat(initialAccountBalance);
    try {
      await setDoc(userRef,
           {accountBalance: newAccountBalance
            },
         { merge: "true" }
        );
        setTimeout(() => {
          setToggleFundsInput(false);
        }, 1000);
    } catch(error) {

    }
  }

  const removeFromWatchlist = async(coin) => {
    const coinRef = doc(db,"watchlist", user.uid);

    try{
      await setDoc(coinRef, 
        {
          coins: watchlist.filter((watch) => watch !== coin?.id)
        },
        { merge: "true" }
        );
        setAlert({
          open: true,
          message: `${coin.name} removed from the watchlist !`,
          type: "success"
        })
    } catch(error) {
        setAlert({
          open: true,
          message: error.message,
          type: "error"
        });
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logOut = () => {
    signOut(auth);
    setAlert({
        open: true,
        type: "success",
        message: "Logout Successful !"
    });
    toggleDrawer();
};
  
  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
            <Avatar 
            onClick={toggleDrawer(anchor, true)}
            style={{
                height: 38,
                width: 38,
                cursor: "pointer",
                backgroundColor: "#EEBC1D"
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
            />
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            <div className={classes.container}>
                <div className={classes.profile}>
                <Avatar 
                className={classes.picture}
                src={user.photoURL}
                alt={user.displayName || user.email}
                />
                <span
                style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word"
                }}
                >
                    {user.displayName || user.email}
                </span>
                <div className={classes.availableFunds}>
                <span
                style={{
                  fontSize: 15, textShadow: "0 0 5px black"
                }}
                >
                    Available Funds
                </span>
                <div className={classes.coin}>
                                <span>Dollars</span>
                                {toggleFundsInput === false ? 
                                <span style={{ display: "flex", gap: 8}}>
                                  {symbol}
                                  {numberWithCommas(parseFloat(initialAccountBalance).toFixed(2))}
                                  <IoMdAddCircle 
                                   style={{ cursor: "pointer"}}
                                   fontSize = "16"
                                   onClick={(e) => toggleInput(e)}
                                   />
                                </span> : 
                                  <span style={{ display: "flex", gap: 8, fontSize: 15}}>
                                  {/* {symbol} */}
                                  {/* {addedFunds} */}
                                   <TextField 
                                    display= "inline-block"
                                    placeholder="Enter Amount"
                                    style={{width: "50%", position: 'relative', left: 70, fontSize: 15, onFocus: {color: "black"}}}
                                    onChange={(e) => toggleInput(e)}
                                    InputProps={{
                                      endAdornment:(
                                      <InputAdornment position= "end">
                                      <BsCheck 
                                      style={{ cursor: "pointer"}}
                                      fontSize = "24"
                                      onClick={(e) => addFunds(e)}
                                      />
                                      </InputAdornment> )
                                    }}
                                   />
                                </span>
                                }
                              </div>
                </div>
                <div className={classes.watchList}> 
                        <span style={{ fontSize: 15, textShadow: "0 0 5px black"}}>Portfolio</span>
                          {coins.map(coin => {
                            if(watchlist.includes(coin.id))
                            return (
                              <div className={classes.coin}>
                                <span>{coin.name}</span>
                                <span style={{ display: "flex", gap: 8}}>
                                  {symbol}
                                  {numberWithCommas(coin.current_price.toFixed(2))}
                                  <AiFillDelete 
                                   style={{ cursor: "pointer"}}
                                   fontSize = "16"
                                   onClick={() => removeFromWatchlist(coin)}
                                   />
                                </span>
                              </div>
                            )
                          })}
                    </div>
                    <div className={classes.watchList}> 
                        <span style={{ fontSize: 15, textShadow: "0 0 5px black"}}>Watchlist</span>
                          {coins.map(coin => {
                            if(watchlist.includes(coin.id))
                            return (
                              <div className={classes.coin}>
                                <span>{coin.name}</span>
                                <span style={{ display: "flex", gap: 8}}>
                                  {symbol}
                                  {numberWithCommas(coin.current_price.toFixed(2))}
                                  <AiFillDelete 
                                   style={{ cursor: "pointer"}}
                                   fontSize = "16"
                                   onClick={() => removeFromWatchlist(coin)}
                                   />
                                </span>
                              </div>
                            )
                          })}
                    </div>
                </div>
                <Button
                 variant="contained"
                 className={classes.logout}
                 onClick={logOut}
                >
                    Log Out
                </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
