import { Environment } from 'nunjucks'
import { dateWithYear } from './dateWithYear'
import { toTitleCase } from './toTitleCase'

export const mpopNunjucksSetup = (env: Environment): void => {
  env.addFilter('dateWithYear', dateWithYear)
  env.addFilter('toTitleCase', toTitleCase)
}
