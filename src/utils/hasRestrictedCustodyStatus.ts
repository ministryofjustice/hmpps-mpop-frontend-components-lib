import { FrontendSentence } from '../types/SupervisionPackage'

// Custody status codes that prevent the sentence from following the normal supervision package flow
const RESTRICTED_CUSTODY_STATUS_CODES = ['D', 'I', 'R', 'C']

export const hasRestrictedCustodyStatus = (sentence?: Pick<FrontendSentence, 'custody'> | null): boolean =>
  !!sentence?.custody?.status?.code &&
  RESTRICTED_CUSTODY_STATUS_CODES.includes(sentence.custody.status.code.toUpperCase())
