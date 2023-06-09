import React, { Component } from "react";


//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Tabs } from 'antd';
import SubjectTypeAttributes from './components/settings/subject-type-attributes.component';
import Representations from './components/representations/representations.component';




//import 'react-tabs/style/react-tabs.css';


export default class BoardSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabItems: [{
                   label: `Attributes of type subject`,
                   key: 1,
                   children: <SubjectTypeAttributes/>,
                 },
                 {
                   label: `Representations`,
                   key: 2,
                   children: <Representations/>,
                 }
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
