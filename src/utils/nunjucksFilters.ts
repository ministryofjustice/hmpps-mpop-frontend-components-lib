import { Environment } from 'nunjucks'
import { dateWithYear } from './dateWithYear'
import { govukTime } from './govukTime'
import { toTitleCase } from './toTitleCase'
import { hasBreachedSentence } from './hasBreachedSentence'
import { isEligibleForDiscretionaryAppointments } from './isEligibleForDiscretionaryAppointments'
import { finalThirdStatus } from './finalThirdStatus'

export const mpopNunjucksSetup = (env: Environment): void => {
  env.addFilter('dateWithYear', dateWithYear)
  env.addFilter('govukTime', govukTime)
  env.addFilter('toTitleCase', toTitleCase)
  env.addFilter('hasBreachedSentence', hasBreachedSentence)
  env.addFilter('isEligibleForDiscretionaryAppointments', isEligibleForDiscretionaryAppointments)
  env.addFilter('finalThirdStatus', finalThirdStatus)
}
