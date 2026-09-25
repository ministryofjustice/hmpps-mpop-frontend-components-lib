import { isTerminated } from './getPrimarySentence'
import { FrontendSentence } from '../types/SupervisionPackage'

// True only when no sentence remains eligible to be the primary sentence, i.e. every sentence is terminated
export const hasTerminatedSentence = (sentences?: FrontendSentence[] | null): boolean =>
  !!sentences && sentences.length > 0 && sentences.every(isTerminated)
