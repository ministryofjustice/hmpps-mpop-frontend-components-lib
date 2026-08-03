import { getPrimarySentences } from './getPrimarySentences'
import { Sentence } from '../types/SupervisionPackage'

export const isAtLarge = (sentences?: Array<Sentence> | null): boolean =>
  getPrimarySentences(sentences).some(sentence => sentence?.custody?.location?.code === 'UATLRG')
