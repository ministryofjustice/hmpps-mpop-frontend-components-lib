import { getPrimarySentences } from './getPrimarySentences'

type Sentence = {
  supervisionPackage?: { code?: string }
  custody?: {
    location?: {
      code?: string
    }
  }
}

export const isAtLarge = (sentences?: Sentence[] | null): boolean =>
  getPrimarySentences(sentences).some(sentence => sentence?.custody?.location?.code === 'UATLRG')
