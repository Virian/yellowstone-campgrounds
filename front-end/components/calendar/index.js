import React from 'react'
import DatePicker from 'react-datepicker'
import * as firebase from 'firebase'
import FirebaseConfig from '../../config/firebase.config.json'
import Campgrounds from '../../config/campgrounds.json'
import moment from 'moment-timezone'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Icon from '@material-ui/core/Icon'

import 'react-datepicker/dist/react-datepicker.css'

export default class Calendar extends React.Component {
  constructor(props) {
    super(props)
    firebase.initializeApp(FirebaseConfig)
    this.db = firebase.firestore()
    const settings = {timestampsInSnapshots: true}
    this.db.settings(settings)
    moment.tz.setDefault('America/Denver');
    this.state = {
      startDate: moment(),
      earliestDate: moment(),
      latestDate: moment(),
      days: [],
      fillTimes: {}
    }
    this.handleChange = this.handleChange.bind(this)
    this.previousWeek = this.previousWeek.bind(this)
    this.nextWeek = this.nextWeek.bind(this)
    this.goToDate = this.goToDate.bind(this)
  }

  componentDidMount() {
    this.initFillTimes()
  }

  initFillTimes() {
    const earliestDate = moment(this.state.startDate).startOf('isoWeek').startOf('day')
    const latestDate = moment(this.state.startDate).endOf('isoWeek').endOf('day')
    let dateIterator = moment(earliestDate)
    let fillTimes = {}
    let days = []

    while (latestDate.isAfter(dateIterator, 'day') || latestDate.isSame(dateIterator, 'day')) {
      days.push(moment(dateIterator).format('ddd, DD MMM YYYY'))
      dateIterator.add(1, 'day')
    }

    this.db.collection('campgrounds').where('fillTime', '>', earliestDate.unix()).where('fillTime', '<', latestDate.unix())
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const fillTime = moment.unix(doc.data().fillTime).tz('America/Denver')
          let campgroundFillTime = {}
          campgroundFillTime[doc.data().id] = fillTime.format('hh:mm A')
          fillTimes[fillTime.format('ddd, DD MMM YYYY')] = fillTimes[fillTime.format('ddd, DD MMM YYYY')] || {}
          fillTimes[fillTime.format('ddd, DD MMM YYYY')][doc.data().id] = fillTime.format('hh:mm A')
        })
        this.setState({
          fillTimes: fillTimes,
          earliestDate: earliestDate,
          latestDate: latestDate,
          days: days
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  handleChange(date) {
    this.setState({
      startDate: date
    })
  }

  previousWeek() {
    this.setState({
      startDate: this.state.startDate.subtract(1, 'week')
    })
    this.initFillTimes()
  }

  nextWeek() {
    this.setState({
      startDate: this.state.startDate.add(1, 'week')
    })
    this.initFillTimes()
  }

  goToDate() {
    this.initFillTimes()
  }

  render() {
    const { fillTimes, days } = this.state
    return (
      <div className="calendar container">
        <div className="datepicker row">
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
            maxDate={moment().tz('America/Denver')}
            minDate={moment().year(2015).startOf('year')}
            locale="en-gb"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            todayButton={'Today'}
          />
          <Button variant="contained" color="primary" className="btn-datepicker" onClick={this.goToDate}>Go to selected date</Button>
          <Button variant="contained" color="primary" className="btn-datepicker" onClick={this.previousWeek}>
            <Icon className="btn-datepicker-icon btn-datepicker-icon-left">arrow_back</Icon>
            previous week
          </Button>
          <Button variant="contained" color="primary" className="btn-datepicker" onClick={this.nextWeek}>
            next week
            <Icon className="btn-datepicker-icon btn-datepicker-icon-right">arrow_forward</Icon>
          </Button>
        </div>
        <div className="row table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Campground</TableCell>
                {
                  days.map((day) => {
                    return (
                      <TableCell key={day + '_col'}>{day}</TableCell>
                    )
                  })
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Campgrounds.map(campground => {
                  return (
                    <TableRow key={campground.npmap_id}>
                      <TableCell key={campground.npmap_id + '_name'}>{campground.name}</TableCell>
                      {
                        days.map(day => {
                          return (
                            <TableCell key={campground.npmap_id + day}>
                              {fillTimes[day] && fillTimes[day][campground.npmap_id] ? fillTimes[day][campground.npmap_id] : '-'}
                            </TableCell>
                          )
                        })
                      }
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}
