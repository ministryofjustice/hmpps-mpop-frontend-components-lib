import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components'], { autoescape: true })
mpopNunjucksSetup(env)

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "person-header-risks/macro.njk" import personHeaderRisks %}
     {{ personHeaderRisks(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

const personRiskFlags = {
  groups: [{ badges: [{ id: 'staff', text: 'Risk to staff - High', badgeClass: 'risk-badge--high' }] }],
  remainingCount: 2,
}

describe('person-header-risks', () => {
  it('renders pre-rendered risk badge markup in its own panel', () => {
    const document = renderComponent({
      riskBadges: '<span data-qa="ogrsBadge">OGRS <strong>LOW</strong></span>',
    })

    expect(document.querySelectorAll('.person-header__risk-panel')).toHaveLength(1)
    expect(document.querySelector('[data-qa="riskBadges"] [data-qa="ogrsBadge"]')?.textContent?.trim()).toBe('OGRS LOW')
  })

  it('renders risk flags linking to the risk flag pages with the remaining count link', () => {
    const document = renderComponent({ crn: 'D004851', personRiskFlags })

    const wrapper = document.querySelector('[data-qa="personRiskBadges"]')
    expect(wrapper?.querySelector('[data-qa="risk-badge-staff"]')?.getAttribute('href')).toBe(
      '/case/D004851/risk/flag/staff',
    )

    const more = wrapper?.querySelector('[data-qa="risk-badge-more"]')
    expect(more?.getAttribute('href')).toBe('/case/D004851/risk')
    expect(more?.textContent?.trim()).toBe('+2 active risk flags')
  })

  it('renders risk flags provided as headerBadges', () => {
    const document = renderComponent({
      crn: 'D004851',
      personRiskFlags: {
        headerBadges: [{ id: 'staff', text: 'Risk to staff - High', badgeClass: 'risk-badge--high' }],
        remainingCount: 0,
      },
    })

    expect(document.querySelector('[data-qa="risk-badge-staff"]')?.getAttribute('href')).toBe(
      '/case/D004851/risk/flag/staff',
    )
  })

  it('uses riskHrefBase for the risk flag and remaining count links when given', () => {
    const document = renderComponent({
      crn: 'D004851',
      personRiskFlags,
      riskHrefBase: 'https://mpop.example.com/case/D004851/risk',
    })

    expect(document.querySelector('[data-qa="risk-badge-staff"]')?.getAttribute('href')).toBe(
      'https://mpop.example.com/case/D004851/risk/flag/staff',
    )
    expect(document.querySelector('[data-qa="risk-badge-more"]')?.getAttribute('href')).toBe(
      'https://mpop.example.com/case/D004851/risk',
    )
  })

  it('renders risk badges and risk flags in separate panels', () => {
    const document = renderComponent({
      crn: 'D004851',
      riskBadges: '<span data-qa="ogrsBadge">OGRS</span>',
      personRiskFlags,
    })

    expect(document.querySelectorAll('.person-header__risk-panel')).toHaveLength(2)
  })

  it('renders the collapsible toggle controlling the risk flags', () => {
    const document = renderComponent({ crn: 'D004851', personRiskFlags, collapsibleRiskFlags: true })

    const toggle = document.querySelector('[data-qa="riskFlagsToggle"]')
    expect(toggle?.getAttribute('aria-controls')).toBe('person-header-risk-flags-D004851')
    expect(document.querySelector('[data-qa="personRiskBadges"]')?.id).toBe('person-header-risk-flags-D004851')
  })

  it('does not render the toggle by default', () => {
    const document = renderComponent({ crn: 'D004851', personRiskFlags })

    expect(document.querySelector('[data-qa="riskFlagsToggle"]')).toBeNull()
  })

  it('renders nothing when there are no risk badges or risk flags', () => {
    const document = renderComponent({ riskBadges: '\n  \n', personRiskFlags: { groups: [], remainingCount: 0 } })

    expect(document.querySelector('.person-header__risk-panel')).toBeNull()
  })

  it('does not render the blue band', () => {
    const document = renderComponent({ name: 'Andrew Langley', crn: 'D004851', personRiskFlags })

    expect(document.querySelector('.person-header__band')).toBeNull()
  })
})
