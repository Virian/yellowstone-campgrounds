import React from 'react';
import Welcome from './welcome';
import Calendar from './calendar'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Welcome/>
        <Calendar/>
      </div>);
  }
}
