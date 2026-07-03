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

  describe('when appointmentsCompleted < earlyEngagementWeeks', () => {
    const document = renderPartial({
      forename: 'Alex',
      appointmentsCompleted: 2,
      earlyEngagementWeeks: 5,
      appointmentsAllowance: 20,
      phaseEndDate: '1 January 2026',
    })
    const bodyText = document.body.textContent ?? ''

    it('renders the weekly-attendance guidance paragraph', () => {
      expect(bodyText).toContain('You should see Alex every week for the first 5 weeks of the sentence.')
    })

    it('appends the conditional attendance clause to the end-date sentence', () => {
      expect(bodyText).toContain(
        'Early engagement ends on 1 January 2026 if Alex attends the required appointments by then.',
      )
    })
  })

  describe('when appointmentsCompleted >= earlyEngagementWeeks', () => {
    const document = renderPartial({
      forename: 'Alex',
      appointmentsCompleted: 5,
      earlyEngagementWeeks: 5,
      appointmentsAllowance: 20,
      phaseEndDate: '1 January 2026',
    })
    const bodyText = document.body.textContent ?? ''

    it('does not render the weekly-attendance guidance paragraph', () => {
      expect(bodyText).not.toContain('You should see Alex every week')
    })

    it('omits the conditional attendance clause from the end-date sentence', () => {
      expect(bodyText).toContain('Early engagement ends on 1 January 2026.')
      expect(bodyText).not.toContain('if Alex attends the required appointments by then')
    })
  })
})
