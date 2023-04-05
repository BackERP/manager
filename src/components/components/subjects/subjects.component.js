import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm, Checkbox } from 'antd';
import SubjectService from '../../../services/subject.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import SubjectForm from './subject.form';
import SubjectDetail from './subject-detail.component';
import {FaRegEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";


const FormItem = Form.Item;





export default class Subjects extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    this.state = {
      subjecttypes: [],
      subjecttype: undefined,
      columns: [{ title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Subject type', key: 'subject_type',
                 render: (_, record) =>record.subject_type_data.name,
               },
                { title: 'Show on main',  key: 'show_main',
                   render: (_, record) =><Checkbox checked={record.show_main} disabled/>,
                },
                { title: 'Order', dataIndex: 'order', key: 'order' },
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
      subjects:[],
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
    const subjects = await SubjectService.getList();
    this.setState({
          subjects: subjects !== undefined?subjects:[]
    });
  }

  async addNewItem(obj){
    await SubjectService.addNewItem(obj);
    await this.refreshData();

  }
  async updateItem(obj){
    await SubjectService.updateItem(obj);
    await this.refreshData();
  }
  async deleteItem(uuid){
    await SubjectService.deleteItem(uuid);
    await this.refreshData();
  }

  onSave(formState){
    this.setState({formShow: false})
    let obj = {uuid: formState.uuid,
               name: formState.name,
               show_main: formState.show_main,
               order: formState.order,
               subject_type: formState.subject_type,
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
    this.setState({formShow: true, data:{uuid:'',  name:'', subject_type_data:{uuid:'', name:'', show_main:false, order: undefined}}})
  }


  componentDidMount() {
    this.refreshData();
  }

  render() {
    const {columns,subjects} = this.state;
    return (
      <div>
      {this.state.rights.addNewItem && (
          <Button variant="primary" onClick={this.onAddNew}>
            <FaPlus />
         </Button>
      )}

     <Table
       columns={columns}
       dataSource={subjects}
       rowKey={record => record.uuid}
       expandable={{expandedRowRender: (record) => <div class="container"><SubjectDetail subject={record.uuid} subjecttype={record.subject_type_data.uuid}/></div>, defaultExpandedRowKeys: ['0'] }}
     />
     <SubjectForm show={this.state.formShow} handleClose = {this.onClose} handleSave={this.onSave} data={this.state.data}/>
     </div>


    );
  }
}
