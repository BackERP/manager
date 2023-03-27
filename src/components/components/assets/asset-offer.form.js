import React, { Component } from "react";
import { Select, Form, Button, Modal, Input, Checkbox } from 'antd';
import AuthService from "../../../services/auth.service";


const FormItem = Form.Item;




export default class AssetOfferForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
       assetResource: undefined,
       provider_data: undefined,
       price: 0.0,
       quantity: 1000.0,
       is_physic: false,
       price_physic:30000.0,

       rights: {
                 editItem: AuthService.checkAuth("MANAGER")
               }

    };
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeQuantity = this.onChangeQuantity.bind(this);
    this.onChangeIsPhysic = this.onChangeIsPhysic.bind(this);
    this.onChangePricePhysic = this.onChangePricePhysic.bind(this);
    this.onSave = this.onSave.bind(this);
 }

  onChangePrice(event){
     this.setState({price: event.target.value});
  }
  onChangeQuantity(event){
     this.setState({quantity: event.target.value});
  }
  onChangeIsPhysic(event){
     this.setState({is_physic: event.target.checked});
  }
  onChangePricePhysic(event){
     this.setState({price_physic: event.target.checked});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.data == null)
      return;


    this.setState({
       assetResource: nextProps.data.assetResource,
       provider_data: nextProps.data.provider_data,
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
            Create offer
          </Button>,
        ]}

      >
        <Form
           layout="vertical"
        >
          <FormItem
            label="Price"
            required
          >
              <Input type="number" placeholder="Enter price" 
                 onChange={this.onChangePrice}
                 value={this.state.price}
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
          <div>
               <Checkbox checked={this.state.is_physic} 
                        onChange={this.onChangeIsPhysic}
              >
              Include physically asset
              </Checkbox>
           </div>
{
          this.state.is_physic && (
          <FormItem
            label="Physical asset price"
            required
          >
              <Input type="number" placeholder="Enter price" 
                 onChange={this.onChangePricePhysic}
                 value={this.state.price_physic}
                 disabled={!this.state.rights.editItem}
              />
          </FormItem>
        )
}
        </Form>


      </Modal>
    );
  }


}
