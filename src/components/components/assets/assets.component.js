import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm } from 'antd';
import AssetService from '../../../services/asset.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import AssetForm from './asset.form';
import AssetDetail from './asset-detail.component';

import {FaRegEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";


const FormItem = Form.Item;





export default class Assets extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    const createLable = (obj)=>{
       let lable = ''
       if(obj.subject_specification_data.subsubject_data.uuid !== null)
         lable += obj.subject_specification_data.subsubject_data.name;
       if(obj.subject_specification_data.subsubject_data.uuid !== null &&
          obj.subject_specification_data.person_data.uuid !== null
         )
         lable += ': ';
       if(obj.subject_specification_data.person_data.uuid !== null
         )
       {
         lable += obj.subject_specification_data.person_data.first_name;
         if(obj.subject_specification_data.person_data.middle_name !== "")
           lable += ' ' + obj.subject_specification_data.person_data.middle_name;
         lable += ' ' + obj.subject_specification_data.person_data.last_name;

       }
       lable += ' (' + obj.subject_specification_data.relation_data.name + ')';
       return lable;
    }

    this.state = {
      subjecttypes: [],
      subjecttype: undefined,
      columns: [{ title: 'Representative', key: 'representative',
                 render: (_, record) =>record.subject_data.name,
                },
                { title: 'Author',  key: 'authtor',
                   render: (_, record) =>createLable(record),
                },
                { title: 'Name', dataIndex: 'name', key: 'name'},
                { title: 'Description', dataIndex: 'description', key: 'description'},
                { title: 'Mime', dataIndex: 'mime', key: 'mime'},

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
      assets:[],
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
    await AssetService.addNewItem(obj);
    await this.refreshData();
  }

  async updateItem(obj){
    await AssetService.updateItem(obj);
    await this.refreshData();
  }
  async deleteItem(uuid){
    await AssetService.deleteItem(uuid);
    await this.refreshData();
  }

  onSave(formState){
    this.setState({formShow: false})
    let obj = {uuid: formState.uuid,
               subject: formState.subject,
               subject_specification: formState.subject_specification,
               name: formState.name,
               description: formState.description,
               mime: formState.mime,

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
    this.setState({formShow: true, data:{uuid:''
                                        , subject_data: {uuid:null}
                                        , subject_specification_data: {uuid:null}
                                        , name:''
                                        , description:''
                                        , mime:'image/*'
                                        }
                  });
  }

  async refreshData(){
    const assets = await AssetService.getList();
    if(assets === undefined)
    {
       this.setState({
          assets: [],
       });
       return;
    }
    this.setState({
       assets: assets,
     });
  }




  componentDidMount() {
    this.refreshData();
  }

  render() {
    const {columns,assets} = this.state;
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
       dataSource={assets}
       rowKey={record => record.uuid}
       expandable={{expandedRowRender: (record) => <div class="container"><AssetDetail asset={record.uuid}/></div>, defaultExpandedRowKeys: ['0'] }}
     />
     <AssetForm show={this.state.formShow} handleClose = {this.onClose} handleSave={this.onSave} data={this.state.data}/>

     </Form>
     </div>


    );
  }
}
