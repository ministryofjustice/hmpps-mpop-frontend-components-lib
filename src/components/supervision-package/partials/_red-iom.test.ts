import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params: Record<string, unknown> = {}) => {
  const mergedParams = {
    context: { name: { forename: 'Alex' }, sentences: [] },
    currentPhase: { phase: { code: 'STD' } },
    currentYear: { endDate: '2026-12-01', appointments: { completed: 2, allowance: 10, scheduled: 0 } },
    ...params,
  }
  const html = env.render('supervision-package/partials/_red-iom.njk', {
    params: mergedParams,
    forename: (mergedParams.context as { name?: { forename?: string } }).name?.forename,
  })
  return new JSDOM(html).window.document
}

const paragraphsOf = (document: Document) => Array.from(document.querySelectorAll('p.govuk-body'))

describe('_red-iom partial', () => {
  it('shows the used-all-appointments paragraph when the allowance has been used', () => {
    const document = renderPartial({
      context: { name: { forename: 'Alex' }, sentences: [] },
      currentYear: { endDate: '2026-12-01', appointments: { completed: 10, allowance: 10, scheduled: 0 } },
    })

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('has used all the supervision'))

    expect(paragraph?.textContent).toContain('Alex has used all the supervision package appointments.')
  })

  it('does not show the used-all-appointments paragraph when appointments remain', () => {
    const document = renderPartial()

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('has used all the supervision'))

    expect(paragraph).toBeUndefined()
  })

  it('does not show the used-all-appointments paragraph without a forename', () => {
    const document = renderPartial({
      context: { name: {}, sentences: [] },
      currentYear: { endDate: '2026-12-01', appointments: { completed: 10, allowance: 10, scheduled: 0 } },
    })

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('has used all the supervision'))

    expect(paragraph).toBeUndefined()
  })

  it('shows the remaining-appointments-until-reset paragraph when the package resets before the sentence ends', () => {
    const document = renderPartial({
      context: {
        name: { forename: 'Alex' },
        sentences: [{ supervisionPackage: { code: 'CUR' }, endDate: '2027-06-01' }],
      },
      currentYear: { endDate: '2026-12-01', appointments: { completed: 2, allowance: 10, scheduled: 0 } },
    })

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('remaining'))

    expect(paragraph?.textContent).toContain(
      'Alex has 8 supervision appointments remaining until the supervision package resets on 1 December 2026.',
    )
  })

  it('shows the remaining-appointments-until-stage-ends paragraph when the sentence ends before the reset', () => {
    const document = renderPartial({
      context: {
        name: { forename: 'Alex' },
        sentences: [{ supervisionPackage: { code: 'CUR' }, endDate: '2026-06-01' }],
      },
      currentYear: { endDate: '2026-12-01', appointments: { completed: 2, allowance: 10, scheduled: 0 } },
    })

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('remaining'))

    expect(paragraph?.textContent).toContain(
      'Alex has 8 supervision appointments remaining until the supervision stage ends on 1 December 2026.',
    )
  })

  it('shows the final third eligibility paragraph for an eligible custodial sentence', () => {
    const document = renderPartial({
      context: {
        name: { forename: 'Alex' },
        sentences: [
          {
            supervisionPackage: { code: 'CUR' },
            type: { isCustodial: true },
            custody: { finalThirdDate: '2026-09-01' },
          },
        ],
        finalThirdEligibility: { eligible: true },
      },
    })

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('final third stage'))

    expect(paragraph?.textContent).toContain('Alex is eligible to start the final third stage on 1 September 2026.')
  })

  it('shows the not-eligible-for-final-third paragraph for an ineligible custodial sentence', () => {
    const document = renderPartial({
      context: {
        name: { forename: 'Alex' },
        sentences: [
          {
            supervisionPackage: { code: 'CUR' },
            type: { isCustodial: true },
            custody: { finalThirdDate: '2026-09-01' },
          },
        ],
        finalThirdEligibility: { eligible: false },
      },
    })

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('final third stage'))

    expect(paragraph?.textContent).toContain('Alex is not eligible for the final third stage.')
  })

  it('does not show any final third paragraph for a non-custodial sentence', () => {
    const document = renderPartial({
      context: {
        name: { forename: 'Alex' },
        sentences: [{ supervisionPackage: { code: 'CUR' }, type: { isCustodial: false } }],
        finalThirdEligibility: { eligible: true },
      },
    })

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('final third stage'))

    expect(paragraph).toBeUndefined()
  })

  it('always shows the IOM red RAG status paragraph', () => {
    const document = renderPartial()

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('IOM red RAG status'))

    expect(paragraph?.textContent).toContain(
      'Alex has an IOM red RAG status. The maximum number of appointments is the same as tier A.',
    )
  })

  it('does not show the discretionary appointments paragraph when not eligible', () => {
    const document = renderPartial({
      context: { name: { forename: 'Alex' }, sentences: [], gender: 'Male' },
      tierScore: 'D',
    })

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('discretionary appointments'))

    expect(paragraph).toBeUndefined()
  })
})
