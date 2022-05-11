import React, {useState} from "react";
import {InputNumber} from "primereact/inputnumber";

function CartItem(props) {
    const cartItem = props.cartItem;
    const [quantity] = useState(props.quantity);
    
    
    const changeQuantity = (e) => {      
        props.handleCartItemChange(cartItem, e.value);
    }
    
    return (
        <div className="cartItem">
            <div style={{width: '150px'}}>
                <h1>{cartItem.name}  ${cartItem.price} </h1>
                <p>{cartItem.description}</p>
            </div>
            <div>
                <label htmlFor="quantity" style={{display: 'block'}}>Quantity</label>
                <InputNumber name="quantity" value={quantity} onChange={ changeQuantity } showButtons style={{width: '20'}} min={0}/>
            </div>            
        </div>
    )
}

export default CartItem;