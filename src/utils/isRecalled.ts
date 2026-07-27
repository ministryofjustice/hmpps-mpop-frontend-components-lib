type Sentence = {
  custody?: {
    status: {
      code: string
      description: string
    }
  }
}

export const isRecalled = (sentences?: Sentence[] | null): boolean =>
  Array.isArray(sentences) && sentences.some(sentence => sentence?.custody?.status?.code === 'C')
