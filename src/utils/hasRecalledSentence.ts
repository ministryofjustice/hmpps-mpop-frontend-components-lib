import { getPrimarySentence } from './getPrimarySentence'
import { FrontendSentence } from '../types/SupervisionPackage'

export const hasRecalledSentence = (sentences?: FrontendSentence[] | null): boolean => {
  const primarySentence = getPrimarySentence(sentences)
  return primarySentence?.custody?.status?.code === 'C'
}
