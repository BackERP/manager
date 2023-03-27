import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm } from 'antd';
import SubjectSpecificationService from '../../../services/subject-specification.service';
import TypeRelationService from '../../../services/type-relation.service';

import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import SubjectRelationForm from './subject-relation.form';
import {FaRegEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";


const FormItem = Form.Item;





export default class SubjectRealations extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    this.state = {
      subjecttypes: [],
      subjecttype: undefined,
      columns: [{ title: 'Subject',  key: 'name',
                 render: (_, record) =>record.subsubject_data.name,
                },
                { title: 'Person', key: 'persone',
                 render: (_, record) =>record.person_data.uuid!==null?record.person_data.first_name + ' ' + record.person_data.last_name:'',
               },
                { title: 'Relation', key: 'persone',
                 render: (_, record) =>record.relation_data.name,
               },
               { title: 'Description', dataIndex: 'description', key: 'description' },

                {title: 'Action',
                 key: 'operation',
                 render: (_, record) =>{
                            return (
                               <Space size="middle">
                                  <FaRegEdit onClick={(e)=>{this.onEdit(record)}} title="Edit item"/>
                                  {deleteItem && (
                                     <Popconfirm title="Delete the item"
                                                 description="Are you sure to delete this item?"
                                                 onConfirm={(e)=>this.onDelete(record.uuid)}
                                                 okText="Yes"
                                                 cancelText="No"
                                      >
                                         <FaRegTrashAlt title="Delete item"/>
                                      </Popconfirm>

                                   )}
                               </Space>
                            )
                         },
                 },
               ],
      subjectspecification:[],
      typerelations:[],
      formShow: false, 
      delete_id: 0,
      confirmShow: false,
      data: null,
      rights: {
                 deleteItem: deleteItem, 
                 addNewItem: addNewItem 
              }

    };

    this.onClose = this.onClose.bind(this);
    this.onAddNew = this.onAddNew.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onEdit   = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);


  }
  onClose(){
    this.setState({formShow: false, data: null})
  }
  async refreshData(){
    const subjectspecification = await SubjectSpecificationService.getList(this.props.subject);
    this.setState({
          subjectspecification: subjectspecification !== undefined?subjectspecification:[]
    });
  }

  async addNewItem(obj){
    await SubjectSpecificationService.addNewItem(obj);
    await this.refreshData();

  }
  async updateItem(obj){
    await SubjectSpecificationService.updateItem(obj);
    await this.refreshData();
  }
  async deleteItem(uuid){
    await SubjectSpecificationService.deleteItem(uuid);
    await this.refreshData();
  }

  onSave(formState){
    this.setState({formShow: false})
    let obj = {uuid: formState.uuid,
               subject: this.props.subject,
               subsubject: formState.subsubject,
               person: formState.person,
               relation: formState.relation,
               description: formState.description,
              }
    if(obj.uuid === '')
      return this.addNewItem(obj);

    return this.updateItem(obj);

  }
  onEdit(item){
    this.setState({formShow: true, data: item})
  }
  onDelete(uuid){
     return this.deleteItem(uuid);                                             
  }
  onAddNew(){
    this.setState({formShow: true, data:{uuid:'',  subject:this.props.subject, subsubject_data:{uuid:null, name:''}, person_data:{uuid:null, first_name:'', middle_name:'', last_name:''}, relation_data:{uuid:null, name:''}, description:''}})
  }





  componentDidMount() {
    this.refreshData();
  }

  render() {
    const {columns,subjectspecification} = this.state;
    return (
      <div>
      {this.state.rights.addNewItem && (
          <Button variant="primary" onClick={this.onAddNew}>
            <FaPlus />
         </Button>
      )}

     <Table
       columns={columns}
       dataSource={subjectspecification}
       rowKey={record => record.uuid}
     />
     <SubjectRelationForm show={this.state.formShow} handleClose = {this.onClose} handleSave={this.onSave} data={this.state.data}/>
     </div>


    );
  }
}
