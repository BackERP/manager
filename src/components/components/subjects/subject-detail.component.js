import React, { Component } from "react";


import { Tabs } from 'antd';
import SubjectRelations from './subject-relations.component';
import SubjectAttributes from './subject-attributes.component';




export default class SubjectDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabItems: [{
                   label: 'Attributes',
                   key: 1,
                   children: <SubjectAttributes subject={this.props.subject} subjecttype={this.props.subjecttype}/>,
                 },
                 {
                   label: `Relations`,
                   key: 2,
                   children: <SubjectRelations subject={this.props.subject}/>,
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
