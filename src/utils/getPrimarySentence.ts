import { FrontendSentence } from '../types/SupervisionPackage'

export const getPrimarySentence = <T extends FrontendSentence>(sentences?: T[] | null): T | null => {
  if (!sentences) {
    return null
  }

  return sentences.find(sentence => sentence?.supervisionPackage?.code !== 'SPX') || null
}
