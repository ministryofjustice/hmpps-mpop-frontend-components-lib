import { getPrimarySentences } from './getPrimarySentences'

type Sentence = {
  supervisionPackage?: { code?: string }
  custody?: {
    status?: {
      code?: string
      description?: string
    }
  }
}

export const isInCustody = (
  sentences?: Sentence[] | null,
  codeExceptions: string[] = ['B', 'T', 'P', 'AT'],
): string | undefined =>
  getPrimarySentences(sentences).find(
    sentence => sentence?.custody?.status?.code && !codeExceptions.includes(sentence.custody.status.code.toUpperCase()),
  )?.custody?.status?.description
