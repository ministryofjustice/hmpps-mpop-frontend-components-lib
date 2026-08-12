import { ContextDetails } from '../types/SupervisionPackage'

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
  const primarySentences = context.sentences.filter(sentence => sentence.supervisionPackage?.code !== 'SPX')

  if (primarySentences.length === 0) {
    return 'community sentence'
  }
  if (primarySentences.some(sentence => sentence.type?.custodial === true)) {
    return 'custodial sentence'
  }
  if (primarySentences.every(sentence => sentence.type?.custodial === false)) {
    return 'community sentence'
  }
  return undefined
}
