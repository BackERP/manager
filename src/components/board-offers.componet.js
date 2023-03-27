import React, { Component } from "react";


import { Tabs } from 'antd';
import Offers from './components/offers/offers.component';



export default class BoardOffers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabItems: [{
                   label: `Offers state`,
                   key: 1,
                   children: <Offers/>,
                 },
/*
                 {
                   label: `Done`,
                   key: 2,
                   children: <Offers/>,
                 },
                 {
                   label: `Canceled`,
                   key: 3,
                   children: <Offers/>,
                 },
*/
                ],

    };

  }

  componentDidMount() {
  }

  render() {
    const {tabItems} = this.state;
    return (
        <Tabs type="card" items={tabItems}/>
    );
  }
}
