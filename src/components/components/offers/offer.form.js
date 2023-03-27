import React, { Component } from "react";
import { Select, Form, Button, Modal, Input } from 'antd';
import AuthService from "../../../services/auth.service";



const FormItem = Form.Item;




export default class OfferForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uuid: this.props.data !== null?this.props.data.uuid:'',
      name: this.props.data !== null?this.props.data.name:'',
      type_value: this.props.data !== null?this.props.data.type_value:'string',
      type: this.props.data !== null?this.props.data.type:'',
      order: this.props.data !== null?this.props.data.order:'',
      typeValues: [{value:'string', label:'String'},
                   {value:'text', label:'Text'},
                   {value:'url', label:'Link'},
                   {value:'media', label:'Media'},
                  ],
      
      rights: {
                 editItem: AuthService.checkAuth("MANAGER")
              }

    };
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeTypeValue = this.onChangeTypeValue.bind(this);
    this.onSave = this.onSave.bind(this);
 }

  onChangeName(event){
     this.setState({name: event.target.value});
  }
  onChangeTypeValue(event){
     this.setState({type_value: event.value});
  }

  getDefaultOptions(uuid, options, value, isDefault)
  {
     if(uuid == 0 && !isDefault)
       return;
     const result = options.filter(obj => obj.value == value);
     return (result.length > 0)?result[0]:options[0];
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
        uuid: nextProps.data !== null?nextProps.data.uuid:'',
        name: nextProps.data !== null?nextProps.data.name:'',
        type_value: nextProps.data !== null?nextProps.data.type_value:'string',
        type: nextProps.data !== null?nextProps.data.type:'',
        order: nextProps.data !== null?nextProps.data.order:'',
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
            label="Type value"
            required
          >
          <Select
            title="Type value"
            placeholder="select type value"
//            defaultValue={this.getDefaultOptions(this.state.uuid, this.state.typeValues, this.state.type_value, true)}
            value={this.getDefaultOptions(this.state.uuid, this.state.typeValues, this.state.type_value, true)}
            labelInValue
            onChange={this.onChangeTypeValue}
            options={this.state.typeValues}
            disabled={!this.state.rights.editItem}
          />
       </FormItem>

        </Form>


      </Modal>
    );
  }


}
