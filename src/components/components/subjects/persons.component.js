import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm, PlusOutlined } from 'antd';
import SubjectTypeService from '../../../services/subject-type.service';
import PersonService from '../../../services/person.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import PersonForm from './person.form';
import PersonDetails from './person-details.component';
import {FaRegEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";


const FormItem = Form.Item;





export default class Persons extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    this.state = {
      persons: [],
      columns: [{ title: 'First name', dataIndex: 'first_name', key: 'first_name' },
                { title: 'Middle name', dataIndex: 'middle_name', key: 'middle_name'},
                { title: 'Last name', dataIndex: 'last_name', key: 'last_name'},
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
    await PersonService.addNewItem(obj);
    await this.refreshData();
  }

  async updateItem(obj){
    await PersonService.updateItem(obj);
    await this.refreshData();
  }
  async deleteItem(uuid){
    await PersonService.deleteItem(uuid);
    await this.refreshData();
  }

  onSave(formState){
    this.setState({formShow: false})
    let obj = {uuid: formState.uuid,
               first_name: formState.first_name,
               middle_name: formState.middle_name,
               last_name: formState.last_name,
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
     this.setState({formShow: true, data:{uuid:'',  first_name:'', middle_name:'', last_name:''}})
  }

  async refreshData(){
    const persons = await PersonService.getList();
    if(persons === undefined)
    {
       this.setState({
          persons: [],
       });
       return;
    }
    this.setState({
          persons: persons,
     });
  }




  componentDidMount() {
    this.refreshData();
  }

  render() {
    const {columns,persons} = this.state;
    return (
      <div>
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
       dataSource={persons}
       rowKey={record => record.uuid}
       expandable={{expandedRowRender: (record) => <div class="container"><PersonDetails person={record.uuid}/></div>, defaultExpandedRowKeys: ['0'] }}
     />
     <PersonForm show={this.state.formShow} handleClose = {this.onClose} handleSave={this.onSave} data={this.state.data}/>

     </Form>
     </div>


    );
  }
}
