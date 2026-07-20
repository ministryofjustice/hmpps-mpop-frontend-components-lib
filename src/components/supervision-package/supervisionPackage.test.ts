import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { tierTags } from '../../MPoPComponents'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "supervision-package/macro.njk" import supervisionPackage %}
     {{ supervisionPackage(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

describe('supervision-package', () => {
  it.each`
    name             | tag                     | expectedTagText  | expectedTagClass       | expectedBodyText
    ${'provisional'} | ${tierTags.provisional} | ${'Provisional'} | ${'govuk-tag--orange'} | ${'We will calculate the supervision package once the tier is confirmed.'}
    ${'missing'}     | ${tierTags.missing}     | ${'Missing'}     | ${'govuk-tag--red'}    | ${null}
    ${'unavailable'} | ${tierTags.unavailable} | ${'Unavailable'} | ${'govuk-tag--grey'}   | ${'Tier information is currently unavailable.'}
    ${'none'}        | ${tierTags.none}        | ${null}          | ${null}                | ${null}
  `('renders the "$name" tag state', ({ tag, expectedTagText, expectedTagClass, expectedBodyText }) => {
    const document = renderComponent({ tierScore: 'C', tag, historyHref: '#' })

    expect(document.querySelector('.supervision-package')).not.toBeNull()
    expect(document.querySelector('h2')?.textContent?.trim()).toBe('Supervision package')
    expect(document.querySelector('h3')?.textContent?.trim()).toBe('Tier C')
    expect(document.querySelector('a')?.textContent?.trim()).toBe('View tier change history')

    const tagElement = document.querySelector('.govuk-tag')

    if (expectedTagText) {
      expect(tagElement?.textContent?.trim()).toBe(expectedTagText)
      expect(tagElement?.classList.contains(expectedTagClass)).toBe(true)
    } else {
      expect(tagElement).toBeNull()
    }

    if (expectedBodyText) {
      expect(document.body.textContent).toContain(expectedBodyText)
    }
  })

  it('renders the early engagement stage when phaseName is Early engagement', () => {
    const document = renderComponent({
      tierScore: 'C',
      tag: { text: null, color: null },
      historyHref: '#',
      phase: { name: { code: 'INIT', description: 'Early engagement' } },
      forename: 'Alex',
      earlyEngagement: { weeks: 5, completed: 2 },
      currentYear: { appointments: { allowance: 20, scheduled: 0, completed: 2 } },
      allAppointmentsHref: '#',
    })

    expect(document.querySelector('.supervision-package')).not.toBeNull()
    const headings = document.querySelectorAll('h3')
    const headingTexts = Array.from(headings).map(h => h.textContent?.trim())
    expect(headingTexts).toContain('Early engagement stage')
    expect(headingTexts).not.toContain('Stage title')
  })

  it('hides the tier score when tierScore is MISSING', () => {
    const document = renderComponent({ tierScore: 'MISSING', tag: tierTags.missing, historyHref: '#' })

    expect(document.querySelector('.supervision-package')).not.toBeNull()
    expect(document.querySelector('h2')?.textContent?.trim()).toBe('Supervision package')
    expect(document.querySelector('h3')?.textContent?.trim()).toBe('Tier')

    const tagElement = document.querySelector('.govuk-tag')
    expect(tagElement?.textContent?.trim()).toBe('Missing')
    expect(tagElement?.classList.contains('govuk-tag--red')).toBe(true)
  })

  describe('button group', () => {
    const findButton = (document: Document, text: string) =>
      Array.from(document.querySelectorAll('.govuk-button-group a')).find(a => a.textContent?.trim() === text)

    it('renders no button group when arrangeAppointmentHref, crn and deliusBaseURL are absent', () => {
      const document = renderComponent({ tierScore: 'C', tag: tierTags.none, historyHref: '#' })

      expect(document.querySelector('.govuk-button-group')).toBeNull()
    })

    it('renders only the "Arrange an appointment" button when only arrangeAppointmentHref is provided', () => {
      const document = renderComponent({
        tierScore: 'C',
        tag: tierTags.none,
        historyHref: '#',
        arrangeAppointmentHref: '/arrange-appointment',
      })

      expect(document.querySelector('.govuk-button-group')).not.toBeNull()

      const arrangeButton = findButton(document, 'Arrange an appointment')
      expect(arrangeButton?.getAttribute('href')).toBe('/arrange-appointment')

      expect(findButton(document, 'Update NDelius risk flag')).toBeUndefined()
    })

    it('renders only the "Update NDelius risk flag" button when crn and deliusBaseURL are provided', () => {
      const document = renderComponent({
        tierScore: 'C',
        tag: tierTags.none,
        historyHref: '#',
        crn: 'X123456',
        deliusBaseURL: 'https://ndelius.test.probation.service.justice.gov.uk',
      })

      expect(document.querySelector('.govuk-button-group')).not.toBeNull()

      expect(findButton(document, 'Arrange an appointment')).toBeUndefined()

      const updateRiskButton = findButton(document, 'Update NDelius risk flag')
      expect(updateRiskButton?.getAttribute('href')).toBe(
        'https://ndelius.test.probation.service.justice.gov.uk/NDelius-war/delius/JSP/deeplink.xhtml?component=RegisterSummary&CRN=X123456',
      )
    })

    it('renders both buttons when arrangeAppointmentHref, crn and deliusBaseURL are all provided', () => {
      const document = renderComponent({
        tierScore: 'C',
        tag: tierTags.none,
        historyHref: '#',
        arrangeAppointmentHref: '/arrange-appointment',
        crn: 'X123456',
        deliusBaseURL: 'https://ndelius.test.probation.service.justice.gov.uk',
      })

      expect(findButton(document, 'Arrange an appointment')).not.toBeUndefined()
      expect(findButton(document, 'Update NDelius risk flag')).not.toBeUndefined()
    })

    it('does not render the "Update NDelius risk flag" button when only crn is provided', () => {
      const document = renderComponent({
        tierScore: 'C',
        tag: tierTags.none,
        historyHref: '#',
        crn: 'X123456',
      })

      expect(document.querySelector('.govuk-button-group')).toBeNull()
      expect(findButton(document, 'Update NDelius risk flag')).toBeUndefined()
    })

    it('does not render the "Update NDelius risk flag" button when only deliusBaseURL is provided', () => {
      const document = renderComponent({
        tierScore: 'C',
        tag: tierTags.none,
        historyHref: '#',
        deliusBaseURL: 'https://ndelius.test.probation.service.justice.gov.uk',
      })

      expect(document.querySelector('.govuk-button-group')).toBeNull()
      expect(findButton(document, 'Update NDelius risk flag')).toBeUndefined()
    })
  })
})
