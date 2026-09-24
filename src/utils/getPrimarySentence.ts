import { FrontendSentence } from '../types/SupervisionPackage'

const isSpx = (sentence?: FrontendSentence | null): boolean => sentence?.supervisionPackage?.code === 'SPX'

export const isTerminated = (sentence?: FrontendSentence | null): boolean => sentence?.custody?.status?.code === 'T'

export const getPrimarySentence = <T extends FrontendSentence>(sentences?: T[] | null): T | false => {
  if (!sentences || !sentences.length) {
    return false
  }

  if (sentences.length === 1 && !isSpx(sentences[0]) && !isTerminated(sentences[0])) {
    return sentences[0]
  }

  const findSPSentence = sentences.find(
    sentence => sentence?.supervisionPackage && !isTerminated(sentence) && !isSpx(sentence),
  )
  const findHighestEventNumberSentence = sentences
    .filter(sentence => !isTerminated(sentence))
    .reduce<T | false>(
      (highest, sentence) =>
        !highest || Number(sentence.eventNumber) > Number(highest.eventNumber) ? sentence : highest,
      false,
    )

  if (findSPSentence) {
    return findSPSentence
  }
  if (findHighestEventNumberSentence) {
    return findHighestEventNumberSentence
  }
  return false
}

export const isSpxOnlySentenceList = (sentences?: FrontendSentence[] | null): boolean =>
  !!sentences && sentences.length > 0 && sentences.every(sentence => isSpx(sentence))
