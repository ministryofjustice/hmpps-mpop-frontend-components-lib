import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { arnsNunjucksSetup } from '@ministryofjustice/hmpps-arns-frontend-components-lib'
import { toPersonHeaderParams } from './toPersonHeaderParams'
import { mpopNunjucksSetup } from './nunjucksFilters'
import type { ProfessionalContact } from '../types/ProfessionalContact'
import type { RiskFlag } from '../types/RiskFlag'

const professionalContact: ProfessionalContact = {
  name: { forename: 'Andrew', surname: 'Langley' },
  currentContacts: [
    {
      name: 'jack frost',
      telephoneNumber: '',
      email: '',
      provider: 'London',
      probationDeliveryUnit: 'Camden and Islington',
      team: 'Team 1',
      allocationDate: '2024-01-01',
      responsibleOfficer: true,
      prisonOffenderManager: false,
    },
  ],
  previousContacts: [],
}

const riskFlags: RiskFlag[] = [
  {
    id: 1,
    description: 'Risk to Staff',
    level: 'HIGH',
    createdDate: '2024-01-01',
    createdBy: { forename: 'Jane', surname: 'Smith' },
    removed: false,
    removalHistory: [],
  },
]

describe('toPersonHeaderParams', () => {
  it('builds the person header params', () => {
    const params = toPersonHeaderParams({
      crn: 'D004851',
      name: { forename: 'Andrew', surname: 'Langley' },
      dateOfBirth: '1995-11-18',
      tier: { tierScore: 'B4', provisional: true },
      historyHref: '/tier-history/D004851',
      professionalContact,
      riskFlags,
      personStatusTag: 'In custody',
      photo: '/search/prisoner-image/A1234BC',
      riskBadges: '<span>OGRS</span>',
      collapsibleRiskFlags: true,
    })

    expect(params).toEqual({
      name: 'Andrew Langley',
      crn: 'D004851',
      dob: '18 November 1995',
      tier: 'B4',
      provisional: true,
      historyHref: '/tier-history/D004851',
      managedBy: 'jack frost (Camden and Islington)',
      managedByName: 'jack frost',
      managedByLocation: 'Camden and Islington',
      managedByHref: '/case/D004851/personal-details/staff-contacts',
      photo: '/search/prisoner-image/A1234BC',
      riskBadges: '<span>OGRS</span>',
      riskData: undefined,
      roshLevel: undefined,
      useNDeliusRosh: undefined,
      personRiskFlags: {
        groupedBadges: expect.any(Array),
        headerBadges: [expect.objectContaining({ text: 'Risk to staff - High' })],
        remainingCount: 0,
      },
      collapsibleRiskFlags: true,
      riskHrefBase: undefined,
      showRisks: undefined,
      personStatusTag: 'In custody',
    })
  })

  it('title cases the tier score', () => {
    const params = toPersonHeaderParams({
      crn: 'D004851',
      name: { forename: 'Andrew', surname: 'Langley' },
      tier: { tierScore: 'MISSING' },
    })

    expect(params.tier).toBe('Missing')
    expect(params.provisional).toBe(false)
  })

  it('handles missing tier, contacts, risk flags and date of birth', () => {
    const params = toPersonHeaderParams({
      crn: 'D004851',
      name: { forename: 'Andrew', surname: 'Langley' },
      tier: null,
      professionalContact: null,
      riskFlags: null,
    })

    expect(params.tier).toBe('')
    expect(params.dob).toBeUndefined()
    expect(params.managedBy).toBe('No data available')
    expect(params.managedByHref).toBeUndefined()
    expect(params.personRiskFlags).toBeUndefined()
  })

  it('passes riskHrefBase and showRisks through', () => {
    const params = toPersonHeaderParams({
      crn: 'D004851',
      name: { forename: 'Andrew', surname: 'Langley' },
      riskHrefBase: 'https://mpop.example.com/case/D004851/risk',
      showRisks: false,
    })

    expect(params.riskHrefBase).toBe('https://mpop.example.com/case/D004851/risk')
    expect(params.showRisks).toBe(false)
  })

  it('uses managedByHref for the managed by link when given', () => {
    const params = toPersonHeaderParams({
      crn: 'D004851',
      name: { forename: 'Andrew', surname: 'Langley' },
      professionalContact,
      managedByHref: 'https://mpop.example.com/case/D004851/personal-details/staff-contacts',
    })

    expect(params.managedByHref).toBe('https://mpop.example.com/case/D004851/personal-details/staff-contacts')
  })

  it('passes riskData, roshLevel and useNDeliusRosh through', () => {
    const riskData = { assessments: [] }

    const params = toPersonHeaderParams({
      crn: 'D004851',
      name: { forename: 'Andrew', surname: 'Langley' },
      riskData,
      roshLevel: 'HIGH',
      useNDeliusRosh: true,
    })

    expect(params.riskData).toBe(riskData)
    expect(params.roshLevel).toBe('HIGH')
    expect(params.useNDeliusRosh).toBe(true)
  })

  it('uses riskBadgeData instead of building the badges from riskFlags when given', () => {
    const riskBadgeData = { groupedBadges: [], headerBadges: [], remainingCount: 3 }

    const params = toPersonHeaderParams({
      crn: 'D004851',
      name: { forename: 'Andrew', surname: 'Langley' },
      riskFlags,
      riskBadgeData,
    })

    expect(params.personRiskFlags).toBe(riskBadgeData)
  })

  it('produces params the personHeader macro renders', () => {
    const env = nunjucks.configure(['src/components'], { autoescape: true })
    mpopNunjucksSetup(env)

    const params = toPersonHeaderParams({
      crn: 'D004851',
      name: { forename: 'Andrew', surname: 'Langley' },
      dateOfBirth: '1995-11-18',
      tier: { tierScore: 'B4' },
      historyHref: '/tier-history/D004851',
      professionalContact,
      riskFlags,
    })

    const html = env.renderString(
      `{% from "person-header/macro.njk" import personHeader %}
       {{ personHeader(params) }}`,
      { params },
    )
    const { document } = new JSDOM(html).window

    expect(document.querySelector('[data-qa="personName"]')?.textContent?.trim()).toBe('Andrew Langley')
    expect(document.querySelector('[data-qa="dob"]')?.textContent?.trim()).toBe('18 November 1995')
    expect(document.querySelector('[data-qa="managedBy"]')?.textContent?.trim()).toBe(
      'Jack Frost (Camden and Islington)',
    )
    expect(document.querySelector('[data-qa="risk-badge-1"]')?.getAttribute('href')).toBe('/case/D004851/risk/flag/1')
  })

  it('produces params the personHeader macro renders the ARNS risk badges from', () => {
    const env = nunjucks.configure(
      [
        'src/components',
        'node_modules/govuk-frontend/dist',
        'node_modules/@ministryofjustice/hmpps-arns-frontend-components-lib/dist/',
      ],
      { autoescape: true },
    )
    mpopNunjucksSetup(env)
    arnsNunjucksSetup(env)

    const params = toPersonHeaderParams({
      crn: 'D004851',
      name: { forename: 'Andrew', surname: 'Langley' },
      riskData: {
        assessments: [
          {
            outputVersion: '2',
            combinedSeriousReoffendingPredictor: {
              name: 'Combined serious reoffending predictor',
              band: 'LOW',
              staticOrDynamic: 'Dynamic',
              score: 0.18,
            },
          },
        ],
      },
      roshLevel: 'HIGH',
      useNDeliusRosh: true,
    })

    const html = env.renderString(
      `{% from "person-header/macro.njk" import personHeader %}
       {{ personHeader(params) }}`,
      { params },
    )
    const { document } = new JSDOM(html).window

    const badges = Array.from(document.querySelectorAll('[data-qa="riskBadges"] [data-badge-base]')).map(el =>
      el.getAttribute('data-badge-base'),
    )
    expect(badges).toEqual(['Risk of serious harm HIGH', 'Combined serious reoffending predictor LOW'])
  })
})
