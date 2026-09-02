import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params: Record<string, unknown> = {}, forename?: string) => {
  const html = env.render('supervision-package/partials/_in-flight.njk', { params, forename })
  return new JSDOM(html).window.document
}

describe('_in-flight partial', () => {
  it('renders the estimated appointments remaining until the supervision stage end date', () => {
    const document = renderPartial({ appointmentsEstimate: 4, supervisionEndDate: '2026-08-15' }, 'Alex')

    const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
    const estimateParagraph = paragraphs.find(p => p.textContent?.includes('supervision appointments remaining'))

    expect(estimateParagraph?.textContent).toContain(
      'Alex could have 4 supervision appointments remaining until the supervision stage ends on 15 August 2026.',
    )
  })

  it('always renders the "does not count towards the package" guidance', () => {
    const document = renderPartial({ appointmentsEstimate: 4, supervisionEndDate: '2026-08-15' }, 'Alex')

    const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
    const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('do not count towards the package'))

    expect(guidanceParagraph?.textContent?.trim()).toBe(
      'Appointments do not count towards the package until it is confirmed.',
    )
  })

  it('omits the forename when it is not provided', () => {
    const document = renderPartial({ appointmentsEstimate: 4, supervisionEndDate: '2026-08-15' })

    const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
    const estimateParagraph = paragraphs.find(p => p.textContent?.includes('supervision appointments remaining'))

    expect(estimateParagraph?.textContent).toContain(
      'could have 4 supervision appointments remaining until the supervision stage ends on 15 August 2026.',
    )
  })
})
