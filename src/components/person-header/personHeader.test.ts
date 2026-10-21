import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components'], { autoescape: true })
mpopNunjucksSetup(env)

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
    expect(link?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Tier: B4')
    expect(link?.getAttribute('href')).toBe('/tier-history/D004851')
  })

  it('renders the managed by value as plain (non-clickable) text when no href is given', () => {
    const document = renderComponent({ managedBy: 'Unallocated' })

    const managedBy = document.querySelector('[data-qa="managedBy"]')
    expect(managedBy?.tagName).toBe('SPAN')
    expect(managedBy?.textContent?.trim()).toBe('Unallocated')
  })

  it('renders the managed by value as a link when managedByHref is given', () => {
    const document = renderComponent({
      managedBy: 'Jack Frost (Worksop Probation Office)',
      managedByHref: '/case/D004851/personal-details/staff-contacts',
    })

    const link = document.querySelector('[data-qa="managedBy"]')
    expect(link?.tagName).toBe('A')
    expect(link?.textContent?.trim()).toBe('Jack Frost (Worksop Probation Office)')
    expect(link?.getAttribute('href')).toBe('/case/D004851/personal-details/staff-contacts')
  })

  it('capitalises the first letter of the forename and surname when managedByName is given', () => {
    const document = renderComponent({ managedByName: 'jack frost' })

    expect(document.querySelector('[data-qa="managedBy"]')?.textContent?.trim()).toBe('Jack Frost')
  })

  it('appends managedByLocation in brackets without changing its casing', () => {
    const document = renderComponent({
      managedByName: 'jack frost',
      managedByLocation: 'HMP Leeds and district',
      managedByHref: '/case/D004851/personal-details/staff-contacts',
    })

    const link = document.querySelector('[data-qa="managedBy"]')
    expect(link?.tagName).toBe('A')
    expect(link?.textContent?.trim()).toBe('Jack Frost (HMP Leeds and district)')
  })

  it('prefers managedByName over managedBy when both are given', () => {
    const document = renderComponent({ managedBy: 'Unallocated', managedByName: 'jack frost' })

    expect(document.querySelector('[data-qa="managedBy"]')?.textContent?.trim()).toBe('Jack Frost')
  })

  it('renders managedBy as-is when managedByName is not given', () => {
    const document = renderComponent({ managedBy: 'jack frost (worksop)' })

    expect(document.querySelector('[data-qa="managedBy"]')?.textContent?.trim()).toBe('jack frost (worksop)')
  })

  it('does not render the managed by row when no managed by params are given', () => {
    const document = renderComponent({ name: 'Andrew Langley', crn: 'D004851' })

    expect(document.querySelector('[data-qa="managedBy"]')).toBeNull()
    expect(document.body.textContent).not.toContain('Managed by:')
  })

  it('renders the managed by row when only managedByHref is given', () => {
    const document = renderComponent({ managedByHref: '/case/D004851/personal-details/staff-contacts' })

    expect(document.body.textContent).toContain('Managed by:')
    expect(document.querySelector('[data-qa="managedBy"]')?.getAttribute('href')).toBe(
      '/case/D004851/personal-details/staff-contacts',
    )
  })

  it('renders the photo when provided', () => {
    const document = renderComponent({ name: 'Andrew Langley', photo: '/search/prisoner-image/A1234BC' })

    const photo = document.querySelector('[data-qa="personPhoto"]')
    expect(photo?.tagName).toBe('IMG')
    expect(photo?.getAttribute('src')).toBe('/search/prisoner-image/A1234BC')
    expect(photo?.getAttribute('alt')).toBe('Photo of Andrew Langley')
    expect(document.querySelector('.person-header__band--with-photo')).not.toBeNull()
  })

  it('does not render a photo element when not provided', () => {
    const document = renderComponent({ name: 'Andrew Langley' })

    expect(document.querySelector('[data-qa="personPhoto"]')).toBeNull()
    expect(document.querySelector('.person-header__band--with-photo')).toBeNull()
  })

  it('renders pre-rendered risk badge markup as-is', () => {
    const document = renderComponent({
      riskBadges: '<span class="arns-badge-base--medium" data-qa="ogrsBadge">OGRS <strong>LOW</strong></span>',
    })

    const wrapper = document.querySelector('[data-qa="riskBadges"]')
    expect(wrapper?.querySelector('[data-qa="ogrsBadge"]')?.textContent?.trim()).toBe('OGRS LOW')
  })

  it('renders structured personRiskFlags with the remaining risk count link', () => {
    const document = renderComponent({
      crn: 'D004851',
      personRiskFlags: {
        groups: [
          {
            badges: [
              {
                id: 'ogrs',
                text: 'OGRS LOW',
                badgeClass: 'risk-badge--low',
              },
            ],
          },
        ],
        remainingCount: 2,
      },
    })

    const wrapper = document.querySelector('[data-qa="personRiskBadges"]')
    const link = wrapper?.querySelector('[data-qa="risk-badge-ogrs"]')

    expect(wrapper).not.toBeNull()
    expect(link?.tagName).toBe('A')
    expect(link?.getAttribute('href')).toBe('/case/D004851/risk/flag/ogrs')
    expect(link?.textContent?.trim()).toBe('OGRS LOW')
    expect(link?.classList.contains('dps-alert-status')).toBe(true)
    expect(link?.classList.contains('dps-alert-status--risk')).toBe(true)
    expect(link?.classList.contains('risk-badge--low')).toBe(true)
    expect(wrapper?.querySelector('[data-qa="risk-badge-more"]')?.textContent?.trim()).toBe('+2 active risk flags')
  })

  describe('collapsible risk flags', () => {
    const personRiskFlags = {
      groups: [{ badges: [{ id: 'staff', text: 'Risk to staff - High', badgeClass: 'risk-badge--high' }] }],
      remainingCount: 3,
    }

    it('does not render the toggle by default', () => {
      const document = renderComponent({ personRiskFlags })

      expect(document.querySelector('[data-qa="riskFlagsToggle"]')).toBeNull()
      expect(document.querySelector('[data-qa="personRiskBadges"]')?.hasAttribute('id')).toBe(false)
    })

    it('renders a hidden toggle button after the risk flags that controls them', () => {
      const document = renderComponent({ crn: 'D004851', personRiskFlags, collapsibleRiskFlags: true })

      const toggle = document.querySelector('[data-qa="riskFlagsToggle"]') as HTMLButtonElement
      const flags = document.querySelector('[data-qa="personRiskBadges"]')

      expect(toggle.tagName).toBe('BUTTON')
      expect(toggle.getAttribute('type')).toBe('button')
      expect(toggle.hasAttribute('hidden')).toBe(true)
      expect(toggle.getAttribute('data-module')).toBe('mpop-risk-flags-toggle')
      expect(toggle.getAttribute('aria-expanded')).toBe('true')
      expect(flags?.id).toBe('person-header-risk-flags-D004851')
      expect(toggle.getAttribute('aria-controls')).toBe(flags?.id)
      expect(toggle.textContent?.trim()).toBe('Hide active NDelius risk flags')
      expect(flags?.compareDocumentPosition(toggle)).toBe(4)
    })

    it('keeps the risk badges outside the collapsible risk flags', () => {
      const document = renderComponent({
        riskBadges: '<span data-qa="ogrsBadge">OGRS <strong>LOW</strong></span>',
        personRiskFlags,
        collapsibleRiskFlags: true,
      })

      expect(document.querySelector('[data-qa="personRiskBadges"] [data-qa="ogrsBadge"]')).toBeNull()
    })

    it('does not render the toggle when there are no risk flags', () => {
      const document = renderComponent({
        riskBadges: '<span data-qa="ogrsBadge">OGRS</span>',
        personRiskFlags: { groups: [], remainingCount: 0 },
        collapsibleRiskFlags: true,
      })

      expect(document.querySelector('[data-qa="riskFlagsToggle"]')).toBeNull()
    })
  })

  it('does not render the risk panel when riskBadgeData has no groups', () => {
    const document = renderComponent({
      riskBadgeData: { groups: [], remainingCount: 0 },
    })

    expect(document.querySelector('.person-header__risk-panel')).toBeNull()
  })

  it('does not render the risk badges wrapper when not provided', () => {
    const document = renderComponent({ name: 'Andrew Langley' })

    expect(document.querySelector('[data-qa="riskBadges"]')).toBeNull()
  })

  it('does not render the risk panel at all when there are no risk badges', () => {
    const document = renderComponent({ name: 'Andrew Langley' })

    expect(document.querySelector('.person-header__risk-panel')).toBeNull()
  })

  it('does not render the risk panel when riskBadges is only whitespace', () => {
    const document = renderComponent({ riskBadges: '\n    \n' })

    expect(document.querySelector('.person-header__risk-panel')).toBeNull()
  })

  it('renders the person status tag', () => {
    const document = renderComponent({ personStatusTag: 'In custody' })

    const statusTag = document.querySelector('[data-qa="personStatusTag"]')

    expect(statusTag?.textContent?.trim()).toBe('In custody')
  })

  it('does not render the person status tag when no status is provided', () => {
    const document = renderComponent({ personStatusTag: undefined })

    expect(document.querySelector('[data-qa="personStatusTag"]')).toBeNull()
  })

  it('renders provisional after the tier inside the tier link when the tier is provisional', () => {
    const document = renderComponent({
      tier: 'B',
      historyHref: '#',
      provisional: true,
    })

    const link = document.querySelector('[data-qa="tier"]')
    expect(link?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Tier: B (provisional)')
    expect(link?.querySelector('[data-qa="tierProvisional"]')).not.toBeNull()
  })

  it('does not render provisional when the tier is not provisional', () => {
    const document = renderComponent({ tier: 'B', provisional: false })

    expect(document.querySelector('[data-qa="tierProvisional"]')).toBeNull()
    expect(document.querySelector('[data-qa="tier"]')?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Tier: B')
  })
})
