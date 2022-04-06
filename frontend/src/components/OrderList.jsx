import axios from "axios";
import React, {useEffect, useState} from "react";

function OrderList() {

    const [orders, setOrders] = useState([]);

    useEffect( () => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}order/all`);
                setOrders(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchOrders();
    }, []);

    return (
        <div> 
            {
                orders.map( (order) => {
                    return order._id;
                })
            }
        </div>
    );

}

export default OrderList;