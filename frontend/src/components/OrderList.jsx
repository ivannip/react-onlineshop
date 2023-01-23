import axios from "axios";
import React, {useEffect, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";

function OrderList() {

    const [orders, setOrders] = useState([]);
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

    useEffect( () => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}order/all`);
                setOrders(res.data.orders);
            } catch (err) {
                console.log(err);
            }
        }
        fetchOrders();
    }, []);

    return (
        <div> 
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
            
        </div>
    );

}

export default OrderList;