import { AppBar, Container, createTheme, makeStyles, MenuItem, Select, Toolbar, Typography, ThemeProvider } from '@material-ui/core'
import React from 'react'
//import { useNavigate } from 'react-router-dom';
import { useHistory } from 'react-router';
import AuthModal from '../Authentication/AuthModal';
import { CryptoState } from '../CryptoContext';
import UserSidebar from '../Authentication/UserSidebar';

const useStyles = makeStyles(() => ({
    title: {
        flex: 1,
        color: "gold",
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
}));

const Header = () => {

    const classes = useStyles();
    //const navigate = useNavigate();
    const history = useHistory();
    const { currency, setCurrency, user } = CryptoState();

    const darkTheme = createTheme({
        palette: {
            primary:{
                main: '#fff',
            } 
        },
        type: 'dark',
    });

    return (
        <ThemeProvider theme={darkTheme}>
        <AppBar color='transparent' position='static'>
            <Container>
                <Toolbar>
                    <Typography className={classes.title} variant='h6' onClick={() => history.push(`/`) }>Crypto Tracker</Typography>
                    <Select variant='outlined'
                            style={{
                                width: 100,
                                height: 40,
                                marginRight: 15,
                            }}
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            >
                        <MenuItem value={'CAD'}>CAD</MenuItem>
                        <MenuItem value={'USD'}>USD</MenuItem>
                    </Select>
                    {user ? <UserSidebar /> : <AuthModal/>}
                </Toolbar>
            </Container>
        </AppBar>
        </ThemeProvider>
    )
}

export default Header
