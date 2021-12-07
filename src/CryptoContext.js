import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CoinList } from './config/api';
import { onAuthStateChanged } from '@firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from '@firebase/firestore';
const Crypto = createContext();

const CryptoContext = ({children}) => {

    const [currency, setCurrency] = useState("CAD");
    const [symbol, setSymbol] = useState("$");
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        type: "success"
    });
    const [watchlist, setWatchlist] = useState([]);
    const [portfolio, setPortfolio] = useState([]);

    const fetchCoins = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));
        console.log(data);
    
        setCoins(data);
        setLoading(false);
      };

    useEffect(() => {
        if(currency === "CAD") setSymbol("$");
        else setSymbol("$");
    }, [currency]);

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) setUser(user);
            else setUser(null);

            //console.log(user);
        })
    }, [])

    useEffect(() => {
        if (user) {
            const coinRef = doc(db, "watchlist", user.uid);
            //Checking if database is updated 
            var unsubscribe = onSnapshot(coinRef, coin => {
                if(coin.exists()) {
                    setWatchlist(coin.data().coins);
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
        <Crypto.Provider value={{currency, symbol, setCurrency, coins, loading, fetchCoins, alert, setAlert, user, watchlist, portfolio }}> 
            {children}
        </Crypto.Provider>
    );
};

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto);
}
