import React, { Component } from "react";
import MarketService from '../../../services/market.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import EmptyMarketObjectForm from './empty-market-object.form';
import SubjectMarketObjectForm from './subject-market-object.form';
import PesonMarketObjectForm from './peson-market-object.form';
import AssetMarketObjectForm from './asset-market-object.form';







export default class SelectorMarketObject extends Component {

  constructor(props) {
    
    super(props);

    this.state = {
        market: this.props.market,
        currency: this.props.currency,
        subject: this.props.subject,
        person: this.props.person,
        asset: this.props.asset,
    };


  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps == null)
    {
      this.setState({
        market: undefined,
        currency: undefined,
        subject: undefined,
        person: undefined,
        asset: undefined,
      });
      return;
    }

    this.setState({
        market: nextProps.market,
        currency: nextProps.currency,
        subject: nextProps.subject,
        person: nextProps.person,
        asset: nextProps.asset,
     });
  }


  render() {
    const {market, currency, subject, person, asset} = this.state;
    return (
      <>
{
        subject==undefined && person == undefined && asset == undefined && (
           <EmptyMarketObjectForm/>
        )
}
{
        subject != undefined && person == undefined && asset == undefined && (
           <SubjectMarketObjectForm market={market} subject={subject} />
        )
}
{
        subject != undefined && person != undefined && asset == undefined && (
           <PesonMarketObjectForm market={market} subject={subject} person={person}/>
         )
        
}

{
        (subject != undefined && person != undefined && asset != undefined) && (
           <AssetMarketObjectForm market={market} subject={subject} person={person} asset={asset} currency={currency}/>
        )
}

      </>
    );
  }
}
