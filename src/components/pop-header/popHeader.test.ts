import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { yearsSince } from '../../utils/yearsSince'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components'], { autoescape: true })
mpopNunjucksSetup(env)

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

  it('hides the visual CRN from assistive tech and exposes a spaced-out version so each character is read individually', () => {
    const document = renderComponent({ crn: 'X123456', dob: '', tierScore: '', historyHref: '#' })

    expect(document.querySelector('[data-qa="crn"]')?.getAttribute('aria-hidden')).toBe('true')
    expect(document.querySelector('.govuk-visually-hidden')?.textContent?.trim()).toBe('X 1 2 3 4 5 6')
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
    expect(link?.textContent?.trim()).toBe('Tier: B2')
  })

  it('renders the history href on the tier link', () => {
    const document = renderComponent({ crn: 'X123456', dob: '', tierScore: 'A1', historyHref: '/tier-history/X123456' })

    expect(document.querySelector('[data-qa="tierLink"]')?.getAttribute('href')).toBe('/tier-history/X123456')
  })

  it('renders the tier tag when both tag text and color are provided', () => {
    const document = renderComponent({
      crn: 'X123456',
      dob: '',
      tierScore: 'A1',
      historyHref: '#',
      provisional: true,
      tag: { text: 'Provisional', color: 'orange' },
    })

    const link = document.querySelector('[data-qa="tierLink"]')
    expect(link?.getAttribute('aria-label')).toBe('Tier: A1 Provisional')

    const tag = document.querySelector('strong.govuk-tag')

    expect(tag?.textContent?.trim()).toBe('Provisional')
    expect(tag?.classList.contains('govuk-tag--orange')).toBe(true)
    expect(tag?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders render "Tier: Missing" when the tier score is MISSING', () => {
    const document = renderComponent({ crn: 'X123456', dob: '', tierScore: 'MISSING', historyHref: '#' })

    const link = document.querySelector('[data-qa="tierLink"]')
    expect(link?.textContent?.trim()).toBe('Tier: Missing')
    expect(link?.getAttribute('aria-label')).toBe('Tier: MISSING')
  })
})
