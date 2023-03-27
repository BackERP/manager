import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm, Image } from 'antd';
import SubjectAttributeService from '../../../services/subject-attributes.service';
import SubjectTypeAttributeService from '../../../services/subject-type-attributes.service';

import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import SubjectAttributeForm from './subject-attribute.form';
import {FaRegEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";
import uploaderHelper from "../../../common/uploaderHelper";



const FormItem = Form.Item;





export default class SubjectAttributes extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    this.state = {
      columns: [{ title: 'Name'
                 ,key: 'name' 
                 ,render: (_, record) =>record.attribute_data.name
                },
                { title: 'value', key: 'value',
                 render: (_, record) =>{
                        return (
                           <>
                               {record.attribute_data.type_value == 'string'  && (
                                  <span>{record.string_value}</span>
                               )}
                               {record.attribute_data.type_value == 'text'  && (
                                  <span>{record.text_value}</span>
                               )}
                               {record.attribute_data.type_value == 'url'  &&  record.string_value !== "" && (
                                  <a href={record.string_value} target='_blank' >{record.string_value}</a>)
                               }
                               {record.attribute_data.type_value == 'media'  &&  record.string_value !== "" && (
                                  <Image width={70} src={uploaderHelper.getFullPath(record.string_value)}/>)
                               }
                           </>
                        )
                 },
               },
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
      subjectattributes:[],
      subjectattributetypes:[],
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
    const subjectattributes = await SubjectAttributeService.getList(this.props.subject);
    this.setState({
          subjectattributes: subjectattributes !== undefined?subjectattributes:[]
    });
  }

  async addNewItem(obj){
    await SubjectAttributeService.addNewItem(obj);
    await this.refreshData();

  }
  async updateItem(obj){
    await SubjectAttributeService.updateItem(obj);
    await this.refreshData();
  }
  async deleteItem(uuid){
    await SubjectAttributeService.deleteItem(uuid);
    await this.refreshData();
  }

  onSave(formState){
    this.setState({formShow: false})
    let obj = {uuid: formState.uuid,
               subject: this.props.subject,
               attribute: formState.attribute,
               text_value: formState.text_value,
               string_value: formState.string_value,
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
    this.setState({formShow: true, data:{uuid:'',  subject: this.props.subject, subjecttype:this.props.subjecttype,attribute_data:{uuid:'', name:'', type_value: 'string'}, text_value:'', string_value:''}})
  }



  async refreshSubjectAttributeTypes(subjecttype){
    const subjectattributetypes = await SubjectTypeAttributeService.getList(subjecttype);
    if(!subjectattributetypes.length)
    {
       this.setState({
          subjectattributetypes: [],
       });
       return;
    }
//    const attribute = this.getAttribute(subjectattributetypes, this.state.attribute);
  
    this.setState({
          subjectattributetypes: subjectattributetypes,
     });
  }

  componentDidMount() {
    this.refreshData();
    this.refreshSubjectAttributeTypes(this.props.subjecttype)
  }

  render() {
    const {columns,subjectattributes} = this.state;
    return (
      <div>
      {this.state.rights.addNewItem && (
          <Button variant="primary" onClick={this.onAddNew}>
            <FaPlus />
         </Button>
      )}

     <Table
       columns={columns}
       dataSource={subjectattributes}
       rowKey={record => record.uuid}
     />
     <SubjectAttributeForm show={this.state.formShow} handleClose = {this.onClose} handleSave={this.onSave} data={this.state.data} subjectattributetypes={this.state.subjectattributetypes}/>
     </div>


    );
  }
}
