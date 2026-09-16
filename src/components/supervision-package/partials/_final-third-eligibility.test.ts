import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (context: Record<string, unknown> = {}) => {
  const html = env.render('supervision-package/partials/_final-third-eligibility.njk', {
    forename: 'Alex',
    ...context,
  })
  return new JSDOM(html).window.document
}

const findParagraph = (document: Document) =>
  Array.from(document.querySelectorAll('p.govuk-body')).find(p => p.textContent?.includes('final third stage'))

describe('_final-third-eligibility partial', () => {
  it('shows the eligible-with-date message when eligible and finalThirdDate is set on a custodial sentence', () => {
    const document = renderPartial({
      sentence: { type: { isCustodial: true }, custody: { finalThirdDate: '2026-08-06' } },
      params: { context: { finalThirdEligibility: { eligible: true } } },
    })

    expect(findParagraph(document)?.textContent).toContain(
      'Alex is eligible to start the final third stage on 6 August 2026.',
    )
  })

  it('shows the eligible-without-date message when eligible but finalThirdDate is missing on a custodial sentence', () => {
    const document = renderPartial({
      sentence: { type: { isCustodial: true }, custody: {} },
      params: { context: { finalThirdEligibility: { eligible: true } } },
    })

    expect(findParagraph(document)?.textContent).toContain(
      'Alex is eligible to start the final third stage. The start date is not yet available.',
    )
  })

  it('shows the not-eligible message when eligible is false on a custodial sentence', () => {
    const document = renderPartial({
      sentence: { type: { isCustodial: true }, custody: { finalThirdDate: '2026-08-06' } },
      params: { context: { finalThirdEligibility: { eligible: false } } },
    })

    expect(findParagraph(document)?.textContent).toContain('Alex is not eligible for the final third stage.')
  })

  it('renders nothing when eligibility is undefined on a custodial sentence', () => {
    const document = renderPartial({
      sentence: { type: { isCustodial: true }, custody: { finalThirdDate: '2026-08-06' } },
      params: { context: {} },
    })

    expect(findParagraph(document)).toBeUndefined()
  })

  it('renders nothing when the sentence is not custodial, regardless of eligibility', () => {
    const document = renderPartial({
      sentence: { type: { isCustodial: false }, custody: { finalThirdDate: '2026-08-06' } },
      params: { context: { finalThirdEligibility: { eligible: true } } },
    })

    expect(findParagraph(document)).toBeUndefined()
  })
})
