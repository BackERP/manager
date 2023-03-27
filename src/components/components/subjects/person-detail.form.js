import React, { Component } from "react";
import { Select, Form, Button, Modal, Input } from 'antd';
import AuthService from "../../../services/auth.service";
import StorageService from "../../../services/storage.service";


import uploaderHelper from "../../../common/uploaderHelper";

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import EventBus from "../../../common/EventBus";





const FormItem = Form.Item;
const { TextArea } = Input;




export default class PersonDetailForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uuid: this.props.data !== null?this.props.data.uuid:'',
      name: this.props.data !== null?this.props.data.name:'',
      photo: this.props.data !== null?this.props.data.photo:'',
      description: this.props.data !== null?this.props.data.description:'',
      loading: false,
      rights: {
                 editItem: AuthService.checkAuth("MANAGER")
              }

    };
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePhoto = this.onChangePhoto.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);

    this.onSave = this.onSave.bind(this);

    EventBus.on("fileUploaded", (data) => {
      this.setState({photo:data.filename});
    });

 }
      
  onChangeName(event){
     this.setState({name: event.target.value});
  }                                                                      
  onChangePhoto(info, fileList, event){
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

  

  onChangeDescription(event){
     this.setState({description: event.target.value});
  }



  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
        uuid: nextProps.data !== null?nextProps.data.uuid:'',
        name: nextProps.data !== null?nextProps.data.name:'',
        photo: nextProps.data !== null?nextProps.data.photo:'',
        description: nextProps.data !== null?nextProps.data.description:'',
     });

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
            label="Name"
            required
          >
              <Input type="text" placeholder="Enter name" 
                 onChange={this.onChangeName}
                 value={this.state.name}
                 disabled={!this.state.rights.editItem}
              />
          </FormItem>
          <FormItem
            label="Photo"                                                 
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={uploaderHelper.uploadImage}
              beforeUpload={uploaderHelper.beforeUpload}
              onChange={this.onChangePhoto}
            >
              {this.state.photo !== '' ? <img src={uploaderHelper.getFullPath(this.state.photo)} alt="avatar" style={{ width: '100%' }} /> : this.uploadButton}
            </Upload>
          </FormItem>
          <FormItem
            label="Description"
            required
          >

              <TextArea rows="3" placeholder="Enter description" 
                 onChange={this.onChangeDescription}
                 value={this.state.description}
                 disabled={!this.state.rights.editItem}
              />
          </FormItem>

        </Form>
      </Modal>
    );
  }


}
