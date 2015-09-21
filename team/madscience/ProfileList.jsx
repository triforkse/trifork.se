import React from 'react';
const {Link} = require('react-router');

require('../team.css');

export default class ProfileList extends React.Component {
  render() {
    const employees = this.props.employees;

    if (employees) {
      return (
        <div style={{textAlign: 'center', width: 900, margin: '50px auto 0'}}>
          <img src="/img/science-logo.jpg" alt="" />
          <h1>Mad Science</h1>
          <div>
            The tool for <b>finding the right person for the job</b><br/>
            and <b>the right job for the person</b>
          </div>
          <ul style={{listStyleType: 'none'}}>
            {employees.map(e => (
              <li key={e.id}>
                <Link to="profile" params={{id: e.id}}>
                  {e.firstname + " " + e.lastname}
                </Link>
              </li>))}
          </ul>
        </div>
      );
    }
    else {
      return <div>Loading...</div>;
    }
  }
}
