import { Inputs } from '../types/SupervisionPackage'

export const sentenceType = (inputs?: Inputs) => {
  if (!inputs || !inputs.sentences) {
    return false
  }
  if (inputs?.liferCategory?.code === 'LF01') {
    return 'Imprisonment for Public Protection '
  }

  if (inputs?.liferCategory?.code === 'LF02') {
    return 'extended determinate sentence'
  }
  if (inputs.liferCategory) {
    return 'life sentence'
  }
  const primarySentences = inputs.sentences.filter(sentence => sentence.supervisionPackage?.code !== 'SPX')

  if (primarySentences.length === 0) {
    return 'community sentence'
  }
  if (primarySentences.some(sentence => sentence.type?.isCustodial === true)) {
    return 'custodial sentence'
  }
  if (primarySentences.every(sentence => sentence.type?.isCustodial === false)) {
    return 'community sentence'
  }
  return undefined
}
