import { DateTime } from 'luxon'
import { isBlank } from './isBlank'
import { govukTime } from './govukTime'

export const dateWithYear = (datetimeString: string, showTime = false): string | null => {
  if (!datetimeString || isBlank(datetimeString)) return null

  const dt = DateTime.fromISO(datetimeString, { zone: 'Europe/London' })
  if (!dt.isValid) return null

  const time = showTime ? govukTime(datetimeString) : null
  return `${dt.toFormat('d MMMM yyyy')}${time ? ` at ${time}` : ''}`
}

export const dateToLongDate = (dmyDate: string): string | null => {
  if (!dmyDate || isBlank(dmyDate)) return null
  const dt = DateTime.fromFormat(dmyDate, 'dd/MM/yyyy')
  if (!dt.isValid) return dmyDate
  if (dt > DateTime.now()) return null
  return dt.toFormat('d MMMM yyyy')
}

export const dateWithYearTimeFirst = (datetimeString: string): string => {
  if (!datetimeString || isBlank(datetimeString)) return ''

  const dt = DateTime.fromISO(datetimeString, { zone: 'Europe/London' })
  if (!dt.isValid) return ''

  const time = govukTime(datetimeString)
  return time ? `${time} ${dt.toFormat('d MMMM yyyy')}` : dt.toFormat('d MMMM yyyy')
}
