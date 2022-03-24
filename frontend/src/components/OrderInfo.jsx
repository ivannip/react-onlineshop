import React from "react";

import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";

function OrderInfo(props) {

    const order = props.order;

    return (
        <div>
            <div className="grid p-fluid">
                        <div className="col-12 md:col-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText name="customer" value={order.customer} onChange={props.updateOrder} placeholder="Customer Name" />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                <i className="pi pi-phone"></i>
                                </span>
                                <InputText name="contact" value={order.contact} onChange={props.updateOrder}placeholder="Contact Phone" />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="p-inputgroup">
                                <Calendar name="deleveryDate" value={order.deliveryDate} onChange={props.updateOrder}  showIcon placeholder="Delivery Date"/>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="p-inputgroup">
                                <InputText name="deliveryAddress" value={order.deliveryAddress} onChange={props.updateOrder} placeholder="Delivery Address" />
                            </div>
                        </div>

                        
            </div>
        </div>
    )
};

export default OrderInfo;