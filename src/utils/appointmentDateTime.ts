import { DateTime } from 'luxon'
import { isBlank } from './isBlank'
import { govukTime } from './govukTime'

export const appointmentDateTime = (date: string, startTime: string): string | null => {
  if (!date || isBlank(date) || !startTime || isBlank(startTime)) return null

  const dt = DateTime.fromISO(date, { zone: 'Europe/London' })
  if (!dt.isValid) return null

  const time = govukTime(`${date}T${startTime}`)
  if (!time) return null

  return `${dt.toFormat('cccc d MMM')} at ${time}`
}
