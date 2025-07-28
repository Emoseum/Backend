// utils/time.js
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

export const toAustriaTime = (date) => {
  return dayjs(date).tz('Europe/Vienna').format('YYYY-MM-DD HH:mm')
}

export const toAustriaISO = (date) => {
  return dayjs(date).tz('Europe/Vienna').toISOString()
}

export const isTodayInAustria = (date) => {
  const now = dayjs().tz('Europe/Vienna')
  const target = dayjs(date).tz('Europe/Vienna')
  return now.isSame(target, 'day')
}