import React, {useContext} from "react";
//import {CartContext} from "../context/CartContext";
import {UserContext} from "../context/UserContext";
import { FaShoppingCart} from "react-icons/fa";

function Header(props) {

    //const {cartItems} = useContext(CartContext);
    const {cartItems} = useContext(UserContext);
    const totalCount = cartItems.reduce((preVal, currVal) => {
        return preVal + currVal.count
    }, 0)

    return (
        
            <header>
              <nav>
                <h1>Online Shop</h1>
                <div className="cart">
                <FaShoppingCart size="24" />
                  <span className="cart_count" > 0 </span>
                  {totalCount > 0 && <span className="cart_count" onClick={props.showCart}> {totalCount}</span>}
                </div>
              </nav>
            </header>
        
    )
}

export default Header;