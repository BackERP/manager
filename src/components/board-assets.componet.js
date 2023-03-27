import React, { Component } from "react";


import { Tabs } from 'antd';
import Assets from './components/assets/assets.component';



export default class BoardAssets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabItems: [{
                   label: `Assets`,
                   key: 1,
                   children: <Assets/>,
                 },
/*
                 {
                   label: `Assets of subject`,
                   key: 2,
                   children: <Assets/>,
                 },
                 {
                   label: `Assets of person`,
                   key: 3,
                   children: <Assets/>,
                 }
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
