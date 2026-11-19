import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'

const env = nunjucks.configure(
  ['src/components', 'node_modules/govuk-frontend/dist', 'node_modules/@ministryofjustice/frontend'],
  { autoescape: false },
)

mpopNunjucksSetup(env)

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "user-navigation/macro.njk" import userNavigation %}
     {{ userNavigation(params) }}`,
    { params },
  )
  return new JSDOM(html).window.document
}

describe('user-navigation', () => {
  it('renders the navigation on home page', () => {
    const document = renderComponent({
      user: { userId: '123', username: 'testuser' },
      home: true,
      userAlertsCount: '10',
    })
    const nav = document.querySelector('.moj-primary-navigation') as Element
    expect(nav).not.toBeNull()
    expect(nav.querySelectorAll('.moj-primary-navigation__item').length).toBe(4)
    const home = nav.querySelectorAll('.moj-primary-navigation__item')[0]
    const cases = nav.querySelectorAll('.moj-primary-navigation__item')[1]
    const search = nav.querySelectorAll('.moj-primary-navigation__item')[2]
    const alerts = nav.querySelectorAll('.moj-primary-navigation__item')[3]
    expect(home.textContent?.trim()).toContain('Home')
    expect(home.querySelector('.moj-primary-navigation__link')?.getAttribute('aria-current')).toBe('page')
    expect(home.querySelector('.moj-primary-navigation__link')?.getAttribute('href')).toBe('/')
    expect(cases.textContent?.trim()).toContain('Cases')
    expect(cases.querySelector('.moj-primary-navigation__link')?.getAttribute('href')).toBe('/case')
    expect(search.textContent?.trim()).toContain('Search')
    expect(search.querySelector('.moj-primary-navigation__link')?.getAttribute('href')).toBe('/search')
    expect(alerts.textContent?.trim()).toContain('Alerts')
    expect(alerts.querySelector('.moj-primary-navigation__link')?.getAttribute('href')).toBe('/alerts')
    expect(alerts.querySelector('.moj-notification-badge')?.textContent?.trim()).toContain('10')
  })
  it('renders the navigation on cases page', () => {
    const document = renderComponent({
      user: { userId: '123', username: 'testuser' },
      cases: true,
      userAlertsCount: '100',
    })
    const nav = document.querySelector('.moj-primary-navigation') as Element
    expect(nav).not.toBeNull()
    const cases = nav.querySelectorAll('.moj-primary-navigation__item')[1]
    const alerts = nav.querySelectorAll('.moj-primary-navigation__item')[3]
    expect(cases.querySelector('.moj-primary-navigation__link')?.getAttribute('aria-current')).toBe('page')
    expect(alerts.querySelector('.moj-notification-badge')?.textContent?.trim()).toContain('99+')
  })
  it('renders the navigation on search page', () => {
    const document = renderComponent({
      user: { userId: '123', username: 'testuser' },
      search: true,
      userAlertsCount: '5',
    })
    const nav = document.querySelector('.moj-primary-navigation') as Element
    expect(nav).not.toBeNull()
    const search = nav.querySelectorAll('.moj-primary-navigation__item')[2]
    expect(search.querySelector('.moj-primary-navigation__link')?.getAttribute('aria-current')).toBe('page')
  })
  it('renders the navigation on alerts page', () => {
    const document = renderComponent({
      user: { userId: '123', username: 'testuser' },
      alerts: true,
      userAlertsCount: '2',
    })
    const nav = document.querySelector('.moj-primary-navigation') as Element
    expect(nav).not.toBeNull()
    const alerts = nav.querySelectorAll('.moj-primary-navigation__item')[3]
    expect(alerts.querySelector('.moj-primary-navigation__link')?.getAttribute('aria-current')).toBe('page')
  })
  it('should not render the navigation if user not logged in', () => {
    const document = renderComponent({
      user: undefined,
      cases: true,
      userAlertsCount: '100',
    })
    const nav = document.querySelector('.moj-primary-navigation')
    expect(nav).toBeNull()
  })
})
