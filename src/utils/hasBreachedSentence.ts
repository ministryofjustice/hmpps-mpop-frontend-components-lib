import { getPrimarySentences } from './getPrimarySentences'
import { Sentence } from '../types/SupervisionPackage'

export const hasBreachedSentence = (sentences?: Array<Sentence> | null): boolean =>
  getPrimarySentences(sentences).some(sentence => sentence?.inBreach === true)
