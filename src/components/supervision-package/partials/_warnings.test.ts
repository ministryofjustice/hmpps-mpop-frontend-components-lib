import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'
import { getPrimarySentence } from '../../../utils/getPrimarySentence'
import { FrontendSentence } from '../../../types/SupervisionPackage'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params: Record<string, unknown> = {}) => {
  // mirrors `{% set sentence = params.context.sentences | getPrimarySentence %}` in template.njk
  const sentence = getPrimarySentence((params as { context?: { sentences?: FrontendSentence[] } }).context?.sentences)
  const html = env.render('supervision-package/partials/_warnings.njk', {
    params,
    sentence,
    forename: (params as { context?: { name?: { forename?: string } } }).context?.name?.forename,
  })
  return new JSDOM(html).window.document
}

const breachedSentence = {
  supervisionPackage: { code: 'STD' },
  inBreach: true,
  custody: { status: { code: 'B' } },
  isPrimarySentence: true,
}

const recalledSentence = {
  supervisionPackage: { code: 'STD' },
  inBreach: false,
  custody: { status: { code: 'C', description: 'Recalled' } },
  isPrimarySentence: true,
}

const inCustodySentence = {
  supervisionPackage: { code: 'STD' },
  inBreach: false,
  custody: { status: { code: 'R', description: 'In custody' } },
  isPrimarySentence: true,
}

const atLargeSentence = {
  supervisionPackage: { code: 'STD' },
  inBreach: false,
  custody: { location: { code: 'UATLRG' } },
  isPrimarySentence: true,
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

    it('renders the breach warning even when a non-primary sentence is also in custody', () => {
      const document = renderPartial(context([breachedSentence, { ...inCustodySentence, isPrimarySentence: false }]))

      const warnings = document.querySelectorAll('.govuk-warning-text')

      expect(warnings).toHaveLength(1)
      expect(warnings[0].textContent).toContain('is in breach')
    })
  })

  describe('when the person has been recalled', () => {
    it('renders the recall warning', () => {
      const document = renderPartial(context([recalledSentence]))

      const warning = document.querySelector('.govuk-warning-text__text')

      expect(warning?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
        'Warning Alex has been recalled. Their appointments are paused.',
      )
    })

    it('renders the recall warning even when a non-primary sentence is in general custody', () => {
      const document = renderPartial(context([recalledSentence, { ...inCustodySentence, isPrimarySentence: false }]))

      const warnings = document.querySelectorAll('.govuk-warning-text')

      expect(warnings).toHaveLength(1)
      expect(warnings[0].textContent).toContain('has been recalled')
    })
  })

  describe('when the person is in custody but not recalled', () => {
    it('renders the in-custody warning', () => {
      const document = renderPartial(context([inCustodySentence]))

      const warning = document.querySelector('.govuk-warning-text__text')

      expect(warning?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
        'Warning Alex is in custody. Their appointments are paused.',
      )
    })
  })

  describe('when the person is unlawfully at large', () => {
    it('renders the at large warning', () => {
      const document = renderPartial(context([atLargeSentence]))

      const warning = document.querySelector('.govuk-warning-text__text')

      expect(warning?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
        'Warning Alex is unlawfully at large. You should continue to offer appointments.',
      )
    })

    it('renders the in-custody warning instead when the primary sentence is both at large and in custody', () => {
      const document = renderPartial(
        context([
          {
            ...atLargeSentence,
            custody: { ...atLargeSentence.custody, status: { code: 'R', description: 'In custody' } },
          },
        ]),
      )

      const warnings = document.querySelectorAll('.govuk-warning-text')

      expect(warnings).toHaveLength(1)
      expect(warnings[0].textContent).toContain('is in custody')
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
  })
})
