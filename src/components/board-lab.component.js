import React, { Component } from "react";


import { Tabs } from 'antd';
import CartOrder from './components/lab/cart-order.component';


export default class BoardLab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabItems: [{
                   label: `Cart to order`,
                   key: 1,
                   children: <CartOrder/>,
                 },
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
                 