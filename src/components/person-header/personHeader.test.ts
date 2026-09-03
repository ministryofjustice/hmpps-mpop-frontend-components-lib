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

  it('renders the ROSH title', () => {
    const document = renderComponent({ rosh: { level: 'Medium' } })

    expect(document.querySelector('[data-qa="roshLabel"]')?.textContent?.trim()).toBe('ROSH')
  })

  it('renders the OGRS title', () => {
    const document = renderComponent({ ogrs: { level: 'Low', percentage: '5.67%' } })

    expect(document.querySelector('[data-qa="ogrsLabel"]')?.textContent?.trim()).toBe('OGRS')
  })

  it('does not render risk labels when not provided', () => {
    const document = renderComponent({ name: 'Andrew Langley' })

    expect(document.querySelector('[data-qa="roshLabel"]')).toBeNull()
    expect(document.querySelector('[data-qa="ogrsLabel"]')).toBeNull()
  })

  it('renders OGRS before ROSH, on one line', () => {
    const document = renderComponent({ ogrs: { level: 'Low', percentage: '5.67%' }, rosh: { level: 'Medium' } })

    const tags = document.querySelectorAll('[data-qa="ogrsLabel"], [data-qa="roshLabel"]')
    expect(Array.from(tags).map(el => el.getAttribute('data-qa'))).toEqual(['ogrsLabel', 'roshLabel'])
    expect(tags[0].parentElement).toBe(tags[1].parentElement)
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
})
