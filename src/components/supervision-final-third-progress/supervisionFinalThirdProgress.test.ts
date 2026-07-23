import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'

const env = nunjucks.configure(
  ['src/components', 'node_modules/govuk-frontend/dist'],
  { autoescape: true },
)

mpopNunjucksSetup(env)

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "supervision-final-third-progress/macro.njk" import supervisionFinalThirdProgress %}
     {{ supervisionFinalThirdProgress(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

describe('supervision-final-third-progress', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const baseParams = {
    tierScore: 'A',
    headerTierLink: '/tier-history',
    supervisionPackage: {
      inputs: {
        sentences: [
          {
            endDate: '2027-01-07',
            custody: {
              finalThirdDate: '2026-11-07',
            },
          },
        ],
      },
    },
  }

  it('renders the component', () => {
    jest.setSystemTime(new Date('2026-10-01'))

    const document = renderComponent(baseParams)

    expect(document.querySelector('.supervision-final-third-progress')).not.toBeNull()

    expect(document.querySelector('h3')?.textContent?.trim()).toBe(
      'Final third progress',
    )

    expect(document.querySelector('h4')?.textContent?.trim()).toBe(
      'Tier: A',
    )

    const link = document.querySelector('a')

    expect(link?.textContent?.trim()).toBe('View tier change history')
    expect(link?.getAttribute('href')).toBe('/tier-history')
  })

  it('renders the formatted final third date', () => {
    jest.setSystemTime(new Date('2026-10-01'))

    const document = renderComponent(baseParams)

    const dateCell = document.querySelector('.govuk-table__cell')

    expect(dateCell?.textContent?.trim()).toBe('7 November 2026')
  })

  it('renders the Not Started status', () => {
    jest.setSystemTime(new Date('2026-10-01'))

    const document = renderComponent(baseParams)

    const tag = document.querySelector('.govuk-tag')

    expect(tag?.textContent?.trim()).toBe('Not Started')
    expect(tag?.classList.contains('govuk-tag--blue')).toBe(true)
  })

  it('renders the In Progress status', () => {
    jest.setSystemTime(new Date('2026-11-08'))

    const document = renderComponent(baseParams)

    const tag = document.querySelector('.govuk-tag')

    expect(tag?.textContent?.trim()).toBe('In Progress')
    expect(tag?.classList.contains('govuk-tag--green')).toBe(true)
  })

  it('renders the Ended status', () => {
    jest.setSystemTime(new Date('2027-01-08'))

    const document = renderComponent(baseParams)

    const tag = document.querySelector('.govuk-tag')

    expect(tag?.textContent?.trim()).toBe('Ended')
    expect(tag?.classList.contains('govuk-tag--grey')).toBe(true)
  })
})