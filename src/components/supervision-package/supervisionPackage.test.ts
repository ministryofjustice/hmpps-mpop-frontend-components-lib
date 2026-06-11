import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'

const renderComponent = (params = {}) => {
  const html = nunjucks.renderString(
    `{% from "src/components/supervision-package/macro.njk" import supervisionPackage %}
     {{ supervisionPackage(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

describe('supervision-package', () => {
  it('renders the supervision package content', () => {
    const document = renderComponent({
      tierScore: 'C',
      provisional: true,
      historyHref: '#',
    })

    expect(document.querySelector('.supervision-package')).not.toBeNull()
    expect(document.querySelector('h2')?.textContent?.trim()).toBe('Supervision package')
    expect(document.querySelector('h3')?.textContent?.trim()).toBe('Tier C')
    expect(document.querySelector('.govuk-tag')?.textContent?.trim()).toBe('Provisional')
    expect(document.querySelector('.govuk-tag')?.classList.contains('govuk-tag--orange')).toBe(true)
    expect(document.body.textContent).toContain('We will calculate the supervision package once the tier is confirmed.')
    expect(document.querySelector('a')?.textContent?.trim()).toBe('View tier change history')
  })
})
