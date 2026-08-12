import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params = {}) => {
  const html = env.render('supervision-package/partials/_package-creation-date.njk', { params })
  return new JSDOM(html).window.document
}

describe('_package-creation-date partial', () => {
  it('renders the created message when createdAt equals updatedAt', () => {
    const document = renderPartial({ createdAt: '2024-01-15T09:00:00', updatedAt: '2024-01-15T09:00:00' })

    const paragraph = document.querySelector('p.govuk-body')

    expect(paragraph?.textContent?.trim()).toBe('The supervision package was created on 15 January 2024.')
  })

  it('renders the created message when only createdAt is provided', () => {
    const document = renderPartial({ createdAt: '2024-01-15T09:00:00' })

    const paragraph = document.querySelector('p.govuk-body')

    expect(paragraph?.textContent?.trim()).toBe('The supervision package was created on 15 January 2024.')
  })

  it('renders the changed message when updatedAt differs from createdAt', () => {
    const document = renderPartial({ createdAt: '2024-01-15T09:00:00', updatedAt: '2024-03-20T09:00:00' })

    const paragraph = document.querySelector('p.govuk-body')

    expect(paragraph?.textContent?.trim()).toBe(
      'The supervision package was changed on 20 March 2024 and the appointment allowance was recalculated.',
    )
  })

  it('renders the changed message when only updatedAt is provided', () => {
    const document = renderPartial({ updatedAt: '2024-03-20T09:00:00' })

    const paragraph = document.querySelector('p.govuk-body')

    expect(paragraph?.textContent?.trim()).toBe(
      'The supervision package was changed on 20 March 2024 and the appointment allowance was recalculated.',
    )
  })

  it('renders nothing when neither createdAt nor updatedAt is provided', () => {
    const document = renderPartial({})

    const paragraph = document.querySelector('p.govuk-body')

    expect(paragraph).toBeNull()
  })
})
