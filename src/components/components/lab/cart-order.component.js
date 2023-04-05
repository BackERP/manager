import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm } from 'antd';
import AssetService from '../../../services/asset.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import {FaRegEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";


const FormItem = Form.Item;





export default class CartOrder extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

  }




  render() {
    return (
     <div>
       <h5>Crat to order</h5>
     </div>


    );
  }
}
