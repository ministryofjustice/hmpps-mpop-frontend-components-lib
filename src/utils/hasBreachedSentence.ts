import { getPrimarySentences } from './getPrimarySentences'

type Sentence = {
  supervisionPackage?: { code?: string }
  inBreach?: boolean
}

export const hasBreachedSentence = (sentences?: Sentence[] | null): boolean =>
  getPrimarySentences(sentences).some(sentence => sentence?.inBreach === true)
