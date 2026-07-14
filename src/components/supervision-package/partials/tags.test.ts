import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })

const renderPartial = (params = {}) => {
  const html = env.render('supervision-package/partials/_tags.njk', { params })
  return new JSDOM(html).window.document
}

const getBadgeText = (document: Document) =>
  Array.from(document.querySelectorAll('.app-status-badge')).map(el => el.textContent?.trim())

describe('_tags partial', () => {
  describe('No appointments remaining badge', () => {
    it('shows the badge when appointmentsCompleted equals appointmentsAllowance', () => {
      const document = renderPartial({
        phaseEndDate: '1 January 2026',
        appointmentsCompleted: 10,
        appointmentsAllowance: 10,
      })

      expect(getBadgeText(document)).toContain('No appointments remaining')
    })

    it('shows the badge when appointmentsCompleted exceeds appointmentsAllowance', () => {
      const document = renderPartial({
        phaseEndDate: '1 January 2026',
        appointmentsCompleted: 11,
        appointmentsAllowance: 10,
      })
      expect(getBadgeText(document)).toContain('No appointments remaining')
    })

    it('does not show the badge when appointmentsCompleted is less than appointmentsAllowance', () => {
      const document = renderPartial({
        phaseEndDate: '1 January 2026',
        appointmentsCompleted: 5,
        appointmentsAllowance: 10,
      })

      expect(getBadgeText(document)).not.toContain('No appointments remaining')
    })

    it('shows the badge when appointmentsCompleted and appointmentsAllowance are both 0', () => {
      const document = renderPartial({
        phaseEndDate: '1 January 2026',
        appointmentsCompleted: 0,
        appointmentsAllowance: 0,
      })
      expect(getBadgeText(document)).toContain('No appointments remaining')
    })

    it('does not show the badge when appointmentsCompleted >= appointmentsAllowance but isOPD is true', () => {
      const document = renderPartial({
        appointmentsCompleted: 10,
        appointmentsAllowance: 10,
        isOPD: true,
      })
      expect(getBadgeText(document)).not.toContain('No appointments remaining')
    })
  })

  describe('Offender personality disorder badge', () => {
    it('shows the badge when isOPD is true', () => {
      const document = renderPartial({ inputs: { offenderPersonalDisorderPathway: true } })

      expect(getBadgeText(document)).toContain('Offender personality disorder')
    })

    it('does not show the badge when isOPD is false', () => {
      const document = renderPartial({ inputs: { offenderPersonalDisorderPathway: false } })

      expect(getBadgeText(document)).not.toContain('Offender personality disorder')
    })

    it('does not show the badge when isOPD is not set', () => {
      const document = renderPartial({})

      expect(getBadgeText(document)).not.toContain('Offender personality disorder')
    })
  })

  describe('In breach badge', () => {
    it('shows the badge when isInBreach is true', () => {
      const document = renderPartial({ isInBreach: true })

      expect(getBadgeText(document)).toContain('In breach')
    })

    it('does not show the badge when isInBreach is false', () => {
      const document = renderPartial({ isInBreach: false })

      expect(getBadgeText(document)).not.toContain('In breach')
    })

    it('does not show the badge when isInBreach is not set', () => {
      const document = renderPartial({})

      expect(getBadgeText(document)).not.toContain('In breach')
    })
  })

  describe('In custody badge', () => {
    it('shows the badge when isCustody is true', () => {
      const document = renderPartial({ isCustody: true })

      expect(getBadgeText(document)).toContain('In custody')
    })

    it('does not show the badge when isCustody is false', () => {
      const document = renderPartial({ isCustody: false })

      expect(getBadgeText(document)).not.toContain('In custody')
    })

    it('does not show the badge when isCustody is not set', () => {
      const document = renderPartial({})

      expect(getBadgeText(document)).not.toContain('In custody')
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
        inputs: { offenderPersonalDisorderPathway: true, integratedOffenderManagementRedRated: true },
        isInBreach: true,
        isCustody: true,
      })

      const badges = getBadgeText(document)
      expect(badges).toEqual(
        expect.arrayContaining([
          'IOM (Integrated Offender Management): Red',
          'In breach',
          'In custody',
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
