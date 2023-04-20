import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm, Input, Col, Row, Layout } from 'antd';
import MarketService from '../../../services/market.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import {FaRegEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";


const FormItem = Form.Item;


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


export default class HeadMarket extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    this.state = {
      markets: [],
      markets_data: [],

      market: undefined,
      language: undefined,
      region: undefined,
      currency: undefined,
      language_name: undefined,
      region_name: undefined,
      currency_name: undefined,


      rights: {
                 deleteItem: deleteItem, 
                 addNewItem: addNewItem 
              }



    };

    this.onChangeMarket = this.onChangeMarket.bind(this);

  }
  onChangeMarket(item){       
//        console.log(item);
        const market = this.state.markets_data.find((o)=>o.uuid == item.value);

        this.setState({
          market:  {value:item.value, label:item.lable},
          language: market.locale_data.language_data,
          region: market.locale_data.region_data,
          currency: market.currency_data,
          language_name: market.locale_data.language_data.name,
          region_name: market.locale_data.region_data.name,
          currency_name: market.currency_data.name,
        });
        this.props.onChangeMarket(item.value);
  };

  async refreshMarket(){
    const response = await MarketService.getList();
    if(response === undefined)
    {
       this.setState({
          markets: [],
          markets_data: [],
          language: undefined,
          region: undefined,
          currency: undefined,

       });
       this.props.onChangeMarket();
       return;
    }
    const markets = response.map((obj)=>{return {value:obj.uuid, label:obj.name}});
    
    const language = response[0].locale_data.language_data;
    const region =   response[0].locale_data.region_data;
    const currency = response[0].currency_data;


    this.setState({
          markets: markets,
          market:  markets[0],
          markets_data:response,
          language: language,
          region: region,
          currency: currency,
          language_name: language.name,
          region_name: region.name,
          currency_name: currency.name,

     });
     this.props.onChangeMarket(markets[0].value);

  }
  componentDidMount() {
    this.refreshMarket();
  }

  render() {
    const {markets, market} = this.state;
    return (
      <Row>
        <Col span={5}>
          <span>
          Market:
          <Space/>          
          <Space/>
          <Select
            placeholder="select market"
            value={market}
            labelInValue
            style={{ width: 200 }}
            onChange={this.onChangeMarket}
            options={markets}
          />
          </span>
        </Col>
        <Col span={5}>

          <span>
          Region:
          <Space/>          
          <Space/>
              <Input type="text" 
                 value={this.state.region_name}
                 disabled={true}
                 style={{width:200}}
              />
          </span>
        </Col>
        <Col span={5}>

          <Space/>
          <span>
          Language:
          <Space/>          
          <Space/>
          <Input type="text" 
                 value={this.state.language_name}
                 disabled={true}
                 style={{width:150}}
          />
          </span>

        </Col>
        <Col span={5}>
          <span>
          Currency:<Space/>
          <Space/>          
          <Space/>
          <Input type="text"              
                 name="currency"
                 value={this.state.currency_name}
                 disabled={true}
                 style={{width:200}}
          />
          </span>
        </Col>

     </Row>
    );
  }
}
