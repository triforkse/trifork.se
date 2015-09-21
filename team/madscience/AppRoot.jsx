import React from 'react';
const client = require('../lib/ajax.jsx');
const {RouteHandler} = require('react-router');

export default class AppRoot extends React.Component {
  constructor() {
    super();

    this.state = {
      employees: null
    };

    client.getAllEmployees(data => this.setState({employees: data}));
  }

  render() {
    const employees = this.state.employees;
    console.log(employees);
    if (employees) {
      return <RouteHandler employees={employees} />
    }
    else {
      return <div>Loading...</div>
    }
  }
}
