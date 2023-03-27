import React, { Component } from "react";
import { Select, Form, Button, Modal, Input, Checkbox, Image } from 'antd';
import AuthService from "../../../services/auth.service";
import AssetsProviderService from '../../../services/assets-provider.service';

import uploaderHelper from "../../../common/uploaderHelper";

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import EventBus from "../../../common/EventBus";



const { TextArea } = Input;
const FormItem = Form.Item;




export default class AssetResourceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
       providers: [],
       uuid:'',
       asset: undefined,
       provider: undefined,
       resource:'',
       default_item: false,
       link_address:'',
       loading: '',
       isIPFS: false,
       isImage:{upload:false,
                show: false,
               },

       rights: {
                 editItem: AuthService.checkAuth("MANAGER")
               }

    };
    this.onChangeProvider = this.onChangeProvider.bind(this);
    this.onChangeDefaultItem = this.onChangeDefaultItem.bind(this);
    this.onChangeResource = this.onChangeResource.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);

    this.onSave = this.onSave.bind(this);
    EventBus.on("fileUploaded", (data) => {
      this.setState({resource:data.filename, link_address:data.link_address});
    });
    EventBus.on("fileUploadedToIPFS", (data) => {
      this.setState({resource:data.ipfs.IpfsHash, link_address: data.link_address});

    });



 }

  onChangeDefaultItem(event){
     this.setState({default_item: event.target.checked});
  }
   onChangeResource(event){
     this.setState({resource: event.target.value});
  }

  setEmptyProvider()
  {
    this.setState({isImage:{upload:false, show:false}, isIPFS:false});
  }
  setIsImage(provider)
  {
     if(provider === undefined || provider == null)
        return this.setEmptyProvider();

     const providerOption = this.getDefaultOptions('', this.state.providers, provider, true);

     if(providerOption === undefined || providerOption == null)
        return this.setEmptyProvider();
     const name = providerOption.label;
     if(name == 'Physically')
        this.setEmptyProvider();
     if(name == 'External link')
         this.setState({isImage:{upload:false, show:true}, isIPFS:false});
     if(name == 'Local')
        this.setState({isImage:{upload:true, show:false}, isIPFS:false});
     if(name == 'PinataIPFS')
        this.setState({isImage:{upload:true, show:false}, isIPFS:true});



  }
  onChangeProvider(event){

     this.setIsImage(event !== undefined?event.value:undefined);


     if(event !== undefined)
       this.setState({provider: event.value, resource: ''});
     else
       this.setState({provider: null, resource: ''});
  }
  onChangeImage(info, fileList, event){
    if (info.file.status === 'uploading') {
      this.setState({loading:true});
      return;
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      uploaderHelper.getBase64(info.file.originFileObj, (url) => {
        this.setState({loading:false});
      });
    }
  };

  uploadButton(){
    return (
    <div>
      {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
   )};

  getDefaultOptions(uuid, options, value, isDefault)
  {
     if(!options.length)
       return;
     if(uuid == '' && !isDefault)
       return;

     const result = options.filter(obj => obj.value == value);
     return (result.length > 0)?result[0]:(isDefault?options[0]:null);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.data == null)
      return;


    this.setState({
       uuid: nextProps.data.uuid,
       asset: nextProps.data.asset,
       provider: nextProps.data.provider_data.uuid,
       resource: nextProps.data.resource,
       default_item: nextProps.data.default_item?true:false,
       link_address: nextProps.data.link_address,
     });
     this.setIsImage(nextProps.data.provider_data.uuid);
     console.log('default_item', nextProps.data.default_item);

  }
  onSave(){
    this.props.handleSave(this.state);
  }
  async refreshProviders(){
    const response = await AssetsProviderService.getList();
    if(response === undefined)
    {
       this.setState({
          providers: [],
       });
       return;
    }
    const providers = response.map((obj)=>{return {value:obj.uuid, label:obj.name}});
    this.setState({
          providers: providers,
     });
  }

  componentDidMount() {
    this.refreshProviders();
  }

  render() {
    const {isIPFS} = this.state;
    return (
      <Modal open={this.props.show} onCancel={this.props.handleClose} onOk={this.onSave}
        footer={[
          <Button key="cancel" onClick={this.props.handleClose}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={this.onSave} disabled={!this.state.rights.editItem}>
            Save
          </Button>,
        ]}

      >
        <Form
           layout="vertical"
        >
         <FormItem
            label="Provider"
          >
          <Select
            title="Provider"
            placeholder="select provider"
            value={this.getDefaultOptions(this.state.uuid, this.state.providers, this.state.provider, false)}
            labelInValue
            onChange={this.onChangeProvider}
            options={this.state.providers}
            disabled={!this.state.rights.editItem}
          />
         </FormItem>
{         this.state.isImage.upload && (
          <FormItem
            label="Image resource"                                                 
          >
            <Upload
              name="image_resource"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={isIPFS?uploaderHelper.uploadIPFS:uploaderHelper.uploadImage}
              beforeUpload={uploaderHelper.beforeUpload}
              onChange={this.onChangeImage}
            >
              {this.state.link_address !== '' ? <img src={this.state.link_address} alt="image resource" style={{ width: '100%' }} /> : this.uploadButton}
            </Upload>
          </FormItem>
          )
}
{
         this.state.isImage.show && (
          <FormItem
            label="Image resource"                                                 
          >
              { this.state.resource !== ""?(<Image width={100} src={this.state.resource}/>):''}
          </FormItem>
          )

}
          <FormItem
             label="Resource"
             required
           >

              <TextArea rows="3" placeholder="Enter resource" 
                        onChange={this.onChangeResource}
                        value={this.state.resource}
                        disabled={!this.state.rights.editItem || this.state.isImage.upload}
              />
            </FormItem>
           <div>
               <Checkbox checked={this.state.default_item} 
                        onChange={this.onChangeDefaultItem}
              >
              Default
              </Checkbox>
            </div>



        </Form>


      </Modal>
    );
  }


}
