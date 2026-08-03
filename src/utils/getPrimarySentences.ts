import { Sentence } from '../types/SupervisionPackage'

export const getPrimarySentences = <T extends Sentence>(sentences?: T[] | null): T[] =>
  Array.isArray(sentences) ? sentences.filter(sentence => sentence?.supervisionPackage?.code !== 'SPX') : []
