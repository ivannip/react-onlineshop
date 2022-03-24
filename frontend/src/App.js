import React, {useState} from "react";
import logo from './logo.svg';
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                               //icons
import {TabView, TabPanel} from "primereact/tabview";
import Header from "./components/Header";
import ProductBody from "./components/ProductBody";
import CartDialog from "./components/CartDialog";

function App() {

  const [shwCart, setShwCart] = useState(false);
  
  function showCart() {
    setShwCart(true);
  }

  function hideCart() {
      setShwCart(false);
  }

  return (
    <div>
      <Header showCart={showCart} hideCart={hideCart}/>
      <TabView>
        <TabPanel header="Products">
          <ProductBody />
          <CartDialog shwCart={shwCart} hideCart={hideCart} />
        </TabPanel>
        <TabPanel header="Delivery">
          Delivery
        </TabPanel>
      </TabView>
    </div>
  );
}

export default App;
