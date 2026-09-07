import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params: Record<string, unknown> = {}) => {
  const html = env.render('supervision-package/partials/_standard-supervision.njk', {
    params,
    forename: (params as { context?: { name?: { forename?: string } } }).context?.name?.forename,
  })
  return new JSDOM(html).window.document
}

describe('_standard-supervision partial', () => {
  describe('remaining appointments paragraph', () => {
    it('shows the "ends on" text when the primary sentence ends on or before the current year end date', () => {
      const document = renderPartial({
        context: {
          name: { forename: 'Alex' },
          sentences: [{ supervisionPackage: { code: 'SPA' }, endDate: '2026-08-15' }],
        },
        currentYear: { endDate: '2026-08-15', appointments: { allowance: 20, completed: 5 } },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const remainingParagraph = paragraphs.find(p => p.textContent?.includes('supervision appointments remaining'))

      expect(remainingParagraph?.textContent).toContain(
        'Alex has 15 supervision appointments remaining until the supervision stage ends on 15 August 2026.',
      )
    })

    it('shows the "resets on" text when the primary sentence ends after the current year end date', () => {
      const document = renderPartial({
        context: {
          name: { forename: 'Alex' },
          sentences: [{ supervisionPackage: { code: 'SPA' }, endDate: '2027-01-01' }],
        },
        currentYear: { endDate: '2026-08-15', appointments: { allowance: 20, completed: 5 } },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const remainingParagraph = paragraphs.find(p => p.textContent?.includes('supervision appointments remaining'))

      expect(remainingParagraph?.textContent).toContain(
        'Alex has 15 supervision appointments remaining until the supervision package resets on 15 August 2026.',
      )
    })
  })

  describe('final third eligibility', () => {
    it('shows the eligible text with the final third date when eligible is true and sentence type is custodial', () => {
      const document = renderPartial({
        context: {
          name: { forename: 'Alex' },
          finalThirdEligibility: { eligible: true },
          sentences: [{ custody: { finalThirdDate: '2026-11-07' }, type: { isCustodial: true } }],
        },
        currentYear: { isFirstYear: true, endDate: '2026-08-15', appointments: { allowance: 20, completed: 5 } },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const finalThirdParagraph = paragraphs.find(p => p.textContent?.includes('final third stage'))

      expect(finalThirdParagraph?.textContent).toContain(
        'Alex is eligible to start the final third stage on 7 November 2026.',
      )
    })

    it('shows the not eligible text when eligible is false', () => {
      const document = renderPartial({
        context: {
          name: { forename: 'Alex' },
          finalThirdEligibility: { eligible: false },
          sentences: [{ type: { isCustodial: true } }],
        },
        currentYear: { isFirstYear: true, endDate: '2026-08-15', appointments: { allowance: 20, completed: 5 } },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const finalThirdParagraph = paragraphs.find(p => p.textContent?.includes('final third stage'))

      expect(finalThirdParagraph?.textContent).toContain('Alex is not eligible for the final third stage.')
    })

    it('hides the final third paragraph when finalThirdEligibility is not provided', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' } },
        currentYear: { isFirstYear: true, endDate: '2026-08-15', appointments: { allowance: 20, completed: 5 } },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const finalThirdParagraph = paragraphs.find(p => p.textContent?.includes('final third stage'))

      expect(finalThirdParagraph).toBeUndefined()
    })
  })

  it('renders the progress bar using the current year appointments', () => {
    const document = renderPartial({
      currentYear: {
        isFirstYear: true,
        endDate: '2026-08-15',
        appointments: { allowance: 20, completed: 5, scheduled: 2 },
      },
      earlyEngagement: { weeks: 0 },
    })

    const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
    const usedParagraph = paragraphs.find(p => p.textContent?.includes('appointments used'))

    expect(usedParagraph?.textContent?.trim()).toBe('5 of 20 appointments used')
  })

  describe('discretionary appointments guidance', () => {
    it('shows the discretionary appointments guidance for an eligible woman', () => {
      const document = renderPartial({
        tierScore: 'C',
        currentYear: { isFirstYear: true, endDate: '2026-08-15', appointments: { allowance: 20, completed: 5 } },
        context: { name: { forename: 'Alex' }, gender: 'Female' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph?.textContent).toContain(
        'As a woman in tier C, Alex can have up to 5 additional discretionary appointments.',
      )
    })

    it('hides the discretionary appointments guidance for an ineligible tier', () => {
      const document = renderPartial({
        tierScore: 'A',
        currentYear: { isFirstYear: true, endDate: '2026-08-15', appointments: { allowance: 20, completed: 5 } },
        context: { name: { forename: 'Alex' }, gender: 'Female' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })

    it('hides the discretionary appointments guidance when context is not provided', () => {
      const document = renderPartial({
        tierScore: 'C',
        currentYear: { isFirstYear: true, endDate: '2026-08-15', appointments: { allowance: 20, completed: 5 } },
        context: { name: { forename: 'Alex' } },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })
  })
})
