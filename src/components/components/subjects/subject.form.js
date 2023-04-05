import React, { Component } from "react";
import { Select, Form, Button, Modal, Input, Checkbox } from 'antd';
import AuthService from "../../../services/auth.service";
import SubjectTypeService from '../../../services/subject-type.service';



const FormItem = Form.Item;




export default class SubjectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subjecttypes: [],
      uuid: this.props.data !== null?this.props.data.uuid:'',
      name: this.props.data !== null?this.props.data.name:'',
      show_main: this.props.data !== null?this.props.data.show_main:false,
      order: this.props.data !== null?this.props.data.order:undefined,
      subject_type: this.props.data !== null?this.props.data.subject_type_data.uuid:'',
     
      rights: {
                 editItem: AuthService.checkAuth("MANAGER")
              }

    };
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeSubjectType = this.onChangeSubjectType.bind(this);
    this.onChangeShowMain = this.onChangeShowMain.bind(this);
    this.onChangeOrder = this.onChangeOrder.bind(this);

    this.onSave = this.onSave.bind(this);
 }

  onChangeName(event){
     this.setState({name: event.target.value});
  }
  onChangeSubjectType(event){

     this.setState({subject_type: event.value});
  }

  onChangeShowMain(event){
     this.setState({show_main: event.target.checked});
  }
  onChangeOrder(event){
     this.setState({order: event.target.value});
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
        subject_type: nextProps.data !== null?this.getDefaultOptions('', this.state.subjecttypes, nextProps.data.subject_type_data.uuid, true).value:this.state.subject_type,
        show_main: nextProps.data !== null?nextProps.data.show_main:false,
        order: nextProps.data !== null?nextProps.data.order:undefined,
     });

  }
  onSave(){
    this.props.handleSave(this.state);
  }
  async refreshSubjectType(){
    const response = await SubjectTypeService.getList();
    if(response === undefined)
    {
       this.setState({
          subjecttypes: [],
       });
       return;
    }
    const subjecttypes = response.map((obj)=>{return {value:obj.uuid, label:obj.name}});
    this.setState({
          subjecttypes: subjecttypes,
          subject_type: this.state.subject_type == ''?subjecttypes[0].value:this.state.subject_type
     });
  }
  componentDidMount() {
    this.refreshSubjectType();
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
            value={this.getDefaultOptions(this.state.uuid, this.state.subjecttypes, this.state.subject_type, true)}
            labelInValue
            onChange={this.onChangeSubjectType}
            options={this.state.subjecttypes}
            disabled={!this.state.rights.editItem}
          />
       </FormItem>
       <div>
          <Checkbox checked={this.state.show_main} 
                    onChange={this.onChangeShowMain}
          >
              Show on main page
          </Checkbox>
       </div>
{
     this.state.show_main && (
          <FormItem
            label="Order"
            required
          >
              <Input type="number" placeholder="Enter order" 
                 onChange={this.onChangeOrder}
                 value={this.state.order}
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
