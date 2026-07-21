import { Environment } from 'nunjucks'
import { dateWithYear } from './dateWithYear'
import { govukTime } from './govukTime'
import { toTitleCase } from './toTitleCase'

export const mpopNunjucksSetup = (env: Environment): void => {
  env.addFilter('dateWithYear', dateWithYear)
  env.addFilter('govukTime', govukTime)
  env.addFilter('toTitleCase', toTitleCase)
}
