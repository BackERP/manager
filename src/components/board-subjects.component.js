import React, { Component } from "react";


import { Tabs } from 'antd';
import Subjects from './components/subjects/subjects.component';
import Persons from './components/subjects/persons.component';


export default class BoardSubjects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabItems: [{
                   label: `Subjects`,
                   key: 1,
                   children: <Subjects/>,
                 },
                 {
                   label: `Persons`,
                   key: 2,
                   children: <Persons/>,
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
                 