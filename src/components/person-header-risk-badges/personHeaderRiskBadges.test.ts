import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { arnsNunjucksSetup } from '@ministryofjustice/hmpps-arns-frontend-components-lib'
import { mpopNunjucksSetup } from '../../utils/nunjucksFilters'

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

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "person-header-risk-badges/macro.njk" import personHeaderRiskBadges %}
     {{ personHeaderRiskBadges(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

const riskData = (assessments = {}) => ({
  assessments: [
    {
      outputVersion: '2',
      completedDate: '09 June 2026',
      combinedSeriousReoffendingPredictor: {
        name: 'Combined serious reoffending predictor',
        band: 'LOW',
        staticOrDynamic: 'Dynamic',
        score: 0.18,
        completedDate: '09 June 2026',
      },
      ...assessments,
    },
  ],
  httpStatus: 200,
})

const rsr = { name: 'RSR', band: 'LOW', score: 0.77, staticOrDynamic: 'Static' }

const badge = (document: Document, name: string) => document.querySelector(`[data-badge-base="${name}"]`)

const badgeOrder = (document: Document) =>
  Array.from(document.querySelectorAll('.pop-header-risk-badges [data-badge-base]')).map(el =>
    el.getAttribute('data-badge-base'),
  )

describe('person-header-risk-badges', () => {
  describe('with the NDelius ROSH level', () => {
    const ndelius = { useNDeliusRosh: true, roshLevel: 'HIGH' }

    it('renders the ROSH badge with the NDelius level', () => {
      const document = renderComponent({ ...ndelius, riskData: riskData() })

      const rosh = badge(document, 'Risk of serious harm HIGH')
      expect(rosh?.querySelector('span')?.textContent).toContain('Risk of serious harm')
      expect(rosh?.classList.contains('arns-badge-base--high')).toBe(true)
      expect(rosh?.querySelector('strong')?.textContent).toContain('HIGH')
    })

    it('renders the ROSH badge even when the combined predictor is NOT APPLICABLE', () => {
      const document = renderComponent({
        ...ndelius,
        riskData: riskData({
          combinedSeriousReoffendingPredictor: {
            name: 'Combined serious reoffending predictor',
            band: 'NOT APPLICABLE',
          },
        }),
      })

      expect(badge(document, 'Risk of serious harm HIGH')).not.toBeNull()
      expect(badge(document, 'Combined serious reoffending predictor NOT APPLICABLE')).toBeNull()
    })

    it('does not render a ROSH badge when there is no level', () => {
      const document = renderComponent({ useNDeliusRosh: true, riskData: riskData() })

      expect(document.querySelector('[data-badge-base^="Risk of serious harm"]')).toBeNull()
    })

    it('renders the ROSH, combined predictor and RSR badges in that order', () => {
      const document = renderComponent({ ...ndelius, riskData: riskData({ rsr }) })

      expect(badgeOrder(document)).toEqual([
        'Risk of serious harm HIGH',
        'Combined serious reoffending predictor LOW',
        'RSR LOW',
      ])
    })
  })

  describe('with the ARNS ROSH level', () => {
    it("renders the ROSH badge with the 'Risk of serious harm' label when there is no RSR", () => {
      const document = renderComponent({ roshLevel: 'MEDIUM', riskData: riskData() })

      const rosh = badge(document, 'Risk of serious harm MEDIUM')
      expect(rosh?.querySelector('span')?.textContent).toContain('Risk of serious harm')
      expect(rosh?.classList.contains('arns-badge-base--medium')).toBe(true)
    })

    it("renders the ROSH badge with the 'ROSH' label when there is an RSR band", () => {
      const document = renderComponent({ roshLevel: 'MEDIUM', riskData: riskData({ rsr: { band: 'LOW' } }) })

      const rosh = badge(document, 'ROSH MEDIUM')
      expect(rosh?.querySelector('span')?.textContent).toContain('ROSH')
      expect(rosh?.classList.contains('arns-badge-base--medium')).toBe(true)
    })

    it('shows VERY_HIGH as VERY HIGH', () => {
      const document = renderComponent({ roshLevel: 'VERY_HIGH', riskData: riskData() })

      const rosh = badge(document, 'Risk of serious harm VERY HIGH')
      expect(rosh?.classList.contains('arns-badge-base--very-high')).toBe(true)
      expect(rosh?.querySelector('strong')?.textContent).toContain('VERY HIGH')
    })

    it('does not render any badges when the combined predictor is NOT APPLICABLE', () => {
      const document = renderComponent({
        roshLevel: 'MEDIUM',
        riskData: riskData({
          combinedSeriousReoffendingPredictor: {
            name: 'Combined serious reoffending predictor',
            band: 'NOT APPLICABLE',
          },
        }),
      })

      expect(document.querySelectorAll('[data-badge-base]')).toHaveLength(0)
      expect(document.querySelector('.pop-header-risk-badges')).toBeNull()
    })

    it('does not render a ROSH badge when the level is NOT_FOUND', () => {
      const document = renderComponent({ roshLevel: 'NOT_FOUND', riskData: riskData() })

      expect(document.querySelector('[data-badge-base^="Risk of serious harm"]')).toBeNull()
    })

    it('renders the ROSH, combined predictor and RSR badges in that order', () => {
      const document = renderComponent({ roshLevel: 'MEDIUM', riskData: riskData({ rsr }) })

      expect(badgeOrder(document)).toEqual(['ROSH MEDIUM', 'Combined serious reoffending predictor LOW', 'RSR LOW'])
    })
  })
})
