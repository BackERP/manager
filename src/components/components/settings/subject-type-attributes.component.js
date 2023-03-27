import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm } from 'antd';
import SubjectTypeService from '../../../services/subject-type.service';
import SubjectTypeAttributeService from '../../../services/subject-type-attributes.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import SubjectTypeAttributeForm from './subject-type-attribute.form';
import {FaRegEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";


const FormItem = Form.Item;





export default class SubjectTypeAttributes extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    this.state = {
      subjecttypes: [],
      subjecttype: undefined,
      columns: [{ title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Type', dataIndex: 'type_value', key: 'type_value'},
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
      subjecttypeattributes:[],
      formShow: false, 
      delete_id: 0,
      confirmShow: false,
      data: null,
      rights: {
                 deleteItem: deleteItem, 
                 addNewItem: addNewItem 
              }



    };

    this.onChangeSubjectType = this.onChangeSubjectType.bind(this);

    this.onClose = this.onClose.bind(this);
    this.onAddNew = this.onAddNew.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onEdit   = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);


  }
  onChangeSubjectType(item){
        this.setState({
          subjecttype:  {value:item.value, label:item.lable}
        });
        this.refreshData(item.value);
  };
  onClose(){
    this.setState({formShow: false, data: null})
  }
  async addNewItem(obj){
    await SubjectTypeAttributeService.addNewItem(obj);
    await this.refreshData(this.state.subjecttype.value);
  }

  async updateItem(obj){
    await SubjectTypeAttributeService.updateItem(obj);
    await this.refreshData(this.state.subjecttype.value);
  }
  async deleteItem(uuid){
    await SubjectTypeAttributeService.deleteItem(uuid);
    await this.refreshData(this.state.subjecttype.value);
  }

  onSave(formState){
    this.setState({formShow: false})
    let obj = {uuid: formState.uuid,
               name: formState.name,
               type: formState.type,
               type_value: formState.type_value,
               order: formState.order,
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
    this.setState({formShow: true, data:{uuid:'', type:this.state.subjecttype.value, name:'', type_value:'string', order:0}})
  }

  async refreshSubjectType(){
    const response = await SubjectTypeService.getList();
    if(response === undefined)
    {
       this.setState({
          subjecttypes: [],
       });
       return;
    }
    const subjecttypes = response.map((obj)=>{return {value:obj.uuid, label:obj.name}});
    this.setState({
          subjecttypes: subjecttypes,
          subjecttype:  subjecttypes[0]
     });
     await this.refreshData(subjecttypes[0].value);
  }
  async refreshData(subjecttype){
    const subjecttypeattributes = await SubjectTypeAttributeService.getList(subjecttype);
    if(subjecttypeattributes === undefined)
    {
       this.setState({
          subjecttypeattributes: [],
       });
       return;
    }
    this.setState({
       subjecttypeattributes: subjecttypeattributes,
     });
  }




  componentDidMount() {
    this.refreshSubjectType();
  }

  render() {
    const {subjecttypes, subjecttype, columns,subjecttypeattributes} = this.state;
    return (
      <div>
      <Form
           layout="vertical"
      >
         <FormItem
            label="Subject's type"
          >
          <Select
            title="Subject's type:"
            placeholder="select type of subject"
            value={subjecttype}
            labelInValue
            style={{ width: 200 }}
            onChange={this.onChangeSubjectType}
            options={subjecttypes}
          />
       </FormItem>
      {this.state.rights.addNewItem && (
          <Button variant="primary" onClick={this.onAddNew}>
            <FaPlus />
         </Button>
      )}

     <Table
       columns={columns}
       dataSource={subjecttypeattributes}
       rowKey={record => record.uuid}
     />
     <SubjectTypeAttributeForm show={this.state.formShow} handleClose = {this.onClose} handleSave={this.onSave} data={this.state.data}/>

     </Form>
     </div>


    );
  }
}
