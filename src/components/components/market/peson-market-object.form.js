import React, { Component } from "react";
import { Form, Input, Button } from 'antd';

import MarketService from '../../../services/market.service';
import AuthService from "../../../services/auth.service";
import RepresentationService from "../../../services/representation.service";
import ViewField from "../common/view.field";
import ViewPersonService from "../../../services/viewperson.service";

import EventBus from "../../../common/EventBus";






export default class PesonMarketObjectForm extends Component {

  constructor(props) {
    
    super(props);

    this.state = {
      market: undefined,
      person: undefined,
      representation: {fields:[]},
    };

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);

  }

  onSave()
  {
     const fields = this.state.representation.fields.map((item)=>{return {name: item.variable, value: item.value}});
     ViewPersonService.saveItem(this.state.market, this.state.person, fields);

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
    const representation = await RepresentationService.getItem('Person');
    if(representation === undefined)                             
      representation = {fields:[]};
    this.setState({representation:representation});
    await this.getView(this.props.market, this.props.person);

  }

  async getView(market, person)
  {
     let view = await ViewPersonService.getItem(market, person);
     if(view == undefined)
       view = {};
    const representation = this.state.representation;
    for(let i in representation.fields)
       representation.fields[i].value = view[representation.fields[i].variable];
    this.setState({representation:representation});
  }
  UNSAFE_componentWillReceiveProps(nextProps) {

    if(nextProps == null)
    {
      this.setState({
        market: undefined,
        person: undefined,
      });
      return;                                             
    }

    this.setState({
        market: nextProps.market,
        person: nextProps.person,
     });
     this.getView(nextProps.market, nextProps.person);

  }

  componentDidMount() {
     this.getRepresentation();
  }



  render() {
    const {market, representation} = this.state;
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

      </>
    );
  }
}
