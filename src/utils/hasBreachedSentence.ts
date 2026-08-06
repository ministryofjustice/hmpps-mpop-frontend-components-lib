import { getPrimarySentences } from './getPrimarySentences'
import { FrontendSentence } from '../types/SupervisionPackage'

export const hasBreachedSentence = (sentences?: Array<FrontendSentence> | null): boolean =>
  getPrimarySentences(sentences).some(sentence => sentence?.inBreach === true)
