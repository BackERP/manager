import React, { Component } from "react";
import { Select, Form, Button, Modal, Input } from 'antd';
import AuthService from "../../../services/auth.service";
import StorageService from "../../../services/storage.service";
import uploaderHelper from "../../../common/uploaderHelper";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import EventBus from "../../../common/EventBus";

const { TextArea } = Input;
const FormItem = Form.Item;


export default class SubjectAttributeForm extends Component {
  constructor(props) {
    super(props);
//    const optionsubjectattributetypes = this.props.subjectattributetypes.map((obj)=>{return {value:obj.uuid, label:obj.name}});

    this.state = {
      subjectattributetypes: [],
      optionsubjectattributetypes: [],
      uuid: this.props.data !== null?this.props.data.uuid:'',
      subject: this.props.data !== null?this.props.data.subject:'',
      subjecttype: this.props.data !== null?this.props.data.subjecttype:'',
      attribute: this.props.data !== null?this.props.data.attribute_data.uuid:'',
      type_value: this.props.data !== null?this.props.data.attribute_data.type_value:'string',
      text_value: this.props.data !== null?this.props.data.text_value:'',
      string_value: this.props.data !== null?this.props.data.string_value:'',
      loading:false,
     
      rights: {
                 editItem: AuthService.checkAuth("MANAGER")
              }

    };
    this.onChangeAttribute = this.onChangeAttribute.bind(this);
    this.onChangeTextValue = this.onChangeTextValue.bind(this);
    this.onChangeStringValue = this.onChangeStringValue.bind(this);
    this.onChangeMedia = this.onChangeMedia.bind(this);


    this.onSave = this.onSave.bind(this);
    EventBus.on("fileUploaded", (data) => {
       this.setState({string_value:data.filename});
    });

 }
  onChangeMedia(info, fileList, event){
    if (info.file.status === 'uploading') {
      this.setState({loading:true});
      return;
    }

    if (info.file.status === 'done') {
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


  onChangeTextValue(event){
     this.setState({text_value: event.target.value});
  }
  onChangeStringValue(event){
     this.setState({string_value: event.target.value});
  }

  onChangeAttribute(event){
     const attribute = this.getAttribute(this.state.subjectattributetypes, event.value);
     console.log('onChangeAttribute', attribute)
     this.setState({attribute: attribute.uuid, type_value: attribute.type_value, text_value:'', string_value:''});
  }

  getDefaultOptions(uuid, options, value, isDefault)
  {
     if(uuid == 0 && !isDefault)
       return;

     const result = options.filter(obj => obj.value == value);
     return (result.length > 0)?result[0]:options[0];
  }

  getAttribute(subjectattributetypes, uuid){
     const result = subjectattributetypes.filter(obj => obj.uuid == uuid);
     return (result.length > 0)?result[0]:(subjectattributetypes.length > 0?subjectattributetypes[0]:{uuid:'', type_value:'string'});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.data == null)
      return;
    const optionsubjectattributetypes = nextProps.subjectattributetypes.map((obj)=>{return {value:obj.uuid, label:obj.name}});
    const attribute_data = this.getAttribute(nextProps.subjectattributetypes, nextProps.data.attribute_data.uuid);
    const type_value = (nextProps.data.uuid == '')?attribute_data.type_value:nextProps.data.attribute_data.type_value;
    const attribute = (nextProps.data.uuid == '')?attribute_data.uuid:nextProps.data.attribute_data.uuid;
    console.log('attribute', attribute);
    console.log('options', optionsubjectattributetypes);


    

//    const attribute = this.getAttribute(nextProps.data.attribute_data.uuid);
    this.setState({
        uuid: nextProps.data.uuid,
        subject: nextProps.data.subject,
        subjecttype: nextProps.data.subjecttype,
        attribute: attribute,
        type_value: type_value,
        text_value: nextProps.data.text_value,
        string_value: nextProps.data.string_value,
        subjectattributetypes: nextProps.subjectattributetypes,
        optionsubjectattributetypes: optionsubjectattributetypes,

     });
//     this.refreshSubjectAttributeTypes(nextProps.data.subjecttype);
  }
  onSave(){
    this.props.handleSave(this.state);
  }


  render() {
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
            label="Attribute"
            required
          >
          <Select
            title="Attribute"
            placeholder="select attribute"
//            defaultValue={this.getDefaultOptions(this.state.uuid, this.state.typeValues, this.state.type_value, true)}
            value={this.getDefaultOptions(this.state.uuid, this.state.optionsubjectattributetypes, this.state.attribute, true)}
            labelInValue
            onChange={this.onChangeAttribute}
            options={this.state.optionsubjectattributetypes}
            disabled={!this.state.rights.editItem}
          />
       </FormItem>
       {
          this.state.type_value == 'string' && (
             <FormItem
               label="Value"
               required
             >
                <Input type="text" placeholder="Enter value" 
                   onChange={this.onChangeStringValue}
                   value={this.state.string_value}
                   disabled={!this.state.rights.editItem}
                />
             </FormItem>
        )}
       {
          this.state.type_value == 'url' && (
             <FormItem
               label="Link"
               required
             >
                <Input type="text" placeholder="Enter adress of link" 
                   onChange={this.onChangeStringValue}
                   value={this.state.string_value}
                   disabled={!this.state.rights.editItem}
                />
             </FormItem>
        )}
       {
          this.state.type_value == 'text' && (
             <FormItem
               label="Text"
               required
             >
              <TextArea rows="3" placeholder="Enter text" 
                 onChange={this.onChangeTextValue}
                 value={this.state.text_value}
                 disabled={!this.state.rights.editItem}
              />
             </FormItem>
        )}
       {
          this.state.type_value == 'media' && (
             <FormItem
               label="Media"                                                 
             >
                <Upload
                  name="media"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={uploaderHelper.uploadImage}
                  beforeUpload={uploaderHelper.beforeUpload}
                  onChange={this.onChangeMedia}
                >
                  {this.state.string_value !== '' ? <img src={uploaderHelper.getFullPath(this.state.string_value)} alt="media" style={{ width: '100%' }} /> : this.uploadButton}
                </Upload>
             </FormItem>
        )}
        </Form>
      </Modal>
    );
  }


}
