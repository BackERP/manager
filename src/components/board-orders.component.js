import React, { Component } from "react";


import { Tabs } from 'antd';
import Orders from './components/orders/orders.component';



export default class BoardOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabItems: [{
                   label: `Purchases`,
                   key: 1,
                   children: <Orders/>,
                 },
/*
                 {
                   label: `Paid`,
                   key: 2,
                   children: <Orders/>,
                 },
                 {
                   label: `Canceled`,
                   key: 3,
                   children: <Orders/>,
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
