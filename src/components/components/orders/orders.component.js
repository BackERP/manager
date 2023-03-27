import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm, Image } from 'antd';
import BuyRegistrService from '../../../services/buy-registr.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
//import OrderForm from './order.form';
import {FaRegEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";


const FormItem = Form.Item;





export default class Orders extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    this.state = {

      columns: [{ title: 'Client',  key: 'client',
                 render: (_, record) =>record.reg_document_data.email,
                },
                { title: 'Asset',  key: 'asset',
                 render: (_, record) =>record.asset_data.name,
                },
                { title: 'Image',  key: 'image',
                  render: (_, record)=>{
                     return (
                          <>
                             { record.link_address !== ""?(<Image width={70} src={record.link_address}/>):''}
                          </>
                  )}
                },
                { title: 'Number',  key: 'number',
                 render: (_, record) =>record.reg_document_data.number,
                },
                { title: 'Price', dataIndex: 'price', key: 'price'},
                { title: 'Quantity',  dataIndex: 'quantity', key: 'quantity'},
                { title: 'Sum',  dataIndex: 'sum', key: 'sum'},
               ],
      registrs:[],
      formShow: false, 
      delete_id: 0,
      confirmShow: false,
      data: null,
      rights: {
                 deleteItem: deleteItem, 
                 addNewItem: addNewItem 
              }



    };



  }
  async refreshData(){
    const registrs = await BuyRegistrService.getList();
    this.setState({
      registrs: (registrs !== undefined)?registrs:[],
    });
  }




  componentDidMount() {
    this.refreshData();
  }

  render() {
    const {columns,registrs} = this.state;
    return (
      <div>
     <Table
       columns={columns}
       dataSource={registrs}
       rowKey={record => record.uuid}
     />
     </div>


    );
  }
}
