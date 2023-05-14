const { google } = require('googleapis')
require('dotenv').config()

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'
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

const main = () => {
  // 現在以降の最新10件のイベントを取得
  calendar.events.list(
    {
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    },
    (error, result) => {
      if (error) {
        console.log(error)
      } else {
        if (result.data.items.length) {
          console.log(result.data.items.map((item) => console.log(item)))
        } else {
          console.log('No upcoming events found.')
        }
      }
    }
  )
}

main();