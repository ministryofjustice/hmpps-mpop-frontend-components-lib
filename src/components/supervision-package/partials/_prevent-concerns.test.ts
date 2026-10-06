import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'
import { getPrimarySentence } from '../../../utils/getPrimarySentence'
import { FrontendSentence } from '../../../types/SupervisionPackage'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params: Record<string, unknown> = {}, phaseCode = 'STD') => {
  const { context } = params as { context?: { name?: { forename?: string }; sentences?: FrontendSentence[] } }
  const html = env.render('supervision-package/partials/_prevent-concerns.njk', {
    params,
    forename: context?.name?.forename,
    sentence: getPrimarySentence(context?.sentences),
    phaseCode,
  })
  return new JSDOM(html).window.document
}

const paragraphsOf = (document: Document) => Array.from(document.querySelectorAll('p.govuk-body'))

describe('_prevent-concerns partial', () => {
  it('renders the Prevent concerns risk flag paragraph with the forename', () => {
    const document = renderPartial({
      context: { name: { forename: 'Alex' }, preventConcerns: true, sentences: [] },
      currentYear: { endDate: '2026-12-01', appointments: { allowance: 10, completed: 2 } },
    })

    const paragraphs = paragraphsOf(document)
    expect(paragraphs[0].textContent?.trim()).toBe(
      'Alex has a Prevent concerns risk flag and can receive additional appointments while this flag is active. Use your judgement to decide how many they need.',
    )
  })

  it('renders without a forename', () => {
    const document = renderPartial({
      context: { preventConcerns: true, sentences: [] },
      currentYear: { endDate: '2026-12-01', appointments: { allowance: 10, completed: 2 } },
    })

    const paragraphs = paragraphsOf(document)
    expect(paragraphs[0].textContent?.trim()).toBe(
      'has a Prevent concerns risk flag and can receive additional appointments while this flag is active. Use your judgement to decide how many they need.',
    )
  })

  it('renders the pro rata recalculation paragraph', () => {
    const document = renderPartial({
      context: { name: { forename: 'Alex' }, preventConcerns: true, sentences: [] },
      currentYear: { endDate: '2026-12-01', appointments: { allowance: 10, completed: 2 } },
    })

    const paragraphs = paragraphsOf(document)
    const proRataParagraph = paragraphs.find(p => p.textContent?.includes('pro rata'))

    expect(proRataParagraph?.textContent?.trim()).toBe(
      'When the flag ends, the supervision package is recalculated on a pro rata basis.',
    )
  })

  it('includes the appointments-guidance stage-ends message, ignoring remaining appointments', () => {
    const document = renderPartial({
      context: {
        name: { forename: 'Alex' },
        preventConcerns: true,
        sentences: [{ supervisionPackage: { code: 'CUR' }, endDate: '2026-06-01' }],
      },
      currentYear: { endDate: '2026-12-01', appointments: { allowance: 10, completed: 10 } },
    })

    expect(document.body.textContent).toContain('The supervision stage ends on 1 December 2026.')
    expect(document.body.textContent).not.toContain('supervision appointments remaining')
    expect(document.body.textContent).not.toContain('has used all the supervision package appointments')
  })

  it('includes the final third eligibility paragraph when eligible', () => {
    const document = renderPartial({
      context: {
        name: { forename: 'Alex' },
        preventConcerns: true,
        finalThirdEligibility: { eligible: true },
        sentences: [
          {
            supervisionPackage: { code: 'CUR' },
            custody: { finalThirdDate: '2026-11-07' },
            type: { isCustodial: true },
          },
        ],
      },
      currentYear: { endDate: '2026-12-01', appointments: { allowance: 10, completed: 2 } },
    })

    expect(document.body.textContent).toContain('Alex is eligible to start the final third stage on 7 November 2026.')
  })

  it('omits the final third eligibility paragraph for a non-custodial sentence', () => {
    const document = renderPartial({
      context: {
        name: { forename: 'Alex' },
        preventConcerns: true,
        finalThirdEligibility: { eligible: true },
        sentences: [{ supervisionPackage: { code: 'CUR' }, type: { isCustodial: false } }],
      },
      currentYear: { endDate: '2026-12-01', appointments: { allowance: 10, completed: 2 } },
    })

    expect(document.body.textContent).not.toContain('eligible to start the final third stage')
  })

  it('includes the progress bar with the correct completed/allowance counts', () => {
    const document = renderPartial({
      context: { name: { forename: 'Alex' }, preventConcerns: true, sentences: [] },
      currentYear: { endDate: '2026-12-01', appointments: { allowance: 10, completed: 4 } },
    })

    expect(document.body.textContent).toContain('4 of 10 appointments used')
  })

  it('does not use the bar-maximum class at 100% when preventConcerns is true', () => {
    const document = renderPartial({
      context: { name: { forename: 'Alex' }, preventConcerns: true, sentences: [] },
      currentYear: { endDate: '2026-12-01', appointments: { allowance: 10, completed: 10 } },
    })

    const bar = document.querySelector('.appointment-progress__bar, .appointment-progress__bar-maximum')
    expect(bar?.classList.contains('appointment-progress__bar')).toBe(true)
    expect(bar?.classList.contains('appointment-progress__bar-maximum')).toBe(false)
  })
})
