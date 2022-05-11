import React, {useState, useContext, useEffect} from "react";
import axios from "axios";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {CartContext} from "../context/CartContext";
import {UserContext} from "../context/UserContext";

import CartItem from "./CartItem";
import OrderInfo from "./OrderInfo";

function CartDialog(props) {

 
    const emptyOrder = {
        customer: "",
        contact: "",
        createDate: new Date(),
        deliveryDate: new Date(),
        deliveryAddress: "",
        purchasedItems: []
    }
    //const {cartItems, emptyCart, updateCart} = useContext(CartContext);
    const {userContext, setUserContext, cartItems, emptyCart, updateCart} = useContext(UserContext); 
    const [order, setOrder] = useState(emptyOrder);

    const updateOrder = (e) => {
        const {name, value} = e.target;
        setOrder( (previous) => {
            return {...previous, [name]: value};
        })
    }


    // this processOrder function is copied from processor.js
    async function processOrder(messagePayload) {
        try {
             
             const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}product/amends`, messagePayload);
             //if no purchased records are processed, refund the order
             if (res.data.length === 0) {
                console.log("call refund");
                await axios.post(`${process.env.REACT_APP_API_ENDPOINT}order/status/refund`, messagePayload);
             } else {
                console.log("call confirm");
                await axios.post(`${process.env.REACT_APP_API_ENDPOINT}order/status/confirm`, messagePayload);
             }
             
        } catch (err) {
            console.log(err);
        }
    }

    const confirmOrder = async() => {
        try {
            const transactions = [];
            cartItems.forEach( (item) => {
                const {product, count} = item;
                transactions.push({product: product._id, quantity: count, purchaseDate: new Date(), createDate: new Date()})
            })
            order.purchasedItems = transactions;
            
            const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}order/new`, order);
            
            // using rabbitmq to process the order
            //await axios.post(`${process.env.REACT_APP_API_ENDPOINT}msg/sendOrder`, res.data);

            //direct process the database change without MQ, use this when deploy to Heroku
            await processOrder(res.data);
            

            
        } catch (err) {
            console.log(err)
        }
        setOrder(emptyOrder);
        emptyCart();
        props.hideCart()
    }

    useEffect( () => {
        let userInfo = {name:"", mobile:"", address:""};
        if (userContext.details !== undefined && userContext.details.userInfo !== undefined) {
            userInfo = userContext.details.userInfo;
        }        
        setOrder( (prev) => {
                return {...prev, customer: userInfo.name, contact: userInfo.mobile, address: userInfo.address};
        })
        
    }, [])

    const CartFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.hideCart} />
            <Button label="Checkout" icon="pi pi-check" className="p-button-text" onClick={confirmOrder}/>
        </div>
    );

    return (
        <Dialog visible={props.shwCart} style={{ width: '640px'}} header="Shopping Cart"  
        footer={CartFooter} modal onHide={props.hideCart}>
            <div className="cart-grid">
            {
                cartItems.map( (item) => {
                    const {product, count} = item;
                    return <CartItem cartItem={product} quantity={count} key={product._id} handleCartItemChange={updateCart}/>
             })
            }
            </div>
            <OrderInfo order={order} updateOrder={updateOrder}/>
        </Dialog>
    )
}

export default CartDialog;