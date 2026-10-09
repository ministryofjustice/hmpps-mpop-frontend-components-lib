import { FrontendSentence } from '../types/SupervisionPackage'

export const isUnlawfullyAtLarge = (sentence?: Pick<FrontendSentence, 'custody'> | null): boolean =>
  sentence?.custody?.location?.code === 'UATLRG'
