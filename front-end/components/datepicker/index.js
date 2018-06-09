import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment-timezone'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

import 'react-datepicker/dist/react-datepicker.css'

export default class Calendar extends React.Component {
  constructor(props) {
    super(props)
    moment.tz.setDefault('America/Denver');
    this.handleChange = this.handleChange.bind(this)
    this.previousWeek = this.previousWeek.bind(this)
    this.nextWeek = this.nextWeek.bind(this)
    this.goToDate = this.goToDate.bind(this)
  }

  handleChange(date) {
    this.props.setStartDate(date)
  }

  previousWeek() {
    this.props.setStartDate(this.props.startDate.subtract(1, 'week'))
    this.props.getFillTimes()
  }

  nextWeek() {
    this.props.setStartDate(this.props.startDate.add(1, 'week'))
    this.props.getFillTimes()
  }

  goToDate() {
    this.props.getFillTimes()
  }

  render() {
    return (
      <div className="datepicker row">
        <div className="pick-date">
          <DatePicker
            selected={this.props.startDate}
            onChange={this.handleChange}
            maxDate={moment().tz('America/Denver')}
            minDate={moment().year(2015).startOf('year')}
            locale="en-gb"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            todayButton={'Today'}
          />
          <Button variant="contained" color="primary" className="btn-datepicker-select" onClick={this.goToDate}>Go to selected date</Button>
        </div>
        <div className="week-navigation">
          <Button variant="contained" color="primary" className="btn-datepicker btn-datepicker-prev" onClick={this.previousWeek}>
            <Icon className="btn-datepicker-icon btn-datepicker-icon-left">arrow_back</Icon>
            previous week
          </Button>
          <Button variant="contained" color="primary" className="btn-datepicker btn-datepicker-next" onClick={this.nextWeek}>
            next week
            <Icon className="btn-datepicker-icon btn-datepicker-icon-right">arrow_forward</Icon>
          </Button>
        </div>
      </div>
    )
  }
}
