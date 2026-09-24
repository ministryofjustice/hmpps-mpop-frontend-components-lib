import { FrontendSentence } from '../types/SupervisionPackage'

const isSpx = (sentence?: FrontendSentence | null): boolean => sentence?.supervisionPackage?.code === 'SPX'

export const getPrimarySentence = <T extends FrontendSentence>(sentences?: T[] | null): T | null => {
  if (!sentences) {
    return null
  }

  if (sentences.length === 1 && !isSpx(sentences[0])) {
    return sentences[0]
  }

  return sentences.find(sentence => sentence?.supervisionPackage && !isSpx(sentence)) || null
}

// True when sentences exist but every one is explicitly excluded (SPX), as opposed to missing/unclassified data
export const isSpxOnlySentenceList = (sentences?: FrontendSentence[] | null): boolean =>
  !!sentences && sentences.length > 0 && sentences.every(sentence => isSpx(sentence))
