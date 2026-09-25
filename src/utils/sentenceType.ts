import { ContextDetails } from '../types/SupervisionPackage'
import { getPrimarySentence } from './getPrimarySentence'

export const sentenceType = (context?: ContextDetails) => {
  if (!context || !context.sentences) {
    return false
  }
  if (context?.liferCategory?.code === 'LF01') {
    return 'Imprisonment for Public Protection'
  }

  if (context?.liferCategory?.code === 'LF02') {
    return 'extended determinate sentence'
  }
  if (context.liferCategory) {
    return 'life sentence'
  }
  const primarySentence = getPrimarySentence(context.sentences)

  if (!primarySentence) {
    return false
  }

  if (primarySentence.type?.isSuspendedSentence === true) {
    return 'suspended sentence'
  }
  if (primarySentence.type?.isCustodial === true) {
    return 'custodial sentence'
  }
  if (primarySentence.type?.isCustodial === false) {
    return 'community sentence'
  }
  return false
}
