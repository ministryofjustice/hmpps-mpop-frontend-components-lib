import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params = {}) => {
  const html = env.render('supervision-package/partials/_no-end-date.njk', { params })
  return new JSDOM(html).window.document
}

describe('_no-end-date partial', () => {
  it('renders the no end date paragraph', () => {
    const document = renderPartial({})

    const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
    const noEndDateParagraph = paragraphs.find(p => p.textContent?.includes('no supervision end date'))

    expect(noEndDateParagraph?.textContent?.trim()).toBe('There is no supervision end date.')
  })

  describe('IOM red RAG guidance', () => {
    it('shows the IOM guidance when integratedOffenderManagementRedRated is true', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' }, integratedOffenderManagementRedRated: true },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const iomParagraph = paragraphs.find(p => p.textContent?.includes('IOM red RAG status'))

      expect(iomParagraph?.textContent).toContain(
        'Alex has an IOM red RAG status. The maximum number of appointments is the same as tier A.',
      )
    })

    it('hides the IOM guidance when integratedOffenderManagementRedRated is false', () => {
      const document = renderPartial({
        context: { name: { forename: 'Alex' }, integratedOffenderManagementRedRated: false },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const iomParagraph = paragraphs.find(p => p.textContent?.includes('IOM red RAG status'))

      expect(iomParagraph).toBeUndefined()
    })

    it('hides the IOM guidance when context is not provided', () => {
      const document = renderPartial({ context: { name: { forename: 'Alex' } } })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const iomParagraph = paragraphs.find(p => p.textContent?.includes('IOM red RAG status'))

      expect(iomParagraph).toBeUndefined()
    })
  })

  describe('discretionary appointments guidance', () => {
    it('shows the discretionary appointments guidance for an eligible woman', () => {
      const document = renderPartial({
        tierScore: 'C',
        context: { name: { forename: 'Alex' }, gender: 'Female' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph?.textContent).toContain(
        'As a woman in tier C, Alex can have up to 5 additional discretionary appointments.',
      )
    })

    it('hides the discretionary appointments guidance when gender is not Female', () => {
      const document = renderPartial({
        tierScore: 'C',
        context: { name: { forename: 'Alex' }, gender: 'Male' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })

    it('hides the discretionary appointments guidance when tierScore is not eligible', () => {
      const document = renderPartial({
        tierScore: 'B',
        context: { name: { forename: 'Alex' }, gender: 'Female' },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })

    it('hides the discretionary appointments guidance when integratedOffenderManagementRedRated is true', () => {
      const document = renderPartial({
        tierScore: 'C',
        context: { name: { forename: 'Alex' }, gender: 'Female', integratedOffenderManagementRedRated: true },
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body'))
      const discretionaryParagraph = paragraphs.find(p => p.textContent?.includes('discretionary appointments'))

      expect(discretionaryParagraph).toBeUndefined()
    })
  })
})
