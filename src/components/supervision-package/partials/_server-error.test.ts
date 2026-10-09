import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = () => {
  const html = env.render('supervision-package/partials/_server-error.njk')
  return new JSDOM(html).window.document
}

describe('_server-error partial', () => {
  it('renders the supervision package heading', () => {
    const document = renderPartial()

    expect(document.querySelector('.supervision-package h3')?.textContent?.trim()).toBe('Supervision package')
  })

  it('renders the unavailable status badge', () => {
    const document = renderPartial()

    expect(document.querySelector('.app-status-badge')?.textContent?.trim()).toBe('Unavailable')
  })

  it('renders the warning text', () => {
    const document = renderPartial()

    const warningText = document.querySelector('.govuk-warning-text__text')?.textContent ?? ''
    expect(warningText).toContain('Warning')
    expect(warningText).toContain(
      'Supervision package information is currently unavailable while the package is being recalculated.',
    )
  })
})
