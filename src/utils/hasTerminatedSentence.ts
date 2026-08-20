import { getPrimarySentence } from './getPrimarySentence'
import { FrontendSentence } from '../types/SupervisionPackage'

export const hasTerminatedSentence = (sentences?: FrontendSentence[] | null): boolean => {
  const primarySentence = getPrimarySentence(sentences)
  return primarySentence?.custody?.status?.code === 'T'
}
