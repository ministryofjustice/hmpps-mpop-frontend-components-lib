import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components'], { autoescape: true })
mpopNunjucksSetup(env)

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "risk-flag-badge/macro.njk" import riskFlagBadge %}
     {{ riskFlagBadge(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

describe('risk-flag-badge', () => {
  it('renders a basic badge', () => {
    const document = renderComponent({ text: 'Foo' })
    const badge = document.querySelector('span')

    expect(badge?.className).toEqual('risk-badge')
    expect(badge?.textContent).toEqual('Foo')
  })

  it('renders a basic badge with a class and id as qa attribute', () => {
    const document = renderComponent({ text: 'Foo', badgeClass: 'foo-class', id: 'foo-id' })
    const badge = document.querySelector('span')

    expect(badge?.className).toEqual('risk-badge foo-class')
    expect(badge?.getAttribute('data-qa')).toEqual('risk-badge-foo-id')
  })

  it('renders a badge as a link', () => {
    const document = renderComponent({ text: 'Link text', href: '/foo-url' })
    const badge = document.querySelector('a')

    expect(badge?.getAttribute('href')).toEqual('/foo-url')
    expect(badge?.className).toEqual('risk-badge')
    expect(badge?.textContent).toEqual('Link text')
  })

  it('renders a badge as a link with class and id as qa attribute', () => {
    const document = renderComponent({ text: 'Link text', href: '/foo-url', id: 'foo-id', badgeClass: 'foo-class' })
    const badge = document.querySelector('a')

    expect(badge?.className).toEqual('risk-badge foo-class')
    expect(badge?.getAttribute('data-qa')).toEqual('risk-badge-foo-id')
  })

  it.each(['Very High', 'Very high', 'High', 'Medium', 'Low'])('replaces %s with a strong element', level => {
    const document = renderComponent({ text: `Foo - ${level}` })
    const badge = document.querySelector('span')

    // eslint-disable-next-line no-irregular-whitespace
    expect(badge?.textContent).toEqual(`Foo - ${level}`)
    expect(badge?.querySelector('strong')?.textContent).toEqual(level)
  })
})
