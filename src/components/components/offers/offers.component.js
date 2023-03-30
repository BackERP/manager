import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm, Image, message } from 'antd';
import OfferService from '../../../services/offer.service';
import OrderService from '../../../services/order.service';
import PaymentService from '../../../services/payment.service';

import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import OfferOrderForm from './offer-order.form';
import {FaRegEdit, FaRegTrashAlt, FaPlus, FaShoppingCart} from "react-icons/fa";


const FormItem = Form.Item;





export default class Offers extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    this.state = {
      columns: [{ title: 'Asset',  key: 'asset',
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
                { title: 'Price', dataIndex: 'price', key: 'price'},
                { title: 'Quantity',  key: 'quantity',
                  render: (_, record) =>record.quantity + '/' + record.offer_quantity,
                },
                { title: 'Sum',  key: 'sum',
                  render: (_, record) =>record.current_sum + '/' + record.offer_sum,
                },
                { title: 'Price physically', dataIndex: 'physic_price', key: 'physic_price'},
                { title: 'Quantity physically',  key: 'physic_quantity',
                  render: (_, record) =>record.physic_quantity + '/' + record.offer_physic_quantity,
                },
                { title: 'Sum physically',  key: 'physic_sum',
                  render: (_, record) =>record.current_physic_sum + '/' + record.offer_physic_sum,
                },
                {title: 'Action',
                 key: 'operation',
                 render: (_, record) =>{
                            return (
 
                               <Space size="middle">
                                  <FaShoppingCart onClick={(e)=>{this.onCreateOrder(record)}} title="Buy"/>
                               </Space>
                            )
                         },
                 },
               ],
      offers:[],
      formShow: false, 
      delete_id: 0,
      confirmShow: false,
      data: null,
      formOrderShow: false,
      orderParams: null,

      rights: {
                 deleteItem: deleteItem, 
                 addNewItem: addNewItem 
              }



    };

    this.onCreateOrder = this.onCreateOrder.bind(this);
    this.onOrderClose = this.onOrderClose.bind(this);
    this.onOrderSave = this.onOrderSave.bind(this);


  }
  onOrderClose()
  {
     this.setState({formOrderShow: false});
  }

  async createOrder(obj)
  {
//     await OrderService.orderItem(obj);
     await PaymentService.paid(obj);

     this.refreshData();

     message.success("Asset purchased");

  }
  onCreateOrder(document)
  {
     this.setState({formOrderShow: true,
        orderParams: { document: document}
     });
  }
  onOrderSave(formState)
  {
      this.createOrder({ source_registr: formState.source_registr, 
                          email: formState.email, 
                          quantity: formState.quantity, 
                      });
     //assetResource, price, quantity, is_physic, price_physic
     this.setState({formOrderShow: false});
  }



  async refreshData(){
    const offers = await OfferService.getList();
    if(offers === undefined)
    {
       this.setState({
          offers: [],
       });
       return;
    }
    this.setState({
       offers: offers,
     });
  }




  componentDidMount() {
    this.refreshData();
  }

  render() {
    const {columns,offers} = this.state;
    return (
      <div>
      <Form
           layout="vertical"
      >
     <Table
       columns={columns}
       dataSource={offers}
       rowKey={record => record.uuid}
     />
     </Form>
     <OfferOrderForm show={this.state.formOrderShow} handleClose = {this.onOrderClose} handleSave={this.onOrderSave} data={this.state.orderParams}/>

     </div>


    );
  }
}
