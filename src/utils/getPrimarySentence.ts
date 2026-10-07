import { FrontendSentence } from '../types/SupervisionPackage'

export const isTerminated = (sentence?: FrontendSentence | null): boolean => sentence?.custody?.status?.code === 'T'

export const getPrimarySentence = <T extends FrontendSentence>(sentences?: T[] | null): T | false => {
  if (!sentences || !sentences.length) {
    return false
  }

  return sentences.find(sentence => sentence.isPrimarySentence) || false
}
