import React, { Component } from "react";
import { Form, Input, Checkbox } from 'antd';

import MarketService from '../../../services/market.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const { TextArea } = Input;
const FormItem = Form.Item;






export default class ViewField extends Component {

  constructor(props) {
    
    super(props);

    this.state = {
      market: undefined,
      market_object: undefined,
    };

    
  }

  render() {
    const {field} = this.props;
//    const {market, type_market_object, market_object} = this.state;
    return (
       <FormItem
            label={field.name}
       >
{
        field.type=='string' && (
           <Input type="text" value={this.props.value} onChange={(e)=>this.props.onChange(field.variable,e.target.value)}/>
        )
}
{
        field.type=='boolean' && (
            <Checkbox checked={this.props.value} onChange={(e)=>this.props.onChange(field.variable,e.target.checked)}/>
        )
}
{
        field.type=='text' && (                                                                       
            <TextArea rows="3" value={this.props.value} onChange={(e)=>this.props.onChange(field.variable,e.target.value)}/>
        )
}
{
        field.type=='integer' && (
           <Input type="number" value={this.props.value} onChange={(e)=>this.props.onChange(field.variable,e.target.value)}/>
        )
}
{
        field.type=='html' && (
           <ReactQuill theme="snow" value={this.props.value} onChange={(value)=>this.props.onChange(field.variable, value)}
           />
        )
}



       </FormItem>
    );
  }
}
