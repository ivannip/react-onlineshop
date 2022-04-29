import React, {useState, useContext, useCallback, useEffect} from "react";
import axios from "axios";
//import logo from './logo.svg';
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                               //icons
import {TabView, TabPanel} from "primereact/tabview";
import {Button} from "primereact/button";
import Header from "./components/Header";
import ProductBody from "./components/ProductBody";
import DeliveryBody from "./components/DeliveryBody";
import CartDialog from "./components/CartDialog";
import Login from "./components/Login";
import Register from "./components/Register";
import OrderList from "./components/OrderList";
import {UserContext} from "./context/UserContext";

function App() {

  const [shwCart, setShwCart] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);
  
  const showCart = () => {
    setShwCart(true);
  }

  const hideCart = () => {
      setShwCart(false);
  }

  /**
   * Sync logout across tabs
   */
  const syncLogout = useCallback((event) => {
    if (event.key === "logout") {
      // If using react-router-dom, you may call history.push("/")
      window.location.reload();
    }
  }, []);

  const verifyUser = useCallback( async() => {
    
    try {
        let res = await axios.post(process.env.REACT_APP_API_ENDPOINT + "user/refreshToken")    
        const data = res.data;
        setUserContext((prev) => {
          return { ...prev, token: data.token, details: data };
        });
    
      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000);
    } catch (err) {
      console.log(err);
      setUserContext((prev) => {
        return { ...prev, token: null, details: undefined };
      });
    }
  }, [setUserContext]);
  
  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  
  useEffect(() => {
    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [syncLogout]);


  const logoutAction = async () => {
    try {
      await axios.get(process.env.REACT_APP_API_ENDPOINT + "user/logout", { headers: {"Authorization" : `Bearer ${userContext.token}`} });
      setUserContext( (prev) => {
        return {...prev, details: undefined, token: null}
      });
      window.localStorage.setItem("logout", Date.now());
    } catch (err) {
      console.log(err);
    }
  };

  return userContext.token === null ? (
    <div>          
      <TabView>
        <TabPanel header="Login">
          <Login />
        </TabPanel>
        <TabPanel header="User Registration">
          <Register />
        </TabPanel>
      </TabView>
    </div>
  ):userContext.token?(
    <div>
      <Header showCart={showCart} hideCart={hideCart}/>
      <Button label="Logout" icon="pi pi-check" iconPos="right" onClick={logoutAction} />
      <TabView>
        <TabPanel header="Products">
          <ProductBody />
          <CartDialog shwCart={shwCart} hideCart={hideCart} />
        </TabPanel>
        <TabPanel header="List of Order">
            <OrderList />
        </TabPanel>
        <TabPanel header="Delivery">
            <DeliveryBody />
        </TabPanel>
      </TabView>
    </div>
  ):(
    <div>
    Loading
    </div>
  );
}

export default App;
