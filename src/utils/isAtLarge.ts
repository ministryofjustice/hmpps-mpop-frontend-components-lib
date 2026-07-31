import { getPrimarySentences } from './getPrimarySentences'

type Sentence = {
  supervisionPackage?: { code?: string }
  custody?: {
    location?: {
      code?: string
    }
  }
}

type RecallStatus = {
  code?: string
}

export const isAtLarge = (sentences?: Sentence[] | null, recallStatus?: RecallStatus | null): boolean =>
  getPrimarySentences(sentences).some(sentence => sentence?.custody?.location?.code === 'UATLRG')
