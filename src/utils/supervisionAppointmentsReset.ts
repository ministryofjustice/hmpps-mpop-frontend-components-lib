import { DateTime } from 'luxon'
import { FrontendSentence } from '../types/SupervisionPackage'
import { getPrimarySentence } from './getPrimarySentence'

export const supervisionAppointmentsReset = (
  currentYearEndDate: string,
  sentences: Array<FrontendSentence>,
): boolean => {
  const primarySentence = getPrimarySentence(sentences)

  if (!primarySentence?.endDate) {
    return false
  }

  const yearEndDate = DateTime.fromISO(currentYearEndDate).startOf('day')
  const sentenceEndDate = DateTime.fromISO(primarySentence.endDate).startOf('day')

  return sentenceEndDate > yearEndDate
}
