import { getPrimarySentences } from './getPrimarySentences'
import { FrontendSentence } from '../types/SupervisionPackage'

export const isAtLarge = (sentences?: Array<FrontendSentence> | null): boolean =>
  getPrimarySentences(sentences).some(sentence => sentence?.custody?.location?.code === 'UATLRG')
