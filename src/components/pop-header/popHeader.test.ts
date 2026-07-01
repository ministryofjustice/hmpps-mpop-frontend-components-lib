import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { yearsSince } from '../../utils/yearsSince'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "pop-header/macro.njk" import popHeader %}
     {{ popHeader(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

describe('pop-header', () => {
  it('renders the CRN', () => {
    const document = renderComponent({ crn: 'X123456', dob: '', tierScore: '', historyHref: '#' })

    expect(document.querySelector('[data-qa="crn"]')?.textContent?.trim()).toBe('X123456')
  })

  it('renders the date of birth', () => {
    const document = renderComponent({ crn: 'X123456', dob: '1990-05-15', tierScore: '', historyHref: '#' })

    expect(document.querySelector('[data-qa="headerDateOfBirthValue"]')?.textContent?.trim()).toBe('1990-05-15')
  })

  it('renders the calculated age from the date of birth', () => {
    const age = yearsSince('1990-05-15')
    const document = renderComponent({ crn: 'X123456', dob: '1990-05-15', age, tierScore: '', historyHref: '#' })

    expect(document.querySelector('[data-qa="headerDateOfBirthAge"]')?.textContent?.trim()).toBe(`${age} years old`)
  })

  it('renders the tier score as a link', () => {
    const document = renderComponent({ crn: 'X123456', dob: '', tierScore: 'B2', historyHref: '#' })

    const link = document.querySelector('[data-qa="tierLink"]')
    expect(link?.textContent?.trim()).toBe('B2')
  })

  it('renders the history href on the tier link', () => {
    const document = renderComponent({ crn: 'X123456', dob: '', tierScore: 'A1', historyHref: '/tier-history/X123456' })

    expect(document.querySelector('[data-qa="tierLink"]')?.getAttribute('href')).toBe('/tier-history/X123456')
  })

  it('renders an empty age when date of birth is blank', () => {
    const document = renderComponent({ crn: 'X123456', dob: '', age: null, tierScore: '', historyHref: '#' })

    expect(document.querySelector('[data-qa="headerDateOfBirthAge"]')).toBeNull()
  })
})
