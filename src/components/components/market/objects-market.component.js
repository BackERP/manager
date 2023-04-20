import React, { Component } from "react";
import { Tree } from 'antd';
import MarketService from '../../../services/market.service';
import SubjectService from '../../../services/subject.service';
import PersonService from '../../../services/person.service';
import AssetService from '../../../services/asset.service';



import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import {FaFortAwesome, FaUser, FaPaintBrush} from "react-icons/fa";


const updateTreeData = (list, key, children)=>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

export default class ObjectsMarket extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    this.state = {
      subjects: [],
      treeData:  [],                                                
      treeNavigator: [],


      rights: {
                 deleteItem: deleteItem, 
                 addNewItem: addNewItem 
              }



    };
    this.onLoadData = this.onLoadData.bind(this);
     this.onSelectNode= this.onSelectNode.bind(this);
  }


  async getSubjectsData(){
    const subjects = await SubjectService.getList();
    if(subjects == undefined)
    {
      this.setState({
            subjects: [],
            treeData:[], 
      });
      return;
    }
    const treeData = subjects.map((subject)=>{return {title: subject.name, key: subject.uuid, icon: <FaFortAwesome/>}})
    const treeNavigator = [];
    for(let subject of subjects)
      treeNavigator[subject.uuid] = {subject: subject.uuid, person:undefined, asset: undefined};

    this.setState({
          subjects: subjects,
          treeData:treeData, 
          treeNavigator: treeNavigator,
    });
  }
  componentDidMount() {
     this.getSubjectsData();
  }


  isSubject(key)
  {
    const subject = this.state.treeData.find((node)=>node.key == key);
    return subject !== undefined
  }
  findSubject(key)
  {
     const treeData = this.state.treeData;
     for(let subject of treeData)
        if(subject.children !== undefined)
           for(let person of subject.children)
           {
              if(person.key == key)
                return subject.key;
           }
     return;
  }
  async loadPersons(key)
  {
    const createPersonLable = (obj)=>{
         let lable = ''
         lable += obj.first_name;
         if(obj.middle_name !== "")
           lable += ' ' + obj.middle_name;
         if(obj.last_name !== "")
           lable += ' ' + obj.last_name;
         return lable;
    }
    const persons = await PersonService.getRepresentations(key);
    const children = persons.map((person)=>{ return {
      title: createPersonLable(person),
      key: person.uuid,
      icon: <FaUser/>
    }});
    const treeNavigator = this.state.treeNavigator;
    for(let person of persons)
      treeNavigator[person.uuid] = {subject: key, person:person.uuid, asset: undefined};
    this.setState({treeNavigator: treeNavigator});
    return children;
  }
  async loadAssets(key)
  {
    const assets = await AssetService.getAssetsByPerson(key);
    const children = assets.map((asset)=>{ return {
      title: asset.name,
      key: asset.uuid,
      icon: <FaPaintBrush/>,
      isLeaf: true
    }});
    const subject = this.findSubject(key);
    const treeNavigator = this.state.treeNavigator;
    for(let asset of assets)
      treeNavigator[asset.uuid] = {subject: subject, person: key, asset: asset.uuid};
    this.setState({treeNavigator: treeNavigator});


    return children;
  }

  async onLoadData({ key, children }){
    let chld = this.isSubject(key)?(await this.loadPersons(key)):(await this.loadAssets(key));

    const newTree = updateTreeData(this.state.treeData, key, chld);
    this.setState({
          treeData:newTree 
    });

  }

  onSelectNode(key, e)
  {
     const treePos = this.state.treeNavigator[key];
     if(treePos === undefined)
       return;
     this.props.onChangeSubject(treePos.subject);
     this.props.onChangePerson(treePos.person);
     this.props.onChangeAsset(treePos.asset);
  }

  render() {
    const {treeData} = this.state;
    return (
       <>
        <h5 style={{marginLeft:'10px'}}>Market objects</h5>
         <Tree 
          showIcon 
          loadData={this.onLoadData} 
          treeData={treeData} 
          onSelect={this.onSelectNode}
         />
       </>
    );
  }
}
