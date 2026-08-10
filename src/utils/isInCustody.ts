import { getPrimarySentences } from './getPrimarySentences'
import { FrontendSentence } from '../types/SupervisionPackage'

export const isInCustody = (
  sentences?: Array<FrontendSentence> | null,
  codes: string[] = ['D', 'I', 'R', 'C'],
): string | undefined =>
  getPrimarySentences(sentences).find(
    sentence => sentence?.custody?.status?.code && codes.includes(sentence.custody.status.code.toUpperCase()),
  )?.custody?.status?.description
