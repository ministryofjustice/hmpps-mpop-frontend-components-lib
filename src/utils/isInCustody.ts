import { getPrimarySentences } from './getPrimarySentences'
import { FrontendSentence } from '../types/SupervisionPackage'

export const isInCustody = (
  sentences?: Array<FrontendSentence> | null,
  codeExceptions: string[] = ['B', 'T', 'P', 'AT'],
): string | undefined =>
  getPrimarySentences(sentences).find(
    sentence => sentence?.custody?.status?.code && !codeExceptions.includes(sentence.custody.status.code.toUpperCase()),
  )?.custody?.status?.description
