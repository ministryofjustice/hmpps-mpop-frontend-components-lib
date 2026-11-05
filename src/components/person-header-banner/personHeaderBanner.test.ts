import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components'], { autoescape: true })
mpopNunjucksSetup(env)

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "person-header-banner/macro.njk" import personHeaderBanner %}
     {{ personHeaderBanner(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

describe('person-header-banner', () => {
  it('renders the name, CRN and date of birth', () => {
    const document = renderComponent({ name: 'Andrew Langley', crn: 'D004851', dob: '18 November 1995' })

    expect(document.querySelector('[data-qa="personName"]')?.textContent?.trim()).toBe('Andrew Langley')
    expect(document.querySelector('[data-qa="crn"]')?.textContent?.trim()).toBe('D004851')
    expect(document.querySelector('[data-qa="dob"]')?.textContent?.trim()).toBe('18 November 1995')
  })

  it('renders the tier as a link with provisional', () => {
    const document = renderComponent({ tier: 'B4', historyHref: '/tier-history/D004851', provisional: true })

    const link = document.querySelector('[data-qa="tier"]')
    expect(link?.getAttribute('href')).toBe('/tier-history/D004851')
    expect(link?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Tier: B4 (provisional)')
  })

  it('renders managed by as a link with the formatted name and location', () => {
    const document = renderComponent({
      managedByName: 'jack frost',
      managedByLocation: 'HMP Leeds',
      managedByHref: '/case/D004851/personal-details/staff-contacts',
    })

    const link = document.querySelector('[data-qa="managedBy"]')
    expect(link?.tagName).toBe('A')
    expect(link?.textContent?.trim()).toBe('Jack Frost (HMP Leeds)')
  })

  it('renders managed by as text when no href is given', () => {
    const document = renderComponent({ managedBy: 'Unallocated' })

    const managedBy = document.querySelector('[data-qa="managedBy"]')
    expect(managedBy?.tagName).toBe('SPAN')
    expect(managedBy?.textContent?.trim()).toBe('Unallocated')
  })

  it('renders the photo when provided', () => {
    const document = renderComponent({ name: 'Andrew Langley', photo: '/search/prisoner-image/A1234BC' })

    expect(document.querySelector('[data-qa="personPhoto"]')?.getAttribute('alt')).toBe('Photo of Andrew Langley')
    expect(document.querySelector('.person-header__band--with-photo')).not.toBeNull()
  })

  it('does not render a photo when not provided', () => {
    const document = renderComponent({ name: 'Andrew Langley' })

    expect(document.querySelector('[data-qa="personPhoto"]')).toBeNull()
    expect(document.querySelector('.person-header__band--with-photo')).toBeNull()
  })

  it('renders the person status tag', () => {
    const document = renderComponent({ personStatusTag: 'In custody' })

    expect(document.querySelector('[data-qa="personStatusTag"]')?.textContent?.trim()).toBe('In custody')
  })

  it('does not render risk information', () => {
    const document = renderComponent({
      crn: 'D004851',
      riskBadges: '<span data-qa="ogrsBadge">OGRS</span>',
      personRiskFlags: { groups: [{ badges: [{ id: '1', text: 'Flag', badgeClass: 'risk-badge--low' }] }] },
    })

    expect(document.querySelector('.person-header__risk-panel')).toBeNull()
  })
})
