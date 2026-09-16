import { FrontendSentence } from '../types/SupervisionPackage'
import { getPrimarySentence } from './getPrimarySentence'

export const hasBreachedSentence = (sentences?: Array<FrontendSentence> | null): boolean =>
  getPrimarySentence(sentences)?.inBreach === true
