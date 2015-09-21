import React from 'react';
const _ = require('lodash');
const {Link} = require('react-router');

class Meter extends React.Component {
  render() {
    const styles = {
      wrapper: {
        display: 'flex',
        alignItems: 'center'
      },
      num: {
        marginRight: 10,
        textAlign: 'right',
        width: 22
      },
      container: {
        border: 'solid 1px #CFCFCF',
        backgroundColor: '#FEFEFE',
        height: 10,
        width: 100
      },
      bar: {
        height: 10
      }
    };

    const colors = [
      '#FF0000',
      '#FF5500',
      '#FF9900',
      '#FFCC00',
      '#FFFF00',
      '#CCFF00',
      '#99FF00',
      '#55FF00',
      '#00FF00',
      '#00CC00'
    ]

    const v = this.props.value;

    const barStyle = styles.bar;
    barStyle.width = (v / 10 * 100);
    barStyle.backgroundColor = colors[v - 1];

    return <div style={styles.wrapper}>
      <div style={styles.num}>{v}</div>
      <div style={styles.container}>
        <div style={barStyle}></div>
      </div>
    </div>;
  }
}

export default class ProfilePage extends React.Component {
  render() {
    const employees = this.props.employees;
    const e = _.find(employees, e => e.id === this.props.params.id);

    const order = this.props.query.sort || 'name';

    let tech = _.sortBy(e.technologies, t => {
      const value = t[order];
      if (typeof value === 'string') return ("" + value).toLowerCase()
      else return (value !== null) ? value : -1;
    });

    const sortDirection = this.props.query.direction || 'dsc';
    if (sortDirection === 'dsc') {
      tech.reverse();
    }

    const makeLink = (title, property) => {
      const direction = (order === property && sortDirection !== 'asc') ? 'asc' : 'dsc';
      return <Link to="profile" params={{id: e.id}} query={{direction, sort: property}}>{title}</Link>
    };

    return (
      <div>
      <h1>{e.firstname} {e.lastname}</h1>
      <div>
        <div>
          Values are individual. One person's 10 in proficiency may be another person's
          5 value. It is the individual's own oppinion of how comfortable, skilled and
          experienced he feels with the technology.
        </div>
        <ul>
          <li><b>Last Use</b> = What year you last used / looked at the topic.</li>
          <li><b>Interest</b> = How much would the person would like to work with the topic.</li>
          <li><b>Profeciency</b> = How skilled does the peoson think he is with the topic. (Not directly comparable to other profiles)</li>
          <li><b>Would Teach</b> = Is the person interested in teaching the topic - given enough time to research, skill up and prepare.</li>
        </ul>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>{makeLink('Technology', 'name')}</th>
              <th>{makeLink('Last Use', 'last_use')}</th>
              <th>{makeLink('Interest', 'interest')}</th>
              <th>{makeLink('Profeciency', 'experience')}</th>
              <th>{makeLink('Will Teach', 'teach')}</th>
            </tr>
          </thead>
          <tbody>
            {tech.map(t => (
              <tr key={t.name}>
                <td>{t.name}</td>
                <td>{t.last_use || '-'}</td>
                <td><Meter value={t.interest} /></td>
                <td><Meter value={t.experience} /></td>
                <td style={{textAlign: "center"}}>{t.teach && '✓'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    );
  }
}
