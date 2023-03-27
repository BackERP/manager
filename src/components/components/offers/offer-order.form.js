import React, { Component } from "react";
import { Select, Form, Button, Modal, Input, Switch } from 'antd';
import AuthService from "../../../services/auth.service";
import { UserOutlined } from '@ant-design/icons';

const FormItem = Form.Item;






export default class OfferOrderForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
       document: undefined,
       source_registr: undefined,
       email: '',
       quantity: 1.0,
       is_physic: false,
       is_exist_physic: false,
       rights: {
                 editItem: AuthService.checkAuth("MANAGER")
               }

    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeQuantity = this.onChangeQuantity.bind(this);
    this.onChangeIsPhysic = this.onChangeIsPhysic.bind(this);

    this.onSave = this.onSave.bind(this);
 }

  onChangeEmail(event){
     this.setState({email: event.target.value});
  }
  onChangeQuantity(event){
     this.setState({quantity: event.target.value});
  }
  onChangeIsPhysic(event){
     console.log(event);
     this.setState({is_physic: event});
  }

  isPhysicExist(doc)
  {
      if(doc == undefined || doc.registrs == undefined)
        return false;
      const physics = doc.registrs.find((obj)=>obj.resource_data.provider_data.name == 'Physically');
      if(physics === undefined)
         return false;
      return true;
  }
  isNotPhysicExist(doc)
  {
      if(doc == undefined || doc.registrs == undefined)
        return true;
      
      const notphysics = doc.registrs.find((obj)=>obj.resource_data.provider_data.name != 'Physically');
      if(notphysics === undefined)
         return false;
      return true;
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.data == null)
      return;

    this.setState({
       document: nextProps.data.document,
       is_exist_physic: this.isPhysicExist(nextProps.data.document),
       is_physic: !this.isNotPhysicExist(nextProps.data.document),
       quantity: 1.0,
     });

  }
  findRegistr(doc, is_physic)
  {
      if(doc == undefined || doc.registrs == undefined)
        return;

      let reg = undefined;
      if(is_physic)
        reg = doc.registrs.find((obj)=>obj.resource_data.provider_data.name == 'Physically');
      else
        reg = doc.registrs.find((obj)=>obj.resource_data.provider_data.name != 'Physically');
      if(reg == undefined)
         return;
      return reg.uuid;
  }
  onSave(){
    this.props.handleSave({source_registr: this.findRegistr(this.state.document, this.state.is_physic),
                           email: this.state.email,
                           quantity: this.state.quantity,
                          }
                       
        );
  }

  render() {
    return (
      <Modal open={this.props.show} onCancel={this.props.handleClose} onOk={this.onSave}
        footer={[
          <Button key="cancel" onClick={this.props.handleClose}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={this.onSave} disabled={!this.state.rights.editItem}>
            Create offer
          </Button>,
        ]}

      >
        <Form
           layout="vertical"
        >
          <div>
               Physically asset <Switch checked={this.state.is_physic} 
                        onChange={this.onChangeIsPhysic}
                        disabled={!this.state.is_exist_physic}
              />
              
           </div>

          <FormItem
            label="Email"
            required
          >
              <Input placeholder="Enter email" 
                 prefix={<UserOutlined />}
                 onChange={this.onChangeEmail}
                 value={this.state.email}
                 disabled={!this.state.rights.editItem}
              />
          </FormItem>

          <FormItem
            label="Quantity"
            required
          >
              <Input type="number" placeholder="Enter quantity" 
                 onChange={this.onChangeQuantity}
                 value={this.state.quantity}
                 disabled={!this.state.rights.editItem}
              />
          </FormItem>
        </Form>


      </Modal>
    );
  }


}
