import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'

const env = nunjucks.configure(
  ['src/components', 'node_modules/govuk-frontend/dist', 'node_modules/@ministryofjustice/frontend'],
  { autoescape: true },
)

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "person-header-errors/macro.njk" import personHeaderErrors %}
     {{ personHeaderErrors(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

const messages = (document: Document) =>
  Array.from(document.querySelectorAll('[data-qa="headerErrors"] li, [data-qa="headerErrors"] p')).map(el =>
    el.textContent?.trim(),
  )

describe('person-header-errors', () => {
  it('renders nothing when nothing is unavailable', () => {
    const document = renderComponent({ throughcareUnavailable: undefined })

    expect(document.querySelector('[data-qa="headerErrors"]')).toBeNull()
  })

  it.each([
    [{ statusUnavailable: true }, 'Status information is currently unavailable.'],
    [{ photoUnavailable: true }, 'Photo is currently unavailable.'],
    [{ throughcareUnavailable: 'some' }, 'Some throughcare information is currently unavailable.'],
    [{ throughcareUnavailable: 'all' }, 'Throughcare information is currently unavailable.'],
    [{ arnsUnavailable: true }, 'Risk information from the ARNS service is currently unavailable.'],
  ])('renders a single message for %o', (params, message) => {
    const document = renderComponent(params)

    const alert = document.querySelector('[data-qa="headerErrors"]')
    expect(alert?.classList.contains('moj-alert--error')).toBe(true)
    expect(alert?.textContent).toContain('There is a problem')
    expect(alert?.querySelector('ul')).toBeNull()
    expect(messages(document)).toEqual([message])
  })

  it('renders several messages as a bulleted list', () => {
    const document = renderComponent({
      statusUnavailable: true,
      photoUnavailable: true,
      throughcareUnavailable: 'some',
      arnsUnavailable: true,
    })

    expect(document.querySelector('[data-qa="headerErrors"] ul.govuk-list--bullet')).not.toBeNull()
    expect(messages(document)).toEqual([
      'Risk information from the ARNS service is currently unavailable.',
      'Photo is currently unavailable.',
      'Status information is currently unavailable.',
      'Some throughcare information is currently unavailable.',
    ])
  })
})
