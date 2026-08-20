import { FrontendSentence } from '../types/SupervisionPackage'

export const isInCustody = (
  sentences?: Array<FrontendSentence> | null,
  codes: string[] = ['D', 'I', 'R', 'C'],
): string | undefined =>
  sentences?.find(sentence => codes.includes(sentence.custody?.status?.code?.toUpperCase()))?.custody?.status
    ?.description
