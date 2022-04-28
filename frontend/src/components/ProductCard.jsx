import React from "react";
import { Card } from "primereact/card";
import {Button} from "primereact/button"; 
//import { FaShoppingCart} from "react-icons/fa";


function ProductCard(props) {

    
    const product = props.product;

    const header = (
        <img alt="Card" src={product.image} width="42" height="200" style={{float:'left'}} />
    );

    const footer = (
        
        <Button label="Add to Cart" icon="pi pi-check" className="p-button-raised p-button-secondary p-button-sm" onClick={() => props.addToCart(product)}/>
        
    );

    return (
        <div>
            <Card title={product.name} subTitle={"$"+product.price} style={{ width: '15em' }} header={header} footer={footer}>
                <p className="m-0" style={{lineHeight: '1.5'}}>
                    {/* <img alt="Card" src={product.image} width="42" height="42" style={{float:'right'}} /> */}
                    {/* <FaShoppingCart size="24" style={{float:'right'}} onClick={props.addToCart}/> */}
                    {product.description}               
                </p>
                <p className="m-0" style={{lineHeight: '1.5'}}>Available Inventory: {product.inventory}</p>
            </Card>

        </div>
    )
}

export default ProductCard;