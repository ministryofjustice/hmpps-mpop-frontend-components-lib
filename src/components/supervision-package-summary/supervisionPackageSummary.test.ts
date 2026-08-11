import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "supervision-package-summary/macro.njk" import supervisionPackageSummary %}
     {{ supervisionPackageSummary(params) }}`,
    { params },
  )
  return new JSDOM(html).window.document
}

describe('supervision-package-summary', () => {
  it('renders the early engagement stage', () => {
    const document = renderComponent({
      currentPhase: {
        phase: { code: 'INIT' },
      },
      forename: 'Stuart',
      context: {
        finalThirdEligibility: {
          eligible: false,
        },
      },
      earlyEngagement: {
        startDate: '2026-08-06T13:46:16.916Z',
        endDate: '2026-08-06T13:46:16.916Z',
        weeks: 4,
        completed: 2,
      },
      currentYear: {
        startDate: '2026-08-06',
        endDate: '2026-08-06',
        appointments: {
          allowance: 0,
          scheduled: 1,
          completed: 0,
        },
      },
    })

    expect(document.querySelector('.supervision-package-summary')).not.toBeNull()
    expect(document.querySelector('h3')?.textContent?.trim()).toBe('Supervision package summary')
    expect(document.body.textContent.trim()).toContain('2 of 4 early engagement appointments used')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(1) .govuk-summary-list__key')
        ?.textContent?.trim(),
    ).toBe('Required')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(1) .govuk-summary-list__value')
        ?.textContent?.trim(),
    ).toBe('4')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(2) .govuk-summary-list__key')
        ?.textContent?.trim(),
    ).toBe('Remaining')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(2) .govuk-summary-list__value')
        ?.textContent?.trim(),
    ).toBe('2')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(3) .govuk-summary-list__key')
        ?.textContent?.trim(),
    ).toBe('Upcoming')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(3) .govuk-summary-list__value')
        ?.textContent?.trim(),
    ).toBe('1')
    expect(document.querySelector('.govuk-details__summary-text')?.textContent?.trim()).toBe(
      'Help with the early engagement stage',
    )
    expect(document.querySelector('.govuk-details__text p:nth-child(1)')?.textContent?.trim()).toBe(
      'You should see Stuart every week for the first 4 weeks of the sentence.',
    )
    expect(document.querySelector('.govuk-details__text p:nth-child(2)')?.textContent?.trim()).toBe(
      'Early engagement is expected to end on 6 August 2026 if Stuart attends the required appointments by then.',
    )
    expect(document.querySelector('.govuk-details__text p:nth-child(3)')?.textContent?.trim()).toBe(
      'Stuart will then have a maximum of 4 supervision appointments for the rest of this sentence year.',
    )
  })

  it('renders the supervision stage', () => {
    const document = renderComponent({
      currentPhase: {
        phase: { code: 'STD' },
      },
      forename: 'Stuart',
      context: {
        finalThirdEligibility: {
          eligible: false,
        },
      },
      earlyEngagement: {
        startDate: '2026-08-06T13:46:16.916Z',
        endDate: '2026-08-06T13:46:16.916Z',
        weeks: 0,
        completed: 0,
      },
      currentYear: {
        startDate: '2026-08-06',
        endDate: '2026-08-06',
        appointments: {
          allowance: 4,
          scheduled: 1,
          completed: 2,
        },
      },
    })

    expect(document.querySelector('.supervision-package-summary')).not.toBeNull()
    expect(document.querySelector('h3')?.textContent?.trim()).toBe('Supervision package summary')
    expect(document.body.textContent.trim()).toContain('2 of 4 appointments used')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(1) .govuk-summary-list__key')
        ?.textContent?.trim(),
    ).toBe('Maximum')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(1) .govuk-summary-list__value')
        ?.textContent?.trim(),
    ).toBe('4')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(2) .govuk-summary-list__key')
        ?.textContent?.trim(),
    ).toBe('Remaining')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(2) .govuk-summary-list__value')
        ?.textContent?.trim(),
    ).toBe('2')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(3) .govuk-summary-list__key')
        ?.textContent?.trim(),
    ).toBe('Upcoming')
    expect(
      document
        .querySelector('.govuk-summary-list .govuk-summary-list__row:nth-child(3) .govuk-summary-list__value')
        ?.textContent?.trim(),
    ).toBe('1')
    expect(document.querySelector('.govuk-details__summary-text')?.textContent?.trim()).toBe(
      'Help with the supervision stage',
    )
    expect(document.querySelector('.govuk-details__text p:nth-child(1)')?.textContent?.trim()).toBe(
      'Stuart has a maximum of 2 appointments remaining.',
    )
    expect(document.querySelector('.govuk-details__text p:nth-child(2)')?.textContent?.trim()).toBe(
      'Appointments reset with the supervision package on 6 August 2026.',
    )
  })

  it('renders the last third stage', () => {
    const document = renderComponent({
      currentPhase: {
        phase: { code: 'STD' },
      },
      forename: 'Stuart',
      context: {
        nationalSecurityDivision: true,
        finalThirdEligibility: {
          eligible: true,
        },
        sentences: [
          {
            type: { custodial: true },
            custody: { finalThirdDate: '2026-08-06' },
          },
        ],
      },
      earlyEngagement: {
        startDate: '2026-08-06T13:46:16.916Z',
        endDate: '2026-08-06T13:46:16.916Z',
        weeks: 0,
        completed: 0,
      },
      currentYear: {
        startDate: '2026-08-06',
        endDate: '2026-08-06',
        appointments: {
          allowance: 4,
          scheduled: 1,
          completed: 2,
        },
      },
    })

    expect(document.querySelector('.supervision-package-summary')).not.toBeNull()
    expect(document.querySelector('h3')?.textContent?.trim()).toBe('Supervision package summary')
    expect(document.querySelector('.govuk-summary-list')).toBeNull()
    expect(document.querySelector('.govuk-details')).toBeNull()
    expect(document.body.textContent).toContain('Stuart is in the final third of the sentence.')
    expect(document.body.textContent).toContain(
      'Meet Stuart if there is a need for responsive management, risk or enforcement activity.',
    )
  })
})
