import { FrontendSentence } from '../types/SupervisionPackage'

export const getPrimarySentence = <T extends FrontendSentence>(sentences?: T[] | null): T | null => {
  if (!sentences) {
    return null
  }

  if (sentences.length === 1 && sentences[0]?.supervisionPackage?.code !== 'SPX') {
    return sentences[0]
  }

  return (
    sentences.find(sentence => sentence?.supervisionPackage && sentence?.supervisionPackage?.code !== 'SPX') || null
  )
}
