import { DateTime } from 'luxon'

export type FinalThirdStatus = {
  text: 'Not Started' | 'In Progress' | 'Ended'
  tagClass: 'govuk-tag--blue' | 'govuk-tag--green' | 'govuk-tag--grey'
}

export const finalThirdStatus = (
  finalThirdDate?: string,
  sentenceEndDate?: string,
): FinalThirdStatus => {
  const today = DateTime.now().startOf('day')

  if (sentenceEndDate) {
    const endDate = DateTime.fromISO(sentenceEndDate).startOf('day')

    if (today >= endDate) {
      return {
        text: 'Ended',
        tagClass: 'govuk-tag--grey',
      }
    }
  }

  if (!finalThirdDate) {
    return {
      text: 'Not Started',
      tagClass: 'govuk-tag--blue',
    }
  }

  const thirdDate = DateTime.fromISO(finalThirdDate).startOf('day')

  if (today >= thirdDate) {
    return {
      text: 'In Progress',
      tagClass: 'govuk-tag--green',
    }
  }

  return {
    text: 'Not Started',
    tagClass: 'govuk-tag--blue',
  }
}