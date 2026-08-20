import { Environment } from 'nunjucks'
import { dateWithYear } from './dateWithYear'
import { govukTime } from './govukTime'
import { appointmentDateTime } from './appointmentDateTime'
import { toTitleCase } from './toTitleCase'
import { hasBreachedSentence } from './hasBreachedSentence'
import { hasRecalledSentence } from './hasRecalledSentence'
import { isEligibleForDiscretionaryAppointments } from './isEligibleForDiscretionaryAppointments'
import { finalThirdStatus } from './finalThirdStatus'
import { isInCustody } from './isInCustody'
import { isAtLarge } from './isAtLarge'
import { sentenceType } from './sentenceType'
import { getPrimarySentence } from './getPrimarySentence'

export const mpopNunjucksSetup = (env: Environment): void => {
  env.addFilter('dateWithYear', dateWithYear)
  env.addFilter('govukTime', govukTime)
  env.addFilter('appointmentDateTime', appointmentDateTime)
  env.addFilter('toTitleCase', toTitleCase)
  env.addFilter('hasBreachedSentence', hasBreachedSentence)
  env.addFilter('hasRecalledSentence', hasRecalledSentence)
  env.addFilter('isEligibleForDiscretionaryAppointments', isEligibleForDiscretionaryAppointments)
  env.addFilter('finalThirdStatus', finalThirdStatus)
  env.addFilter('isInCustody', isInCustody)
  env.addFilter('isAtLarge', isAtLarge)
  env.addFilter('sentenceType', sentenceType)
  env.addFilter('getPrimarySentence', getPrimarySentence)
}
