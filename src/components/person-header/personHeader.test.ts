import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'

const env = nunjucks.configure(['src/components'], { autoescape: true })

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "person-header/macro.njk" import personHeader %}
     {{ personHeader(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

describe('person-header', () => {
  it('renders the name', () => {
    const document = renderComponent({ name: 'Andrew Langley' })

    expect(document.querySelector('[data-qa="personName"]')?.textContent?.trim()).toBe('Andrew Langley')
  })

  it('renders the CRN', () => {
    const document = renderComponent({ crn: 'D004851' })

    expect(document.querySelector('[data-qa="crn"]')?.textContent?.trim()).toBe('D004851')
  })

  it('renders the date of birth', () => {
    const document = renderComponent({ dob: '18 November 1995' })

    expect(document.querySelector('[data-qa="dob"]')?.textContent?.trim()).toBe('18 November 1995')
  })

  it('renders the tier as a link', () => {
    const document = renderComponent({ tier: 'B4', historyHref: '/tier-history/D004851' })

    const link = document.querySelector('[data-qa="tier"]')
    expect(link?.tagName).toBe('A')
    expect(link?.textContent?.trim()).toBe('B4')
    expect(link?.getAttribute('href')).toBe('/tier-history/D004851')
  })

  it('renders the managed by value as plain (non-clickable) text', () => {
    const document = renderComponent({ managedBy: 'Jack Frost (Worksop Probation Office)' })

    const managedBy = document.querySelector('[data-qa="managedBy"]')
    expect(managedBy?.tagName).toBe('SPAN')
    expect(managedBy?.textContent?.trim()).toBe('Jack Frost (Worksop Probation Office)')
  })

  it('renders pre-rendered risk badge markup as-is', () => {
    const document = renderComponent({
      riskBadges: '<span class="arns-badge-base--medium" data-qa="ogrsBadge">OGRS <strong>LOW</strong></span>',
    })

    const wrapper = document.querySelector('[data-qa="riskBadges"]')
    expect(wrapper?.querySelector('[data-qa="ogrsBadge"]')?.textContent?.trim()).toBe('OGRS LOW')
  })

  it('does not render the risk badges wrapper when not provided', () => {
    const document = renderComponent({ name: 'Andrew Langley' })

    expect(document.querySelector('[data-qa="riskBadges"]')).toBeNull()
  })

  it('renders the risk alert badges title', () => {
    const document = renderComponent({ riskFlags: [{ text: 'Victim contact' }, { text: 'Street gangs' }] })

    expect(document.querySelector('[data-qa="riskAlertBadges"]')?.textContent?.trim()).toBe('Risk alert badges')
  })

  it('does not render the risk alert badges title when not provided', () => {
    const document = renderComponent({ name: 'Andrew Langley' })

    expect(document.querySelector('[data-qa="riskAlertBadges"]')).toBeNull()
  })

  it('does not render the risk alert badges title when riskFlags is empty', () => {
    const document = renderComponent({ riskFlags: [] })

    expect(document.querySelector('[data-qa="riskAlertBadges"]')).toBeNull()
  })

  it('does not render the risk panel at all when there are no risk badges or flags', () => {
    const document = renderComponent({ name: 'Andrew Langley' })

    expect(document.querySelector('.person-header__risk-panel')).toBeNull()
  })
})
