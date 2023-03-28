import React, { Component } from "react";


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
/*
    UserService.getAll().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
*/
  }

  render() {
    return (
      <div className="container">
          <center>
            <h1>Project Dashboard</h1>
            <div>mode: {process.env.NODE_ENV}</div>
             <div>API_HOST: {process.env.API_HOST}</div>
             <div>PORT: {process.env.PORT}</div>
          </center>
      </div>
    );
  }
}
