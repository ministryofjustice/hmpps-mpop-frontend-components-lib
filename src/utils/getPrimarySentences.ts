import { FrontendSentence } from '../types/SupervisionPackage'

export const getPrimarySentences = <T extends FrontendSentence>(sentences?: T[] | null): T[] =>
  Array.isArray(sentences) ? sentences.filter(sentence => sentence?.supervisionPackage?.code !== 'SPX') : []
