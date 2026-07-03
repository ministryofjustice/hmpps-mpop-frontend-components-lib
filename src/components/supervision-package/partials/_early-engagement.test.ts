import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })

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
        appointmentsAllowance,
        earlyEngagementWeeks,
        phaseEndDate: '1 January 2026',
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
        appointmentsCompleted: 2,
        earlyEngagementWeeks: 5,
        appointmentsAllowance: 20,
        phaseEndDate: '1 January 2026',
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
        appointmentsCompleted: 5,
        earlyEngagementWeeks: 5,
        appointmentsAllowance: 20,
        phaseEndDate: '1 January 2026',
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('every week'))

      expect(guidanceParagraph).toBeUndefined()
    })

    it('hides the weekly guidance when appointmentsCompleted exceeds earlyEngagementWeeks', () => {
      const document = renderPartial({
        forename: 'Alex',
        appointmentsCompleted: 7,
        earlyEngagementWeeks: 5,
        appointmentsAllowance: 20,
        phaseEndDate: '1 January 2026',
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const guidanceParagraph = paragraphs.find(p => p.textContent?.includes('every week'))

      expect(guidanceParagraph).toBeUndefined()
    })

    it('hides the weekly guidance when forename is not provided', () => {
      const document = renderPartial({
        appointmentsCompleted: 2,
        earlyEngagementWeeks: 5,
        appointmentsAllowance: 20,
        phaseEndDate: '1 January 2026',
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
        appointmentsCompleted: 2,
        earlyEngagementWeeks: 5,
        appointmentsAllowance: 20,
        phaseEndDate: '1 January 2026',
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement ends on'))

      expect(endDateParagraph?.textContent).toContain('if Alex attends the required appointments by then')
    })

    it('omits the conditional attendance clause when appointmentsCompleted equals earlyEngagementWeeks', () => {
      const document = renderPartial({
        forename: 'Alex',
        appointmentsCompleted: 5,
        earlyEngagementWeeks: 5,
        appointmentsAllowance: 20,
        phaseEndDate: '1 January 2026',
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement ends on'))

      expect(endDateParagraph?.textContent).not.toContain('if Alex attends the required appointments by then')
      expect(endDateParagraph?.textContent).toContain('Early engagement ends on 1 January 2026.')
    })

    it('omits the conditional attendance clause when appointmentsCompleted exceeds earlyEngagementWeeks', () => {
      const document = renderPartial({
        forename: 'Alex',
        appointmentsCompleted: 8,
        earlyEngagementWeeks: 5,
        appointmentsAllowance: 20,
        phaseEndDate: '1 January 2026',
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement ends on'))

      expect(endDateParagraph?.textContent).not.toContain('if Alex attends the required appointments by then')
    })

    it('does not render the end-date paragraph when appointmentsAllowance is missing', () => {
      const document = renderPartial({
        forename: 'Alex',
        earlyEngagementWeeks: 5,
        phaseEndDate: '1 January 2026',
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement ends on'))

      expect(endDateParagraph).toBeUndefined()
    })

    it('does not render the end-date paragraph when earlyEngagementWeeks is missing', () => {
      const document = renderPartial({
        forename: 'Alex',
        appointmentsAllowance: 20,
        phaseEndDate: '1 January 2026',
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const endDateParagraph = paragraphs.find(p => p.textContent?.includes('Early engagement ends on'))

      expect(endDateParagraph).toBeUndefined()
    })
  })
})
