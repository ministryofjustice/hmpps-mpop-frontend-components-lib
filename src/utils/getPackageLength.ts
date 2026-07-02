import { DateTime } from 'luxon'

export const gestPackageLength = (startDate: string, endDate: string): number => {
  const start = DateTime.fromISO(startDate)
  const end = DateTime.fromISO(endDate)
  return Math.round(end.diff(start, 'months').months)
}
