import { DateTime } from 'luxon'
import { FrontendSentence } from '../types/SupervisionPackage'

export const supervisionAppointmentsReset = (
  currentYearEndDate: string,
  sentence?: FrontendSentence | false | null,
): boolean => {
  if (!sentence || !sentence.endDate) {
    return false
  }

  const yearEndDate = DateTime.fromISO(currentYearEndDate).startOf('day')
  const sentenceEndDate = DateTime.fromISO(sentence.endDate).startOf('day')

  return sentenceEndDate > yearEndDate
}
