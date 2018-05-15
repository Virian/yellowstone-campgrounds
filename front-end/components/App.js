import React from 'react';
import RestClient from '../common/restClient';
import Welcome from './welcome';

export default class App extends React.Component {
  componentDidMount() {
    this.fetch();
  }

  fetch() {
    RestClient.getTestPath().then(response => {
      console.log(response);
    });
  }

  render() {
    return (
      <div>
        <Welcome/>
      </div>);
  }
}
