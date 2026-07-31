import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params = {}) => {
  const html = env.render('supervision-package/partials/_tags.njk', { params })
  return new JSDOM(html).window.document
}

const getBadgeText = (document: Document) =>
  Array.from(document.querySelectorAll('.app-status-badge')).map(el => el.textContent?.trim())

describe('_tags partial', () => {
  describe('No appointments remaining badge', () => {
    it('shows the badge when completed equals allowance', () => {
      const document = renderPartial({
        phaseEndDate: '1 January 2026',
        currentYear: {
          appointments: {
            completed: 10,
            allowance: 10,
          },
        },
      })
      expect(getBadgeText(document)).toContain('No appointments remaining')
    })

    it('shows the badge when completed exceeds allowance', () => {
      const document = renderPartial({
        phaseEndDate: '1 January 2026',
        currentYear: {
          appointments: {
            completed: 11,
            allowance: 10,
          },
        },
      })
      expect(getBadgeText(document)).toContain('No appointments remaining')
    })

    it('does not show the badge when completed is less than allowance', () => {
      const document = renderPartial({
        phaseEndDate: '1 January 2026',
        currentYear: {
          appointments: {
            completed: 5,
            allowance: 10,
          },
        },
      })

      expect(getBadgeText(document)).not.toContain('No appointments remaining')
    })

    it('shows the badge when completed and allowance are both 0', () => {
      const document = renderPartial({
        phaseEndDate: '1 January 2026',

        currentYear: {
          appointments: {
            completed: 0,
            allowance: 0,
          },
        },
      })
      expect(getBadgeText(document)).toContain('No appointments remaining')
    })

    it('does not show the badge when completed >= allowance but offenderPersonalDisorderPathway is true', () => {
      const document = renderPartial({
        currentYear: {
          appointments: {
            completed: 10,
            allowance: 10,
          },
        },
        inputs: { offenderPersonalDisorderPathway: true },
      })
      expect(getBadgeText(document)).not.toContain('No appointments remaining')
    })
  })

  describe('Offender personality disorder badge', () => {
    it('shows the badge when offenderPersonalDisorderPathway is true', () => {
      const document = renderPartial({ inputs: { offenderPersonalDisorderPathway: true } })

      expect(getBadgeText(document)).toContain('Offender personality disorder')
    })

    it('does not show the badge when offenderPersonalDisorderPathway is false', () => {
      const document = renderPartial({ inputs: { offenderPersonalDisorderPathway: false } })

      expect(getBadgeText(document)).not.toContain('Offender personality disorder')
    })

    it('does not show the badge when offenderPersonalDisorderPathway is not set', () => {
      const document = renderPartial({})

      expect(getBadgeText(document)).not.toContain('Offender personality disorder')
    })
  })

  describe('In breach badge', () => {
    it('shows the badge when a sentence is in breach and its code is not SPX', () => {
      const document = renderPartial({
        inputs: { sentences: [{ supervisionPackage: { code: 'SPA' }, inBreach: true }] },
      })

      expect(getBadgeText(document)).toContain('In breach')
    })

    it('does not show the badge when the breached sentence has code SPX', () => {
      const document = renderPartial({
        inputs: { sentences: [{ supervisionPackage: { code: 'SPX' }, inBreach: true }] },
      })

      expect(getBadgeText(document)).not.toContain('In breach')
    })

    it('does not show the badge when no sentences are in breach', () => {
      const document = renderPartial({
        inputs: { sentences: [{ supervisionPackage: { code: 'SPA' }, inBreach: false }] },
      })

      expect(getBadgeText(document)).not.toContain('In breach')
    })

    it('does not show the badge when sentences is not set', () => {
      const document = renderPartial({})

      expect(getBadgeText(document)).not.toContain('In breach')
    })
  })

  describe('In custody badge', () => {
    it.each`
      code   | description
      ${'D'} | ${'In Custody'}
      ${'I'} | ${'In Custody - IRC'}
      ${'R'} | ${'In Custody - RoTL'}
      ${'C'} | ${'Community custody'}
    `('shows the "$description" badge when sentences.custody.status.code is $code', ({ code, description }) => {
      const document = renderPartial({ inputs: { sentences: [{ custody: { status: { code, description } } }] } })

      expect(getBadgeText(document)).toContain(description)
    })

    it('does not show the "In custody" badge when sentences.custody.status.code is not set', () => {
      const document = renderPartial({ inputs: { sentences: [{ custody: { status: {} } }] } })

      expect(getBadgeText(document)).not.toContain('In custody')
    })

    it('does not show the "In custody" badge when sentences is not set', () => {
      const document = renderPartial({})

      expect(getBadgeText(document)).not.toContain('In custody')
    })

    it('does not show the "In custody" badge when the only matching sentence has code SPX', () => {
      const document = renderPartial({
        inputs: { sentences: [{ supervisionPackage: { code: 'SPX' }, custody: { status: { code: 'D' } } }] },
      })

      expect(getBadgeText(document)).not.toContain('In Custody')
    })

    it('shows the "Unlawfully at large" badge when sentences.custody.location.code is UATLRG', () => {
      const document = renderPartial({ inputs: { sentences: [{ custody: { location: { code: 'UATLRG' } } }] } })

      expect(getBadgeText(document)).toContain('Unlawfully at large')
      expect(getBadgeText(document)).not.toContain('In custody')
    })

    it('shows the recall status description as the badge when recallStatus has a code and no custody status/location matches', () => {
      const document = renderPartial({ inputs: { recallStatus: { code: 'REC01', description: 'Recall initiated' } } })

      expect(getBadgeText(document)).toContain('Recall initiated')
    })

    it('prefers "Unlawfully at large" over "In custody" and "Recall initiated" when both would apply', () => {
      const document = renderPartial({
        inputs: {
          recallStatus: { code: 'REC01', description: 'Recall initiated' },
          sentences: [{ custody: { location: { code: 'UATLRG' }, status: { code: 'D', description: 'In Custody' } } }],
        },
      })

      const badges = getBadgeText(document)
      expect(badges).toContain('Unlawfully at large')
      expect(badges).not.toContain('In custody')
      expect(badges).not.toContain('Recall initiated')
    })
  })

  describe('IOM badge', () => {
    it('shows the badge when isRedIOM is true', () => {
      const document = renderPartial({ inputs: { integratedOffenderManagementRedRated: true } })

      expect(getBadgeText(document)).toContain('IOM (Integrated Offender Management): Red')
    })

    it('does not show the badge when isRedIOM is false', () => {
      const document = renderPartial({ inputs: { integratedOffenderManagementRedRated: false } })

      expect(getBadgeText(document)).not.toContain('IOM (Integrated Offender Management): Red')
    })

    it('does not show the badge when isRedIOM is not set', () => {
      const document = renderPartial({})

      expect(getBadgeText(document)).not.toContain('IOM (Integrated Offender Management): Red')
    })
  })

  describe('multiple badges', () => {
    it('shows all applicable badges simultaneously', () => {
      const document = renderPartial({
        inputs: {
          offenderPersonalDisorderPathway: true,
          integratedOffenderManagementRedRated: true,
          sentences: [{ supervisionPackage: { code: 'SPA' }, inBreach: true }],
        },
      })

      const badges = getBadgeText(document)
      expect(badges).toEqual(
        expect.arrayContaining([
          'IOM (Integrated Offender Management): Red',
          'In breach',
          'Offender personality disorder',
        ]),
      )
    })

    it('shows no badges when no flags are set', () => {
      const document = renderPartial({
        phaseEndDate: '1 January 2026',
        appointmentsCompleted: 0,
        appointmentsAllowance: 10,
      })

      expect(getBadgeText(document)).toHaveLength(0)
    })
  })
})
