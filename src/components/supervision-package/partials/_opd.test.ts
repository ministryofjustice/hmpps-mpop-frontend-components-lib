import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params = {}) => {
  const html = env.render('supervision-package/partials/_opd.njk', { params })
  return new JSDOM(html).window.document
}

describe('_opd partial', () => {
  it('renders the OPD treatment paragraph with the forename', () => {
    const document = renderPartial({ context: { name: { forename: 'Alex' } } })

    const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
    const treatmentParagraph = paragraphs.find(p => p.textContent?.includes('OPD'))

    expect(treatmentParagraph?.textContent?.trim()).toBe(
      'Alex is receiving offender personality disorder (OPD) treatment.',
    )
  })

  it('renders the additional appointments paragraph with the forename', () => {
    const document = renderPartial({ context: { name: { forename: 'Alex' } } })

    const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
    const additionalAppointmentsParagraph = paragraphs.find(p => p.textContent?.includes('additional appointments'))

    expect(additionalAppointmentsParagraph?.textContent?.trim()).toBe(
      'Alex can receive additional appointments while in treatment. Use your professional judgement to decide how many appointments are needed.',
    )
  })

  it('renders the pro rata recalculation paragraph', () => {
    const document = renderPartial({ context: { name: { forename: 'Alex' } } })

    const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
    const proRataParagraph = paragraphs.find(p => p.textContent?.includes('pro rata'))

    expect(proRataParagraph?.textContent?.trim()).toBe(
      'When treatment ends, the supervision package is recalculated on a pro rata basis.',
    )
  })

  it('renders exactly three paragraphs', () => {
    const document = renderPartial({ context: { name: { forename: 'Alex' } } })

    expect(document.querySelectorAll('p.govuk-body')).toHaveLength(3)
  })

  it('renders without a forename', () => {
    const document = renderPartial({})

    const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
    const treatmentParagraph = paragraphs.find(p => p.textContent?.includes('OPD'))

    expect(treatmentParagraph?.textContent?.trim()).toBe('is receiving offender personality disorder (OPD) treatment.')
  })
})
