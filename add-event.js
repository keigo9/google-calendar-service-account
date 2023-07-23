const { google } = require('googleapis')
require('dotenv').config()

const SCOPES = 'https://www.googleapis.com/auth/calendar.events'
const GOOGLE_PRIVATE_KEY = require('./service-account-key.json').private_key
const GOOGLE_CLIENT_EMAIL = require('./service-account-key.json').client_email
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID

const jwtClient = new google.auth.JWT(GOOGLE_CLIENT_EMAIL, null, GOOGLE_PRIVATE_KEY, SCOPES)

const calendar = google.calendar({
  version: 'v3',
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
})

const eventData = {
  summary: "サマリー",
  description: "hello",
  allDayEvent: true,
  start: {
    date: "2023-07-23"
    //dateTime: "2023-05-03T18:03:58+02:00"
  },
  end: {
    // endDate: +1 is needed
    date: "2023-07-25"
    //dateTime: "2023-05-03T18:03:58+02:00"
  },
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'popup', 'minutes': 540 }
    ]
  }
}

const main = () => {
  // 現在以降の最新10件のイベントを取得
  calendar.events.insert(
    {
      calendarId: GOOGLE_CALENDAR_ID,
      resource: eventData,
    },
    (error, result) => {
      if (error) {
        console.log(error)
      } else {
        if (result.data) {
          console.log(result.data)
          //console.log(result.data.items.map((item) => console.log(item)))
          //console.log(result.data.items.filter((item) => !item.description?.includes("Pay")))
        } else {
          console.log('No upcoming events found.')
        }
      }
    }
  )
}

main();