import React, {useState, useEffect, useContext} from "react";

const CartContext = React.createContext();

const CartProvider = props => {
    
    const [cartItems, setCartItems] = useState([]);

    //insert new item or increment the count of item
    const addToCart = (newItem) => {
        let updatedCartItems = [];
        setCartItems( previousCartItems => {
            const index = previousCartItems.findIndex( item => {
                                                    const {product} = item;
                                                    const ida = product._id.valueOf()
                                                    const idb = newItem._id.valueOf();
                                                    return ida === idb})
            
            if (index === -1) {
                updatedCartItems = [...previousCartItems, {product: newItem, count: 1}]
            } else {
                updatedCartItems = [
                    ...previousCartItems.slice(0, index),
                    {product: previousCartItems[index].product, count: previousCartItems[index].count+1},
                    ...previousCartItems.slice(index+1)
                ];
            }
            return updatedCartItems;
        })
    }

    //update the count of items in the cart from Cart Dialog
    const updateCart = (amendedProduct, amendedCount) => {
        console.log("call updateCart");
        let updatedCartItems = [];
        setCartItems( (prev) => {
            const index = prev.findIndex( item => {
                const {product} = item;
                const ida = amendedProduct._id.valueOf()
                const idb = product._id.valueOf();
                return ida === idb});
            if (index === -1) {
                updatedCartItems = prev.push({product:amendedProduct, count: amendedCount});
            } else {                   
                updatedCartItems = prev.splice(index, 1, {product:amendedProduct, count: amendedCount});
            }
            return updatedCartItems;           
        })
    }

    //empty cart
    const emptyCart = () => {
        setCartItems([]);
    }

    //inital read context from storage
    useEffect( () => {       
        const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
        if (shoppingCart) {
            setCartItems(shoppingCart);
        }
        
        
    }, []);

    //update to storage
    useEffect( () => {
        localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
    }, [cartItems])


    return (
        <CartContext.Provider value={{cartItems, addToCart, updateCart, emptyCart}}>
            {props.children}           
        </CartContext.Provider>
    )
}

export {CartContext, CartProvider};