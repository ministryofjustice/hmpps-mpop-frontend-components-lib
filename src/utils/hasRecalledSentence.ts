import { getPrimarySentences } from './getPrimarySentences'
import { FrontendSentence } from '../types/SupervisionPackage'

export const hasRecalledSentence = (sentences?: FrontendSentence[] | null): boolean =>
  getPrimarySentences(sentences).some(sentence => sentence?.custody?.status?.code === 'C')
