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

  describe('custody and final third (lines 19–20)', () => {
    it('shows the final third eligibility message when sentenceType is Custodial sentence and finalThirdEligible is true', () => {
      const document = renderPartial({
        forename: 'Alex',
        sentenceType: 'Custodial sentence',
        finalThirdEligible: true,
        finalThirdStartDate: '1 April 2026',
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const finalThirdParagraph = paragraphs.find(p =>
        p.textContent?.includes('eligible to start the final third stage'),
      )

      expect(finalThirdParagraph?.textContent).toContain(
        'Alex is eligible to start the final third stage on 1 April 2026.',
      )
    })

    it('shows the not-eligible message when sentenceType is Custodial sentence and finalThirdEligible is false', () => {
      const document = renderPartial({
        forename: 'Alex',
        sentenceType: 'Custodial sentence',
        finalThirdEligible: false,
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const notEligibleParagraph = paragraphs.find(p =>
        p.textContent?.includes('not eligible for the final third stage'),
      )

      expect(notEligibleParagraph?.textContent).toContain('Alex is not eligible for the final third stage.')
    })

    it('shows neither final third message when sentenceType is not Custodial sentence', () => {
      const document = renderPartial({ forename: 'Alex', sentenceType: 'Community sentence' })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const finalThirdParagraph = paragraphs.find(p => p.textContent?.includes('final third stage'))

      expect(finalThirdParagraph).toBeUndefined()
    })
  })

  describe('IOM red RAG status (line 31)', () => {
    it('shows the IOM red RAG message when isRedIOM is true', () => {
      const document = renderPartial({ forename: 'Alex', isRedIOM: true })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const iomParagraph = paragraphs.find(p => p.textContent?.includes('IOM red RAG status'))

      expect(iomParagraph?.textContent).toContain(
        'Alex has an IOM red RAG status. The maximum number of appointments is the same as tier A.',
      )
    })

    it('does not show the IOM red RAG message when isRedIOM is false', () => {
      const document = renderPartial({ forename: 'Alex', isRedIOM: false })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const iomParagraph = paragraphs.find(p => p.textContent?.includes('IOM red RAG status'))

      expect(iomParagraph).toBeUndefined()
    })

    it('does not show the IOM red RAG message when isRedIOM is not set', () => {
      const document = renderPartial({ forename: 'Alex' })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const iomParagraph = paragraphs.find(p => p.textContent?.includes('IOM red RAG status'))

      expect(iomParagraph).toBeUndefined()
    })
  })

  describe('female discretionary appointments (line 35)', () => {
    it('shows the discretionary appointments message for a female non-IOM person', () => {
      const document = renderPartial({ forename: 'Alex', gender: 'female', tierScore: 'B', isRedIOM: false })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p =>
        p.textContent?.includes('additional discretionary appointments'),
      )

      expect(discretionaryParagraph?.textContent).toContain(
        'As a woman in tier B, Alex can have up to 5 additional discretionary appointments.',
      )
    })

    it('does not show the discretionary appointments message when gender is female but isRedIOM is true', () => {
      const document = renderPartial({ forename: 'Alex', gender: 'female', tierScore: 'B', isRedIOM: true })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p =>
        p.textContent?.includes('additional discretionary appointments'),
      )

      expect(discretionaryParagraph).toBeUndefined()
    })

    it('does not show the discretionary appointments message when gender is not female', () => {
      const document = renderPartial({ forename: 'Alex', gender: 'male', tierScore: 'B', isRedIOM: false })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p =>
        p.textContent?.includes('additional discretionary appointments'),
      )

      expect(discretionaryParagraph).toBeUndefined()
    })
  })
})
