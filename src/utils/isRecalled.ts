import { FrontendSentence } from '../types/SupervisionPackage'

export const isRecalled = (sentence?: Pick<FrontendSentence, 'custody'> | null): boolean =>
  sentence?.custody?.status?.code?.toUpperCase() === 'C'
