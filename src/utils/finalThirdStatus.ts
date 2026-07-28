import { DateTime } from 'luxon'

export type FinalThirdStatus = {
  text: 'Not started' | 'In progress' | 'Ended'
  tagClass: 'govuk-tag--blue' | 'govuk-tag--green' | 'govuk-tag--grey'
}

const ZONE = 'Europe/London'

export const finalThirdStatus = (finalThirdDate?: string, sentenceEndDate?: string): FinalThirdStatus => {
  const today = DateTime.now().setZone(ZONE).startOf('day')

  if (sentenceEndDate) {
    const endDate = DateTime.fromISO(sentenceEndDate, { zone: ZONE }).startOf('day')

    if (today >= endDate) {
      return {
        text: 'Ended',
        tagClass: 'govuk-tag--grey',
      }
    }
  }

  if (!finalThirdDate) {
    return {
      text: 'Not started',
      tagClass: 'govuk-tag--blue',
    }
  }

  const thirdDate = DateTime.fromISO(finalThirdDate, { zone: ZONE }).startOf('day')

  if (today >= thirdDate) {
    return {
      text: 'In progress',
      tagClass: 'govuk-tag--green',
    }
  }

  return {
    text: 'Not started',
    tagClass: 'govuk-tag--blue',
  }
}
