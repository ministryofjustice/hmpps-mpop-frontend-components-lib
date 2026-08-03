import { getPrimarySentences } from './getPrimarySentences'
import { Sentence } from '../types/SupervisionPackage'

export const isInCustody = (
  sentences?: Array<Sentence> | null,
  codeExceptions: string[] = ['B', 'T', 'P', 'AT'],
): string | undefined =>
  getPrimarySentences(sentences).find(
    sentence => sentence?.custody?.status?.code && !codeExceptions.includes(sentence.custody.status.code.toUpperCase()),
  )?.custody?.status?.description
