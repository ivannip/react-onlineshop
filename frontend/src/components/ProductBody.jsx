import React, {useState, useEffect, useRef, useContext} from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import ProductCard from "./ProductCard";

import {CartContext} from "../context/CartContext";

function ProductBody() {

    const [products, setProducts] = useState([]);
    const {addToCart} = useContext(CartContext);
    
    const toast = useRef(null);
    
    const showMsg = (msg) => {
        toast.current.show({severity:'success', summary: 'Success', detail:msg, life: 3000});
    }

    const insertItemToCart = (product) => {
        showMsg("Add Item to Cart");
        addToCart(product);
    }    

    useEffect( () => {

        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}product/all`);
                setProducts(res.data);
            } catch (err) {

            }
        }

        fetchProduct();
    }, [])

    return (
        <div className="product-grid">
            <Toast ref={toast} />
            {
                products.map( (product) => {
                   return <ProductCard key={product._id} product={product} addToCart={insertItemToCart} />
                })
            }

            
        </div>
    )
}

export default ProductBody;