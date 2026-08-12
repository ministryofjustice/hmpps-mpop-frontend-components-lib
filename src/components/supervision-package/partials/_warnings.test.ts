import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params = {}) => {
  const html = env.render('supervision-package/partials/_warnings.njk', { params })
  return new JSDOM(html).window.document
}

const breachedSentence = {
  supervisionPackage: { code: 'STD' },
  inBreach: true,
  custody: { status: { code: 'B' } },
}

const inCustodySentence = {
  supervisionPackage: { code: 'STD' },
  inBreach: false,
  custody: { status: { code: 'R', description: 'Recalled' } },
}

const context = (sentences: object[]) => ({
  context: { name: { forename: 'Alex' }, sentences },
})

describe('_warnings partial', () => {
  describe('when the person is in breach', () => {
    it('renders the breach warning', () => {
      const document = renderPartial(context([breachedSentence]))

      const warning = document.querySelector('.govuk-warning-text__text')

      expect(warning?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
        'Warning Alex is in breach. You should continue to offer appointments.',
      )
    })

    it('renders the breach warning even when the person is also in custody', () => {
      const document = renderPartial(context([breachedSentence, inCustodySentence]))

      const warnings = document.querySelectorAll('.govuk-warning-text')

      expect(warnings).toHaveLength(1)
      expect(warnings[0].textContent).toContain('is in breach')
    })
  })

  describe('when the person has been recalled', () => {
    it('renders the recall warning', () => {
      const document = renderPartial(context([inCustodySentence]))

      const warning = document.querySelector('.govuk-warning-text__text')

      expect(warning?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
        'Warning Alex has been recalled. Their appointments are paused.',
      )
    })
  })

  describe('when there is nothing to warn about', () => {
    it('renders nothing when the person is neither in breach nor in custody', () => {
      const document = renderPartial(
        context([{ supervisionPackage: { code: 'STD' }, inBreach: false, custody: { status: { code: 'A' } } }]),
      )

      expect(document.querySelector('.govuk-warning-text')).toBeNull()
      expect(document.body.textContent?.trim()).toBe('')
    })

    it('renders nothing when there are no sentences', () => {
      const document = renderPartial(context([]))

      expect(document.querySelector('.govuk-warning-text')).toBeNull()
    })

    it('ignores non-primary (SPX) sentences', () => {
      const document = renderPartial(context([{ ...breachedSentence, supervisionPackage: { code: 'SPX' } }]))

      expect(document.querySelector('.govuk-warning-text')).toBeNull()
    })
  })
})
