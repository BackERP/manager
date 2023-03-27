import React, { Component } from "react";
import { Select, Form, Table, Button, Space, Popconfirm, Checkbox, Image, message } from 'antd';
import AssetsResourceService from '../../../services/assets-resource.service';
import OfferService from '../../../services/offer.service';
import AuthService from "../../../services/auth.service";

import EventBus from "../../../common/EventBus";
import AssetResourceForm from './asset-resource.form';
import AssetOfferForm from './asset-offer.form';

import {FaRegEdit, FaRegTrashAlt, FaPlus, FaFileExport} from "react-icons/fa";


const FormItem = Form.Item;





export default class AssetsResources extends Component {

  constructor(props) {
    
    super(props);
    const deleteItem = AuthService.checkAuth("MANAGER"); 
    const addNewItem = AuthService.checkAuth("MANAGER"); 

    this.state = {
      subjecttypes: [],
      subjecttype: undefined,
      columns: [{ title: 'Provider', key: 'provider',
                 render: (_, record) =>record.provider_data.name,
                },
                { title: 'Resource', dataIndex: 'resource', key: 'resource'},

                { title: 'Image',  key: 'image',
                  render: (_, record)=>{
                     return (
                          <>
                             { record.link_address !== ""?(<Image width={70} src={record.link_address}/>):''}
                          </>
                  )}
                },
                { title: 'Default',  key: 'default_resource',
                   render: (_, record) =><Checkbox checked={record.default_item} disabled/>,
                },

                {title: 'Action',
                 key: 'operation',
                 render: (_, record) =>{
                            return (
                               <Space size="middle">
                                  <FaRegEdit onClick={(e)=>{this.onEdit(record)}} title="Edit item"/>
                                  <FaFileExport onClick={(e)=>{this.onCreateOffer(record)}} title="Create offer"/>
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
      assetsresources:[],
      formShow: false, 
      delete_id: 0,
      confirmShow: false,
      data: null,
      formOfferShow: false,
      offerParams: null,
      rights: {
                 deleteItem: deleteItem, 
                 addNewItem: addNewItem 
              }



    };

     <AssetOfferForm show={this.state.formOfferShow} handleClose = {this.onOfferClose} handleSave={this.onOfferSave} data={this.state.offerParams}/>

    this.onClose = this.onClose.bind(this);
    this.onAddNew = this.onAddNew.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onEdit   = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.onCreateOffer = this.onCreateOffer.bind(this);
    this.onOfferClose = this.onOfferClose.bind(this);
    this.onOfferSave = this.onOfferSave.bind(this);
  }

  onOfferClose()
  {
     this.setState({formOfferShow: false});
  }

  async createOffer(obj)
  {
     await OfferService.offerItem(obj);
     message.success("The asset is up for sale");

  }
  onCreateOffer(resource)
  {
     this.setState({formOfferShow: true,
        offerParams: { assetResource: resource.uuid,
                       provider_data: resource.provider_data
                     }
     });
  }
  onOfferSave(formState)
  {
      this.createOffer({ assetResource: formState.assetResource, 
                          price: formState.price, 
                          quantity: formState.quantity, 
                          is_physic: formState.is_physic, 
                          price_physic: formState.price_physic
                      });
     //assetResource, price, quantity, is_physic, price_physic
     this.setState({formOfferShow: false});
  }

  onClose(){
    this.setState({formShow: false, data: null})
  }
  async addNewItem(obj){
    await AssetsResourceService.addNewItem(obj);
    await this.refreshData();
  }

  async updateItem(obj){
    await AssetsResourceService.updateItem(obj);
    await this.refreshData();
  }
  async deleteItem(uuid){
    await AssetsResourceService.deleteItem(uuid);
    await this.refreshData();
  }

  onSave(formState){
    this.setState({formShow: false})
    let obj = {uuid: formState.uuid,
               asset: this.props.asset,
               provider: formState.provider,
               resource: formState.resource,
               default_item: formState.default_item,
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
                                        , asset_data: {uuid:null}
                                        , provider_data: {uuid:null}
                                        , resource:''
                                        , default_item:false
                                        , link_address:''
                                        }
                  });
  }

  async refreshData(){
    const assetsresources = await AssetsResourceService.getList(this.props.asset);
    if(assetsresources === undefined)
    {
       this.setState({
          assetsresources: [],
       });
       return;
    }
    this.setState({
       assetsresources: assetsresources,
     });
  }




  componentDidMount() {
    this.refreshData();
  }

  render() {
    const {columns,assetsresources} = this.state;
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
       dataSource={assetsresources}
       rowKey={record => record.uuid}
     />
     </Form>
     <AssetResourceForm show={this.state.formShow} handleClose = {this.onClose} handleSave={this.onSave} data={this.state.data}/>
     <AssetOfferForm show={this.state.formOfferShow} handleClose = {this.onOfferClose} handleSave={this.onOfferSave} data={this.state.offerParams}/>
     </div>


    );
  }
}
