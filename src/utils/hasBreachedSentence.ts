import { FrontendSentence } from '../types/SupervisionPackage'

export const hasBreachedSentence = (sentences?: Array<FrontendSentence> | null): boolean =>
  sentences?.some(sentence => sentence.inBreach === true) ?? false
