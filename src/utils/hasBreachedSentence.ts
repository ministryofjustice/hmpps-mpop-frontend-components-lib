type Sentence = {
  supervisionPackage?: { code?: string }
  inBreach?: boolean
}

export const hasBreachedSentence = (sentences?: Sentence[] | null): boolean =>
  Array.isArray(sentences) &&
  sentences.some(sentence => sentence?.supervisionPackage?.code !== 'SPX' && sentence?.inBreach === true)
