import React, { Component } from "react";


import { Tabs } from 'antd';
import AssetsResources from './assets-resources.component';




export default class AssetDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabItems: [{
                   label: 'Resources',
                   key: 1,
                   children: <AssetsResources asset={this.props.asset}/>,
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
