import React, { Component } from "react";
import { Select, Form, Button, Modal, Input } from 'antd';
import AuthService from "../../../services/auth.service";
import SubjectTypeService from '../../../services/subject-type.service';
import SubjectService from '../../../services/subject.service';
import PersonService from '../../../services/person.service';
import TypeRelationService from '../../../services/type-relation.service';




const { TextArea } = Input;
const FormItem = Form.Item;




export default class SubjectRelationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
       typerelations: [],
       subjects: [],
       persons: [],

       uuid: '',
       subject: '',
       subsubject: undefined,
       person: undefined,
       relation: '',
       description: '',
     
      rights: {
                 editItem: AuthService.checkAuth("MANAGER")
              }

    };
    this.onChangeSubSubject = this.onChangeSubSubject.bind(this);
    this.onChangePerson = this.onChangePerson.bind(this);
    this.onChangeRelation = this.onChangeRelation.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSave = this.onSave.bind(this);
 }

  onChangeDescription(event){
     this.setState({description: event.target.value});
  }
  onChangeSubSubject(event){

     if(event !== undefined)
       this.setState({subsubject: event.value});
     else
       this.setState({subsubject: null});
  }
  onChangePerson(event){
     if(event !== undefined)
        this.setState({person: event.value});
     else
        this.setState({person: null});

  }
  onChangeRelation(event){

     this.setState({relation: event.value});
  }


  getDefaultOptions(uuid, options, value, isDefault)
  {
     if(uuid == '' && !isDefault)
       return;

     const result = options.filter(obj => obj.value == value);
     return (result.length > 0)?result[0]:(isDefault?options[0]:null);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.data == null)
      return;
//    const subsubject = this.getDefaultOptions(nextProps.data.uuid, this.state.subjects, nextProps.data.subsubject_data.uuid, false).value;
//    const person = this.getDefaultOptions(nextProps.data.uuid, this.state.persons, nextProps.data.person_data.uuid, false).value;
    const relation = this.getDefaultOptions(nextProps.data.uuid, this.state.typerelations, nextProps.data.relation_data.uuid, true).value;


    this.setState({
       uuid: nextProps.data.uuid,
       subject: nextProps.data.subject,
       subsubject: nextProps.data.subsubject_data.uuid,
       person: nextProps.data.person_data.uuid,
       relation: relation,
       description: nextProps.data.description,
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
  async refreshPersons(){
    const response = await PersonService.getList();
    if(response === undefined)
    {
       this.setState({
          persons: [],
       });
       return;
    }
    const persons = response.map((obj)=>{return {value:obj.uuid, label:obj.first_name + ' ' + obj.middle_name + (obj.middle_name != ''?' ':'') + obj.last_name}});
    this.setState({
          persons: persons,
     });
  }
  async refreshTypeRelations(){
    const response = await TypeRelationService.getList();
    if(response === undefined)
    {
       this.setState({
          typerelations: [],
       });
       return;
    }
    const typerelations = response.map((obj)=>{return {value:obj.uuid, label:obj.name}});
    this.setState({
          typerelations: typerelations,
     });
  }

  componentDidMount() {
    this.refreshSubjects();
    this.refreshPersons();
    this.refreshTypeRelations();
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
{
         <FormItem
            label="Subject"
          >
          <Select
            title="Subject"
            placeholder="select subject"
            value={this.getDefaultOptions(this.state.uuid, this.state.subjects, this.state.subsubject, false)}
            labelInValue
             onChange={this.onChangeSubSubject}
            options={this.state.subjects}
            disabled={!this.state.rights.editItem}
            allowClear={true}
          />
       </FormItem>
}
       <FormItem
            label="Person"
          >
          <Select
            title="Person"
            placeholder="select person"
            value={this.getDefaultOptions(this.state.uuid, this.state.persons, this.state.person, false)}
            labelInValue
            value={this.state.person}
            onChange={this.onChangePerson}
            options={this.state.persons}
            disabled={!this.state.rights.editItem}
            allowClear={true}
          />
       </FormItem>
       <FormItem
            label="Relation"
          >
          <Select
            title="Relation"
            placeholder="select relation"
            value={this.getDefaultOptions(this.state.uuid, this.state.typerelations, this.state.relation, true)}
            labelInValue
            onChange={this.onChangeRelation}
            options={this.state.typerelations}
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
