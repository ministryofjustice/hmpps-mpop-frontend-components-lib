import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params = {}) => {
  const html = env.render('supervision-package/partials/_tier.njk', { params })
  return new JSDOM(html).window.document
}

describe('_tier partial', () => {
  describe('tier heading', () => {
    it('renders the tier score in the heading', () => {
      const document = renderPartial({ tierScore: 'A2' })

      const heading = document.querySelector('h4.govuk-heading-s')

      expect(heading?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Tier A2')
    })

    it('renders just "Tier" when the tier score is MISSING', () => {
      const document = renderPartial({ tierScore: 'MISSING' })

      const heading = document.querySelector('h4.govuk-heading-s')

      expect(heading?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Tier')
    })

    it('exposes a single accessible name via aria-label so assistive tech reads it as one phrase', () => {
      const document = renderPartial({ tierScore: 'A2', tag: { text: 'Confirmed', color: 'green' } })

      const heading = document.querySelector('h4.govuk-heading-s')

      expect(heading?.getAttribute('aria-label')).toBe('Tier A2 Confirmed')
      heading?.querySelectorAll('span, strong').forEach(element => {
        expect(element.getAttribute('aria-hidden')).toBe('true')
      })
    })

    it('exposes "Tier" as the accessible name when there is no tag', () => {
      const document = renderPartial({ tierScore: 'A2' })

      const heading = document.querySelector('h4.govuk-heading-s')

      expect(heading?.getAttribute('aria-label')).toBe('Tier A2')
    })

    it('does not include the word "undefined" in the accessible name when tierScore is missing entirely', () => {
      const document = renderPartial({ tag: { text: 'Unavailable', color: 'grey' } })

      const heading = document.querySelector('h4.govuk-heading-s')

      expect(heading?.getAttribute('aria-label')).toBe('Tier Unavailable')
    })
  })

  describe('tag', () => {
    it('renders the tag when both text and color are provided', () => {
      const document = renderPartial({ tierScore: 'A2', tag: { text: 'Confirmed', color: 'green' } })

      const tag = document.querySelector('strong.govuk-tag')

      expect(tag?.textContent?.trim()).toBe('Confirmed')
      expect(tag?.classList.contains('govuk-tag--green')).toBe(true)
    })

    it('renders the tag as a strong inside the heading so it is announced as part of the same phrase', () => {
      const document = renderPartial({ tierScore: 'A2', tag: { text: 'Confirmed', color: 'green' } })

      const heading = document.querySelector('h4.govuk-heading-s')

      expect(heading?.querySelector('strong.govuk-tag')).not.toBeNull()
      expect(heading?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Tier A2 Confirmed')
    })

    it('hides the visual tag from assistive tech since the heading aria-label already includes it', () => {
      const document = renderPartial({ tierScore: 'A2', tag: { text: 'Confirmed', color: 'green' } })

      const tag = document.querySelector('strong.govuk-tag')

      expect(tag?.getAttribute('aria-hidden')).toBe('true')
    })

    it('does not render the tag when the text is missing', () => {
      const document = renderPartial({ tierScore: 'A2', tag: { color: 'green' } })

      expect(document.querySelector('strong.govuk-tag')).toBeNull()
    })

    it('does not render the tag when the color is missing', () => {
      const document = renderPartial({ tierScore: 'A2', tag: { text: 'Confirmed' } })

      expect(document.querySelector('strong.govuk-tag')).toBeNull()
    })

    it('does not render the tag when no tag is provided', () => {
      const document = renderPartial({ tierScore: 'A2' })

      expect(document.querySelector('strong.govuk-tag')).toBeNull()
    })
  })

  describe('provisional message', () => {
    it('renders the provisional message when the tag text is Provisional', () => {
      const document = renderPartial({ tierScore: 'A2', tag: { text: 'Provisional', color: 'yellow' } })

      const paragraph = document.querySelector('p.govuk-body')

      expect(paragraph?.textContent?.trim()).toBe(
        'We will calculate the supervision package once the tier is confirmed.',
      )
    })

    it('does not render the provisional message for other tag text', () => {
      const document = renderPartial({ tierScore: 'A2', tag: { text: 'Confirmed', color: 'green' } })

      expect(document.querySelector('p.govuk-body')).toBeNull()
    })
  })

  describe('unavailable message', () => {
    it('renders the unavailable message when the tag text is Unavailable', () => {
      const document = renderPartial({ tierScore: 'MISSING', tag: { text: 'Unavailable', color: 'grey' } })

      const paragraph = document.querySelector('p.govuk-body')

      expect(paragraph?.textContent?.trim()).toBe('Tier information is currently unavailable.')
    })

    it('does not render the unavailable message for other tag text', () => {
      const document = renderPartial({ tierScore: 'A2', tag: { text: 'Confirmed', color: 'green' } })

      expect(document.querySelector('p.govuk-body')).toBeNull()
    })
  })
})
