import { Environment } from 'nunjucks'
import { dateWithYear } from './dateWithYear'
import { govukTime } from './govukTime'
import { appointmentDateTime } from './appointmentDateTime'
import { toTitleCase } from './toTitleCase'
import { hasTerminatedSentence } from './hasTerminatedSentence'
import { hasRestrictedCustodyStatus } from './hasRestrictedCustodyStatus'
import { isUnlawfullyAtLarge } from './isUnlawfullyAtLarge'
import { isRecalled } from './isRecalled'
import { isEligibleForDiscretionaryAppointments } from './isEligibleForDiscretionaryAppointments'
import { finalThirdStatus } from './finalThirdStatus'
import { sentenceType } from './sentenceType'
import { getPrimarySentence } from './getPrimarySentence'
import { supervisionAppointmentsReset } from './supervisionAppointmentsReset'
import { spaceOutChars } from './spaceOutChars'
import { formatName } from './formatName'

export const mpopNunjucksSetup = (env: Environment): void => {
  env.addFilter('dateWithYear', dateWithYear)
  env.addFilter('govukTime', govukTime)
  env.addFilter('appointmentDateTime', appointmentDateTime)
  env.addFilter('toTitleCase', toTitleCase)
  env.addFilter('hasTerminatedSentence', hasTerminatedSentence)
  env.addFilter('hasRestrictedCustodyStatus', hasRestrictedCustodyStatus)
  env.addFilter('isUnlawfullyAtLarge', isUnlawfullyAtLarge)
  env.addFilter('isRecalled', isRecalled)
  env.addFilter('isEligibleForDiscretionaryAppointments', isEligibleForDiscretionaryAppointments)
  env.addFilter('finalThirdStatus', finalThirdStatus)
  env.addFilter('sentenceType', sentenceType)
  env.addFilter('getPrimarySentence', getPrimarySentence)
  env.addFilter('supervisionAppointmentsReset', supervisionAppointmentsReset)
  env.addFilter('spaceOutChars', spaceOutChars)
  env.addFilter('formatName', formatName)
}
