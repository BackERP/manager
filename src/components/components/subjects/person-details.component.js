import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm, Image } from 'antd';
import SubjectTypeService from '../../../services/subject-type.service';
import PersonDetailService from '../../../services/person-details.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import PersonDetailForm from './person-detail.form';
import {FaRegEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";
import uploaderHelper from "../../../common/uploaderHelper";



const FormItem = Form.Item;





export default class PersonDetails extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 


    this.state = {
      persondetails: [],
      columns: [{ title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Photo', 
                  dataIndex: 'photo', 
                  key: 'photo',
                  render: (_, record)=>{
                     return (
                          <>
                             { record.photo !== ""?(<Image width={70} src={uploaderHelper.getFullPath(record.photo)}/>):''}
                          </>
//                        { record.photo !== ""?(<img src={uploaderHelper.getFullPath(record.photo)}/>):''}
                  )}
                },
                { title: 'Description', dataIndex: 'description', key: 'description'},
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
  async addNewItem(obj){
    await PersonDetailService.addNewItem(obj);
    await this.refreshData();
  }

  async updateItem(obj){
    await PersonDetailService.updateItem(obj);
    await this.refreshData();
  }
  async deleteItem(uuid){
    await PersonDetailService.deleteItem(uuid);
    await this.refreshData();
  }

  onSave(formState){
    this.setState({formShow: false})
    let obj = {uuid: formState.uuid,
               person: this.props.person,
               name: formState.name,
               photo: formState.photo,
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
     this.setState({formShow: true, data:{uuid:'',  name:'', photo:'', description:''}})
  }

  async refreshData(){
    const persondetails = await PersonDetailService.getList(this.props.person);
    if(persondetails === undefined)
    {
       this.setState({
          persondetails: [],
       });
       return;
    }
    this.setState({
          persondetails: persondetails,
     });
  }




  componentDidMount() {
    this.refreshData();
  }

  render() {
    const {columns,persondetails} = this.state;
    return (
      <div>
      <div><h5>Details:</h5></div>
      <Form
           layout="vertical"
      >
      {this.state.rights.addNewItem && (
          <Button variant="primary" onClick={this.onAddNew}>
            <FaPlus />
         </Button>
      )}
     <Table
       columns={columns}
       dataSource={persondetails}
       rowKey={record => record.uuid}
     />
     <PersonDetailForm show={this.state.formShow} handleClose = {this.onClose} handleSave={this.onSave} data={this.state.data}/>

     </Form>
     </div>


    );
  }
}
