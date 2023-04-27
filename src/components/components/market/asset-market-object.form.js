import React, { Component } from "react";
import { Form, Input, Button, Space, Typography, message } from 'antd';

import MarketService from '../../../services/market.service';
import AuthService from "../../../services/auth.service";
import RepresentationService from "../../../services/representation.service";
import ViewAssetService from "../../../services/viewasset.service";
import AssetMarketService from "../../../services/assetmarket.service";
import OperationService from "../../../services/operation.service";



import ViewField from "../common/view.field";

import EventBus from "../../../common/EventBus";
const { Title } = Typography;
const FormItem = Form.Item;









export default class AssetMarketObjectForm extends Component {

  constructor(props) {
    
    super(props);

    this.state = {
      market: undefined,
      currency: undefined,
      asset: undefined,
      representation: {fields:[]},
      issue: 0,
      rest: 0,
      price: 0,
      price_original: 0,
      reserved: 0,
      add_reserve: 0,
      free_reserve: 0,
      rest_original: 0,
      income_original: 0,
    };

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onChangeIssue = this.onChangeIssue.bind(this);
    this.onIssue = this.onIssue.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeOriginalPrice = this.onChangeOriginalPrice.bind(this);
    this.onPrice = this.onPrice.bind(this);
    this.onChangeAddReserve = this.onChangeAddReserve.bind(this);
    this.onAddReserve = this.onAddReserve.bind(this);
    this.onChangeFreeReserve = this.onChangeFreeReserve.bind(this);
    this.onFreeReserve = this.onFreeReserve.bind(this);
    this.onChangeIncome  = this.onChangeIncome.bind(this);
    this.onIncome = this.onIncome.bind(this);


  }

  onChangeIncome(e)
  {
     this.setState({income_original: e.target.value});
  }


  onChangeAddReserve(e)
  {
     this.setState({add_reserve: e.target.value});
  }

  onChangeFreeReserve(e)
  {
     this.setState({free_reserve: e.target.value});
  }


  onChangePrice(e)
  {
     this.setState({price: e.target.value});
  }
  onChangeOriginalPrice(e)
  {
     this.setState({price_original: e.target.value});
  }

  onChangeIssue(e)
  {
     this.setState({issue: e.target.value});
  }


  async issueItem(data)
  {
     await OperationService.issue(data);
     await this.getAssetMarket(data.market, data.asset);
  }

  async incomeItem(data)
  {
     await OperationService.income(data);
     await this.getAssetMarket(data.market, data.asset);
  }


  async addReserveItem(data)
  {
     await OperationService.makeReserve(data);
     await this.getAssetMarket(data.market, data.asset);
  }

  async freeReserveItem(data)
  {
     await OperationService.freeReserve(data);
     await this.getAssetMarket(data.market, data.asset);
  }


  async priceItem(data)
  {
     await OperationService.makeOffer(data);
     await this.getAssetMarket(data.market, data.asset);
     message.success("Price is changed");

  }


  onIssue()
  {
     this.issueItem({market: this.props.market, asset: this.props.asset, price: 0, quantity: this.state.issue, currency: this.props.currency})
  }

  onIncome()
  {
     this.incomeItem({market: this.props.market, asset: this.props.asset, price: 0, quantity: this.state.income_original, currency:this.props.currency})
  }


  onAddReserve()
  {
     this.addReserveItem({market: this.props.market, asset: this.props.asset, quantity: this.state.add_reserve});
  }

  onFreeReserve()
  {
     this.freeReserveItem({market: this.props.market, asset:this.props.asset, quantity: this.state.free_reserve});
  }


  onPrice()
  {
     this.priceItem({market: this.props.market, asset:this.props.asset, price:this.state.price, price_original: this.state.price_original, currency:this.props.currency})
  }



  onSave()
  {
     const fields = this.state.representation.fields.map((item)=>{return {name: item.variable, value: item.value}});
     ViewAssetService.saveItem(this.state.market, this.state.asset, fields);

  }
  onChange(variable, value)
  {

    const representation = this.state.representation;
    for(let i in representation.fields)
      if(representation.fields[i].variable == variable)
      {
         representation.fields[i].value = value;
         this.setState({representation:representation});
         return;
      }
  }
  async getRepresentation()
  {
    const representation = await RepresentationService.getItem('Asset');
    if(representation === undefined)                             
      representation = {fields:[]};
    this.setState({representation:representation});
    await this.getView(this.props.market, this.props.asset);

  }

  async getView(market, asset)
  {
     let view = await ViewAssetService.getItem(market, asset);
     if(view == undefined)
       view = {};
    const representation = this.state.representation;
    for(let i in representation.fields)
       representation.fields[i].value = view[representation.fields[i].variable];
    this.setState({representation:representation});
    await this.getAssetMarket(market, asset)

  }

  async getAssetMarket(market, asset)
  {
     let assetmarket = await AssetMarketService.getItem(market, asset);
     const representation = this.state.representation;
     this.setState({ issue: assetmarket.issue,
                      rest: assetmarket.rest,
                      price: assetmarket.price,
                      price_original: assetmarket.price_original,
                      reserved: assetmarket.reserved,
                      rest_original: assetmarket.rest_original,
                      income_original: assetmarket.income_original,
       });


  }
  UNSAFE_componentWillReceiveProps(nextProps) {

    console.log(nextProps);
    if(nextProps == null)
    {
      this.setState({
        market: undefined,
        currency: undefined,
        asset: undefined,
      });
      return;                                             
    }

    this.setState({
        market: nextProps.market,
        currency: nextProps.currency,
        asset: nextProps.asset,
     });
     this.getView(nextProps.market, nextProps.asset);

  }

  componentDidMount() {
     this.getRepresentation();
  }



  render() {
    const {market, representation, issue, rest, price_original, price, reserved, add_reserve, free_reserve, rest_original, income_original} = this.state;
    return (
      <>
        <Form
           layout="vertical"
        >

        {
           representation.fields.map((field, index)=>{
             return (
                <ViewField key={index} field={field} value={field.value} onChange={this.onChange}/>
             )
           })
        }

        </Form>

        <Button key="submit" type="primary" onClick={this.onSave}>
          Save
        </Button>
        <Title level={4}>Issue</Title>
        <Form layout="inline">
           <FormItem
               label='Rest'
           >
             <Input type="number" value={rest} disabled={true}/>
           </FormItem>

           <FormItem
               label='Issued'
           >
             <Input type="number" value={issue} onChange={this.onChangeIssue} disabled={rest > 0}/>
           </FormItem>
{
           rest == 0 && (
           <Button type="primary" onClick={this.onIssue}>
             Issue
           </Button>
)
}
        </Form>
        <Title level={4}>Income original</Title>
        <Form layout="inline">
           <FormItem
               label='Rest'
           >
             <Input type="number" value={rest_original} disabled={true}/>
           </FormItem>

           <FormItem
               label='In warehouse'
           >
             <Input type="number" value={income_original} onChange={this.onChangeIncome} disabled={rest_original > 0}/>
           </FormItem>
{
           rest_original == 0 && (

           <Button type="primary" onClick={this.onIncome}>
             Income
           </Button>
)
}
        </Form>

        <Title level={4}>Reserve</Title>
        <Form layout="inline">
           <FormItem
               label='Reserved'
           >
             <Input type="number" value={reserved} disabled={true}/>
           </FormItem>

           <FormItem
               label='Add'
           >
             <Input type="number" value={add_reserve} onChange={this.onChangeAddReserve}/>
           </FormItem>
           <Button type="primary" onClick={this.onAddReserve}>
             Add reserve
           </Button>
           <Space/>
           <Space/>
           <FormItem
               label='Free'
           >
             <Input type="number" value={free_reserve} onChange={this.onChangeFreeReserve}/>
           </FormItem>


           <Button type="primary" onClick={this.onFreeReserve}>
             Free reserve
           </Button>
        </Form>
        <Title level={4}>Price</Title>
        <Form layout="inline">
           <FormItem
               label='Asset'
           >
             <Input type="number" value={price} onChange={this.onChangePrice}/>
           </FormItem>

           <FormItem
               label='Original'
           >
             <Input type="number" value={price_original} onChange={this.onChangeOriginalPrice}/>
           </FormItem>

           <Button type="primary" onClick={this.onPrice}>
             Set price
           </Button>
        </Form>



      </>
    );
  }
}
