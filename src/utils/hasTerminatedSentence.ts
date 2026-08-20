import { getPrimarySentences } from './getPrimarySentences'
import { FrontendSentence } from '../types/SupervisionPackage'

export const hasTerminatedSentence = (sentences?: FrontendSentence[] | null): boolean =>
  getPrimarySentences(sentences).some(sentence => sentence?.custody?.status?.code === 'T')
