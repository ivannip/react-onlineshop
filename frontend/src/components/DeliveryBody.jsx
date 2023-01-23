import axios from "axios";
import React, {useState, useEffect} from "react";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Splitter, SplitterPanel } from 'primereact/splitter';
import {Button} from "primereact/button";


function DeliveryBody() {

    const [orders, setOrders] = useState([]);
    const [date, setDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date());
    const [expandedRows, setExpandedRows] = useState(null);

    const formatDate = (value) => {
        if (value !== undefined) {
            const _date = new Date(Date.parse(value));
            return _date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }); 
        } else {
            return "";
        }
       
    }

    const createDateBodyTemplate = (rowData) => {
        return formatDate(rowData.createDate);
    }

    const deliveryDateBodyTemplate = (rowData) => {
        return formatDate(rowData.deliveryDate);
    }

    const totalValueBodyTemplate = (rowData) => {
        return rowData.quantity * rowData.product.price;
    }

    const rowExpansionTemplate = (data) => {
        return (<div>
            <DataTable value={data.purchasedItems} responsiveLayout="scroll">
                <Column field="product.name" header="Name" />
                <Column field="product.price" header="Unit Price" />
                <Column field="quantity" header="Purchased Quantity" />
                <Column header="Total Value" body={totalValueBodyTemplate}/>
            </DataTable>
        </div>);
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

    const dateTemplate = (date) => {
        for (const order of orders) {
            const deliveryDay = new Date(order.deliveryDate).getDate();
            const deliveryMonth = new Date(order.deliveryDate).getMonth();
            if (date.day === deliveryDay && date.month === deliveryMonth) {
                return (
                    <strong style={{ backgroundColor: "#FFFF00", textDecoration: "underline" }}>{date.day}</strong>
                )
            }
        }       
        return date.day;
    }

    
    //load the delivery order of current month
    useEffect( () => {

        const fetch = async () => {
            const month = new Date(viewDate).getUTCMonth() + 1;
            const year = new Date(viewDate).getUTCFullYear();
            console.log(`${process.env.REACT_APP_API_ENDPOINT}order/confirm/${month}/${year}`);
            const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}order/confirm/${month}/${year}`);
            setOrders(res.data.orders);
        }

        fetch();

    }, [viewDate])


    return (
        <div>
            <Splitter style={{height: '500px'}}>
                <SplitterPanel>
                <Calendar value={date} onChange={(e) => setDate(e.value)} inline showWeek dateTemplate={dateTemplate} 
                viewDate={viewDate} onViewDateChange={ (e) =>  setViewDate(e.value)}/>
                </SplitterPanel>
                <SplitterPanel>
                    <DataTable value={orders} datakey="id" paginator responsiveLayout="scroll" stripedRows
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                        paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}
                        expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        sortField="createDate" sortOrder={-1}>
                        <Column expander style={{ width: '3em' }} />
                        <Column field="customer" header="Customer" />
                        <Column field="contact" header="Contact" />
                        <Column field="createDate" header="Order Date" body={createDateBodyTemplate} sortable/>
                        <Column field="deliveryDate" header="Delivery Date" body={deliveryDateBodyTemplate} sortable/>
                        <Column field="deliverAddress" header="Address" />
                        <Column field="status" header="Status" sortable/>
                    </DataTable>
                </SplitterPanel>
            </Splitter>
        </div>
    )
}

export default DeliveryBody;
