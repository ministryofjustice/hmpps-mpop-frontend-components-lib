import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'
import { init } from './person-header'

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

const params = {
  crn: 'D004851',
  collapsibleRiskFlags: true,
  personRiskFlags: {
    groups: [{ badges: [{ id: 'staff', text: 'Risk to staff - High', badgeClass: 'risk-badge--high' }] }],
    remainingCount: 3,
  },
}

describe('person-header risk flags toggle', () => {
  it('shows the toggle once initialised, with the risk flags hidden by default', () => {
    const document = renderComponent(params)
    init(document)

    const toggle = document.querySelector('[data-qa="riskFlagsToggle"]') as HTMLButtonElement
    const flags = document.querySelector('[data-qa="personRiskBadges"]') as HTMLElement

    expect(toggle.hidden).toBe(false)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(toggle.textContent).toBe('Show active NDelius risk flags')
    expect(flags.hidden).toBe(true)
  })

  it('shows the risk flags, including the truncation link, and changes the link text when selected', () => {
    const document = renderComponent(params)
    init(document)

    const toggle = document.querySelector('[data-qa="riskFlagsToggle"]') as HTMLButtonElement
    toggle.click()

    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(toggle.textContent).toBe('Hide active NDelius risk flags')
    expect((document.querySelector('[data-qa="personRiskBadges"]') as HTMLElement).hidden).toBe(false)
    expect(document.querySelector('[data-qa="risk-badge-more"]')?.textContent?.trim()).toBe('+3 active risk flags')
  })

  it('hides the risk flags again when selected a second time', () => {
    const document = renderComponent(params)
    init(document)

    const toggle = document.querySelector('[data-qa="riskFlagsToggle"]') as HTMLButtonElement
    toggle.click()
    toggle.click()

    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(toggle.textContent).toBe('Show active NDelius risk flags')
    expect((document.querySelector('[data-qa="personRiskBadges"]') as HTMLElement).hidden).toBe(true)
  })

  it('gives each header unique risk flag ids and only toggles its own risk flags', () => {
    const html = env.renderString(
      `{% from "person-header/macro.njk" import personHeader %}
       {{ personHeader(first) }}
       {{ personHeader(second) }}`,
      { first: { ...params, crn: 'X000001' }, second: { ...params, crn: 'X000002' } },
    )
    const { document } = new JSDOM(html).window
    init(document)

    const [first, second] = Array.from(document.querySelectorAll('.person-header')).map(header => ({
      toggle: header.querySelector('[data-qa="riskFlagsToggle"]') as HTMLButtonElement,
      flags: header.querySelector('[data-qa="personRiskBadges"]') as HTMLElement,
    }))

    expect(first.flags.id).not.toBe(second.flags.id)
    expect(first.toggle.getAttribute('aria-controls')).toBe(first.flags.id)
    expect(second.toggle.getAttribute('aria-controls')).toBe(second.flags.id)

    second.toggle.click()

    expect(first.flags.hidden).toBe(true)
    expect(second.flags.hidden).toBe(false)
  })

  it('does not bind twice when initialised more than once', () => {
    const document = renderComponent(params)
    init(document)
    init(document)

    const toggle = document.querySelector('[data-qa="riskFlagsToggle"]') as HTMLButtonElement
    toggle.click()

    expect(toggle.getAttribute('aria-expanded')).toBe('true')
  })
})
