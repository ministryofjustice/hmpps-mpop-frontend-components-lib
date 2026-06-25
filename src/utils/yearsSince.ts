import { DateTime } from 'luxon'
import { isBlank } from './isBlank'

export const yearsSince = (datetimeString: string): string | null => {
  if (!datetimeString || isBlank(datetimeString)) return null

  const dt = DateTime.fromISO(datetimeString, { zone: 'Europe/London' })
  if (!dt.isValid) return null
  const years = Math.trunc(DateTime.now().diff(dt, ['years', 'months']).years)
  return years.toString()
}
