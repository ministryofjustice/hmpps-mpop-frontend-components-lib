import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params = {}) => {
  const html = env.render('supervision-package/partials/_early-engagement.njk', { params })
  return new JSDOM(html).window.document
}

describe('_early-engagement partial', () => {
  it.each`
    appointmentsAllowance | earlyEngagementWeeks | expectedRemaining
    ${20}                 | ${5}                 | ${15}
    ${10}                 | ${10}                | ${0}
    ${15}                 | ${3}                 | ${12}
    ${8}                  | ${1}                 | ${7}
  `(
    'shows $expectedRemaining remaining appointments when allowance is $appointmentsAllowance and earlyEngagementWeeks is $earlyEngagementWeeks',
    ({ appointmentsAllowance, earlyEngagementWeeks, expectedRemaining }) => {
      const document = renderPartial({
        forename: 'Alex',
        currentYear: { appointments: { allowance: appointmentsAllowance } },
        earlyEngagement: { weeks: earlyEngagementWeeks },
        phase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const remainingParagraph = paragraphs.find(p => p.textContent?.includes('supervision appointments'))

      expect(remainingParagraph?.textContent).toContain(String(expectedRemaining))
    },
  )

  describe('weekly attendance guidance', () => {
    it('shows the weekly guidance when appointmentsCompleted is less than earlyEngagementWeeks', () => {
      const document = renderPartial({
        forename: 'Alex',
        earlyEngagement: { completed: 2, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        phase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('every week'))

      expect(guidanceParagraph?.textContent).toContain(
        'You should see Alex every week for the first 5 weeks of the sentence.',
      )
    })

    it('hides the weekly guidance when appointmentsCompleted equals earlyEngagementWeeks', () => {
      const document = renderPartial({
        forename: 'Alex',
        earlyEngagement: { completed: 5, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        phase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('every week'))

      expect(guidanceParagraph).toBeUndefined()
    })

    it('hides the weekly guidance when appointmentsCompleted exceeds earlyEngagementWeeks', () => {
      const document = renderPartial({
        forename: 'Alex',
        earlyEngagement: { completed: 7, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        phase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('every week'))

      expect(guidanceParagraph).toBeUndefined()
    })

    it('hides the weekly guidance when forename is not provided', () => {
      const document = renderPartial({
        earlyEngagement: { completed: 2, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        phase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('every week'))

      expect(guidanceParagraph).toBeUndefined()
    })
  })

  describe('end-date paragraph conditional clause', () => {
    it('includes the conditional attendance clause when appointmentsCompleted is less than earlyEngagementWeeks', () => {
      const document = renderPartial({
        forename: 'Alex',
        earlyEngagement: { completed: 2, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        phase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement is expected to end on'))

      expect(endDateParagraph?.textContent).toContain('if Alex attends the required appointments by then')
    })

    it('omits the conditional attendance clause when appointmentsCompleted equals earlyEngagementWeeks', () => {
      const document = renderPartial({
        forename: 'Alex',
        earlyEngagement: { completed: 5, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        phase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement is expected to end on'))

      expect(endDateParagraph?.textContent).not.toContain('if Alex attends the required appointments by then')
      expect(endDateParagraph?.textContent).toContain('Early engagement is expected to end on 1 January 2026.')
    })

    it('omits the conditional attendance clause when appointmentsCompleted exceeds earlyEngagementWeeks', () => {
      const document = renderPartial({
        forename: 'Alex',
        earlyEngagement: { completed: 8, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        phase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement is expected to end on'))

      expect(endDateParagraph?.textContent).not.toContain('if Alex attends the required appointments by then')
    })

    it('does not render the end-date paragraph when appointmentsAllowance is missing', () => {
      const document = renderPartial({
        forename: 'Alex',
        earlyEngagement: { weeks: 5 },
        phase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement is expected to end on'))

      expect(endDateParagraph).toBeUndefined()
    })

    it('does not render the end-date paragraph when earlyEngagementWeeks is missing', () => {
      const document = renderPartial({
        forename: 'Alex',
        currentYear: { appointments: { allowance: 20 } },
        phase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement is expected to end on'))

      expect(endDateParagraph).toBeUndefined()
    })
  })

  describe('IOM red RAG guidance', () => {
    it('shows the IOM guidance when integratedOffenderManagementRedRated is true', () => {
      const document = renderPartial({
        forename: 'Alex',
        inputs: { integratedOffenderManagementRedRated: true },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const iomParagraph = paragraphs.find(p => p.textContent?.includes('IOM red RAG status'))

      expect(iomParagraph?.textContent).toContain(
        'Alex has an IOM red RAG status. The maximum number of appointments is the same as tier A.',
      )
    })

    it('hides the IOM guidance when integratedOffenderManagementRedRated is false', () => {
      const document = renderPartial({
        forename: 'Alex',
        inputs: { integratedOffenderManagementRedRated: false },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const iomParagraph = paragraphs.find(p => p.textContent?.includes('IOM red RAG status'))

      expect(iomParagraph).toBeUndefined()
    })

    it('hides the IOM guidance when inputs is not provided', () => {
      const document = renderPartial({ forename: 'Alex' })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const iomParagraph = paragraphs.find(p => p.textContent?.includes('IOM red RAG status'))

      expect(iomParagraph).toBeUndefined()
    })
  })

  describe('additional discretionary appointments for women', () => {
    it.each`
      tierScore
      ${'C'}
      ${'D'}
      ${'E'}
      ${'F'}
      ${'G'}
    `('shows the guidance when gender is Female and tierScore is $tierScore', ({ tierScore }) => {
      const document = renderPartial({
        forename: 'Alex',
        tierScore,
        inputs: { gender: 'Female', integratedOffenderManagementRedRated: false },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph?.textContent).toContain(
        `As a woman in tier ${tierScore}, Alex can have up to 5 additional discretionary appointments.`,
      )
    })

    it('hides the guidance when tierScore is not one of C, D, E, F or G', () => {
      const document = renderPartial({
        forename: 'Alex',
        tierScore: 'B',
        inputs: { gender: 'Female', integratedOffenderManagementRedRated: false },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })

    it('hides the guidance when gender is not Female', () => {
      const document = renderPartial({
        forename: 'Alex',
        tierScore: 'C',
        inputs: { gender: 'Male', integratedOffenderManagementRedRated: false },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })

    it('hides the guidance when integratedOffenderManagementRedRated is true', () => {
      const document = renderPartial({
        forename: 'Alex',
        tierScore: 'C',
        inputs: { gender: 'Female', integratedOffenderManagementRedRated: true },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })
  })
})
