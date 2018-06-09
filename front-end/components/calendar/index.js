import React from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import FirebaseConfig from '../../config/firebase.config.json'
import Campgrounds from '../../config/campgrounds.json'
import moment from 'moment-timezone'
import Datepicker from '../datepicker'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Paper from '@material-ui/core/Paper'

import 'react-datepicker/dist/react-datepicker.css'

export default class Calendar extends React.Component {
  constructor(props) {
    super(props)
    firebase.initializeApp(FirebaseConfig)
    this.db = firebase.firestore()
    const settings = { timestampsInSnapshots: true }
    this.db.settings(settings)
    moment.tz.setDefault('America/Denver');
    this.state = {
      startDate: moment(),
      days: [],
      fillTimes: {}
    }
  }

  componentDidMount() {
    this.getFillTimes()
  }

  getFillTimes() {
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
          days: days
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  setStartDate(startDate) {
    this.setState({
      startDate: startDate
    })
  }

  render() {
    const { fillTimes, days } = this.state
    return (
      <div className="calendar container">
        <Datepicker
          startDate={this.state.startDate}
          setStartDate={(startDate) => this.setStartDate(startDate)}
          getFillTimes={() => this.getFillTimes()}
        />
        <div className="row table-container">
          <Paper>
          <Table className="calendar-table">
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
          </Paper>
        </div>
      </div>
    )
  }
}
