import React, { Component } from "react";
import { Select, Form, Button, Modal, Input } from 'antd';
import AuthService from "../../../services/auth.service";



const FormItem = Form.Item;



export default class PersonForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uuid: this.props.data !== null?this.props.data.uuid:'',
      first_name: this.props.data !== null?this.props.data.first_name:'',
      middle_name: this.props.data !== null?this.props.data.middle_name:'',
      last_name: this.props.data !== null?this.props.data.last_name:'',
      rights: {
                 editItem: AuthService.checkAuth("MANAGER")
              }

    };
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeMiddleName = this.onChangeMiddleName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);

    this.onSave = this.onSave.bind(this);
 }

  onChangeFirstName(event){
     this.setState({first_name: event.target.value});
  }
  onChangeMiddleName(event){
     this.setState({middle_name: event.target.value});
  }
  onChangeLastName(event){
     this.setState({last_name: event.target.value});
  }



  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
        uuid: nextProps.data !== null?nextProps.data.uuid:'',
        first_name: nextProps.data !== null?nextProps.data.first_name:'',
        middle_name: nextProps.data !== null?nextProps.data.middle_name:'',
        last_name: nextProps.data !== null?nextProps.data.last_name:'',
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
            label="First name"
            required
          >
              <Input type="text" placeholder="Enter first name" 
                 onChange={this.onChangeFirstName}
                 value={this.state.first_name}
                 disabled={!this.state.rights.editItem}
              />
          </FormItem>
          <FormItem
            label="Middle name"                                                 
          >
              <Input type="text" placeholder="Enter middle name" 
                 onChange={this.onChangeMiddleName}
                 value={this.state.middle_name}
                 disabled={!this.state.rights.editItem}
              />
          </FormItem>
          <FormItem
            label="Last name"
            required
          >
              <Input type="text" placeholder="Enter last name" 
                 onChange={this.onChangeLastName}
                 value={this.state.last_name}
                 disabled={!this.state.rights.editItem}
              />
          </FormItem>

        </Form>
      </Modal>
    );
  }


}
