import React, { Component } from "react";
import { Select, Form, Button, Modal, Input } from 'antd';
import AuthService from "../../../services/auth.service";
import SubjectService from '../../../services/subject.service';
import SubjectSpecificationService from '../../../services/subject-specification.service';


const { TextArea } = Input;
const FormItem = Form.Item;




export default class AssetForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
       subjects: [],
       subjectspecification: [],
       uuid: undefined,
       subject: undefined,
       subject_specification: undefined,
       name:'',
       description:'',
       mime:'',
       rights: {
                 editItem: AuthService.checkAuth("MANAGER")
               }

    };
    this.onChangeSubject = this.onChangeSubject.bind(this);
    this.onChangeSubjectSpecification = this.onChangeSubjectSpecification.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSave = this.onSave.bind(this);
 }

  onChangeDescription(event){
     this.setState({description: event.target.value});
  }
   onChangeName(event){
     this.setState({name: event.target.value});
  }
  onChangeSubject(event){

     if(event !== undefined)
     {
       this.setState({subject: event.value, subject_specification:undefined, subjectspecification: []});
       this.refreshSubjectSpecification(event.value);
     }
     else
       this.setState({subject: null, subject_specification:undefined, subjectspecification: []});
  }
  onChangeSubjectSpecification(event){

     if(event !== undefined)
       this.setState({subject_specification: event.value});
     else
       this.setState({subject_specification: null});
  }
  getDefaultOptions(uuid, options, value, isDefault)
  {
     if(!options.length)
       return;
     if(uuid === undefined && !isDefault)
       return;

     const result = options.filter(obj => obj.value == value);
     return (result.length > 0)?result[0]:(isDefault?options[0]:null);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.data == null)
    {
      this.setState({uuid: undefined});
      return;
    }

    this.setState({
       uuid: nextProps.data.uuid,
       subject: nextProps.data.subject_data.uuid,
       subject_specification: nextProps.data.subject_specification_data.uuid,
       name: nextProps.data.name,
       description: nextProps.data.description,
       mime: nextProps.data.mime,
     });

  }
  onSave(){
    this.props.handleSave(this.state);
  }
  async refreshSubjects(){
    const response = await SubjectService.getList();
    if(response === undefined)
    {
       this.setState({
          subjects: [],
       });
       return;
    }
    const subjects = response.map((obj)=>{return {value:obj.uuid, label:obj.name}});
    this.setState({
          subjects: subjects,
     });
  }
  async refreshSubjectSpecification(subject){
    const response = await SubjectSpecificationService.getList(subject);
    if(response === undefined)
    {
       this.setState({
          subjectspecification: [],
       });
       return;
    }
    const createLable = (obj)=>{
       let lable = '';

       if(obj.subsubject_data.uuid !== null)
         lable += obj.subsubject_data.name;
       if(obj.subsubject_data.uuid !== null &&
          obj.person_data.uuid !== null
         )
         lable += ': ';
       if(obj.person_data.uuid !== null
         )
       {
         lable += obj.person_data.first_name;
         if(obj.person_data.middle_name !== "")
           lable += ' ' + obj.person_data.middle_name;
         lable += ' ' + obj.person_data.last_name;

       }

       lable += ' (' + obj.relation_data.name + ')';
       return lable;
    }

    const subjectspecification = response.map((obj)=>{
          return {value:obj.uuid, 
                  label:createLable(obj)
                 }
    });

    this.setState({
          subjectspecification: subjectspecification
    });
  }

  componentDidMount() {
    this.refreshSubjects();
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
            label="Representative"
          >
          <Select
            title="Representative"
            placeholder="select representative"
            value={this.getDefaultOptions(this.state.uuid, this.state.subjects, this.state.subject, false)}
            labelInValue
            onChange={this.onChangeSubject}
            options={this.state.subjects}
            disabled={!this.state.rights.editItem}
            allowClear={true}
          />
         </FormItem>
         <FormItem
            label="Author"
          >
          <Select
            title="Author"
            placeholder="select author"
            value={this.getDefaultOptions(this.state.uuid, this.state.subjectspecification, this.state.subject_specification, false)}
            labelInValue
            onChange={this.onChangeSubjectSpecification}
            options={this.state.subjectspecification}
            disabled={!this.state.rights.editItem}
            allowClear={true}
          />
         </FormItem>
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
