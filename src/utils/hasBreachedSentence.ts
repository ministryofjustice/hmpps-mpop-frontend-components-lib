import { FrontendSentence } from '../types/SupervisionPackage'
import { getPrimarySentence } from './getPrimarySentence'

export const hasBreachedSentence = (sentences?: Array<FrontendSentence> | null): boolean => {
  const primarySentence = getPrimarySentence(sentences)
  return primarySentence ? primarySentence.inBreach === true : false
}
