import React, { Component } from "react";
import MarketService from '../../../services/market.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";







export default class EmptyMarketObjectForm extends Component {

  constructor(props) {
    
    super(props);

    this.state = {
      market: undefined,
      market_object: undefined,
    };


  }


  render() {
    const {market, type_market_object, market_object} = this.state;
    return (
      <>
      </>
    );
  }
}
