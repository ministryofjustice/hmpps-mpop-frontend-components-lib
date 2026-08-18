import { FrontendSentence } from '../types/SupervisionPackage'

export const isAtLarge = (sentences?: Array<FrontendSentence> | null): boolean =>
  sentences?.some(sentence => sentence.custody?.location?.code === 'UATLRG') ?? false
