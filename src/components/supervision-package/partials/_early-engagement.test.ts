import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params: Record<string, unknown> = {}) => {
  const html = env.render('supervision-package/partials/_early-engagement.njk', {
    params,
    forename: (params as { context?: { name?: { forename?: string } } }).context?.name?.forename,
  })
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
        context: { name: { forename: 'Alex' } },
        currentYear: { appointments: { allowance: appointmentsAllowance } },
        earlyEngagement: { weeks: earlyEngagementWeeks },
        currentPhase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const remainingParagraph = paragraphs.find(p => p.textContent?.includes('supervision appointments'))

      expect(remainingParagraph?.textContent).toContain(String(expectedRemaining))
    },
  )

  describe('weekly attendance guidance', () => {
    it('shows the weekly guidance when appointmentsCompleted is less than earlyEngagementWeeks', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' } },
        earlyEngagement: { completed: 2, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        currentPhase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('every week'))

      expect(guidanceParagraph?.textContent).toContain(
        'You should see Alex every week for the first 5 weeks of the sentence.',
      )
    })

    it('hides the weekly guidance when appointmentsCompleted equals earlyEngagementWeeks', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' } },
        earlyEngagement: { completed: 5, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        currentPhase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('every week'))

      expect(guidanceParagraph).toBeUndefined()
    })

    it('hides the weekly guidance when appointmentsCompleted exceeds earlyEngagementWeeks', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' } },
        earlyEngagement: { completed: 7, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        currentPhase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('every week'))

      expect(guidanceParagraph).toBeUndefined()
    })

    it('hides the weekly guidance when forename is not provided', () => {
      const document = renderPartial({
        earlyEngagement: { completed: 2, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        currentPhase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('every week'))

      expect(guidanceParagraph).toBeUndefined()
    })
  })

  describe('end-date paragraph conditional clause', () => {
    it('includes the conditional attendance clause when appointmentsCompleted is less than earlyEngagementWeeks', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' } },
        earlyEngagement: { completed: 2, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        currentPhase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement is expected to end on'))

      expect(endDateParagraph?.textContent).toContain('if Alex attends the required appointments by then')
    })

    it('omits the conditional attendance clause when appointmentsCompleted equals earlyEngagementWeeks', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' } },
        earlyEngagement: { completed: 5, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        currentPhase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement is expected to end on'))

      expect(endDateParagraph?.textContent).not.toContain('if Alex attends the required appointments by then')
      expect(endDateParagraph?.textContent).toContain('Early engagement is expected to end on 1 January 2026.')
    })

    it('omits the conditional attendance clause when appointmentsCompleted exceeds earlyEngagementWeeks', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' } },
        earlyEngagement: { completed: 8, weeks: 5 },
        currentYear: { appointments: { allowance: 20 } },
        currentPhase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement is expected to end on'))

      expect(endDateParagraph?.textContent).not.toContain('if Alex attends the required appointments by then')
    })

    it('does not render the end-date paragraph when appointmentsAllowance is missing', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' } },
        earlyEngagement: { weeks: 5 },
        currentPhase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement is expected to end on'))

      expect(endDateParagraph).toBeUndefined()
    })

    it('does not render the end-date paragraph when earlyEngagementWeeks is missing', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' } },
        currentYear: { appointments: { allowance: 20 } },
        currentPhase: { endDate: '2026-01-01' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement is expected to end on'))

      expect(endDateParagraph).toBeUndefined()
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
        tierScore,
        context: { name: { forename: 'Alex' }, gender: 'Female', integratedOffenderManagementRedRated: false },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph?.textContent).toContain(
        `As a woman in tier ${tierScore}, Alex can have up to 5 additional discretionary appointments.`,
      )
    })

    it('hides the guidance when tierScore is not one of C, D, E, F or G', () => {
      const document = renderPartial({
        tierScore: 'B',
        context: { name: { forename: 'Alex' }, gender: 'Female', integratedOffenderManagementRedRated: false },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })

    it('hides the guidance when gender is not Female', () => {
      const document = renderPartial({
        tierScore: 'C',
        context: { name: { forename: 'Alex' }, gender: 'Male', integratedOffenderManagementRedRated: false },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })

    it('hides the guidance when integratedOffenderManagementRedRated is true', () => {
      const document = renderPartial({
        tierScore: 'C',
        context: { name: { forename: 'Alex' }, gender: 'Female', integratedOffenderManagementRedRated: true },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })
  })
})
