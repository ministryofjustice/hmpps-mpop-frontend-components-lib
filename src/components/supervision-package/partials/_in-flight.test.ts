import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "supervision-package/macro.njk" import supervisionPackage %}
     {{ supervisionPackage(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

const spnsParams = {
  tierScore: 'C',
  tag: { text: null, color: null },
  historyHref: '#',
  currentPhase: { phase: { code: 'SPNS', description: 'Not yet started' } },
  context: { name: { forename: 'Alex' } },
  currentYear: { appointments: { allowance: 4 }, endDate: '2026-08-15' },
  oasysReviewHref: '/oasys/review/123',
  allAppointmentsHref: '#',
}

describe('_in-flight partial', () => {
  it('renders the estimated appointments remaining until the supervision stage end date', () => {
    const document = renderComponent(spnsParams)

    const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
    const estimateParagraph = paragraphs.find(p => p.textContent?.includes('supervision appointments remaining'))

    expect(estimateParagraph?.textContent).toContain(
      'Alex could have 4 supervision appointments remaining until the supervision stage ends on 15 August 2026.',
    )
  })
})
