import React from 'react'
import DatePicker from 'react-datepicker'
import * as firebase from 'firebase'
import FirebaseConfig from '../../config/firebase.config.json'
import Campgrounds from '../../config/campgrounds.json'
import moment from 'moment-timezone'
import axios from 'axios'

import 'react-datepicker/dist/react-datepicker.css'

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

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
    this.handleClick = this.handleClick.bind(this)
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
      days.push(moment(dateIterator).format('DD MMM YYYY'))
      dateIterator.add(1, 'day')
    }

    this.db.collection('campgrounds').where('fillTime', '>', earliestDate.unix()).where('fillTime', '<', latestDate.unix())
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const fillTime = moment.unix(doc.data().fillTime).tz('America/Denver')
          let campgroundFillTime = {}
          campgroundFillTime[doc.data().id] = fillTime.format('hh:mm A')
          fillTimes[fillTime.format('DD MMM YYYY')] = fillTimes[fillTime.format('DD MMM YYYY')] || {}
          fillTimes[fillTime.format('DD MMM YYYY')][doc.data().id] = fillTime.format('hh:mm A')
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

  handleClick() {
    /*const date1 = moment('2016-06-22T14:50:00Z').unix()
    const date2 = moment('2016-06-25T14:58:00Z').unix()
    this.db.collection('test_camp').where('date', '>', date1).where('date', '<', date2)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(moment.unix(doc.data().date).tz('America/Denver').format('YYYY/MM/DD<br/> HH:mm'))
        })
      })
      .catch(error => {
        console.error(error)
      })*/
    /*console.log(moment('2016-06-20T14:51:00Z').tz('America/Denver').toDate())
    this.db.collection('test_camp').add({
      date: moment('2016-06-21T14:51:00Z').unix()
    })*/
  }

  goToDate() {
    this.initFillTimes()
  }

  render() {
    const { fillTimes, days } = this.state
    return (
      <div className="calendar container">
        {/*<div className="row">
          <span className="btn btn-primary btn-select-date" onClick={this.handleClick}>Test!</span>
        </div>*/}
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
          <span className="btn btn-primary btn-select-date" onClick={this.goToDate}>Go to selected date</span>
        </div>
        <div className="row">
          <ul className="camp-names">
            {
              Campgrounds.map(campground => {
                return (
                  <li className="campground-name" key={campground.npmap_id}>
                    {campground.name}
                  </li>
                )
              })
            }
          </ul>
          <div className="camp-fill-times-wrapper">
            <div className="camp-fill-times">
              {
                days.map(day => {
                  return (
                    <ul className="fill-times-day-column" key={day + '_col'}>
                      <li className="fill-time" key={day}>
                        {day}
                      </li>
                      {
                        Campgrounds.map((campground) => {
                          return (
                            <li className="fill-time" key={day + campground.npmap_id}>
                              {
                                fillTimes[day] && fillTimes[day][campground.npmap_id] ? fillTimes[day][campground.npmap_id] : '-'
                              }
                            </li>
                          )
                        })
                      }
                    </ul>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
