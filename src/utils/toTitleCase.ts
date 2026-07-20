export const toTitleCase = (value: string | null | undefined): string => {
  if (!value) return ''
  const preservedWords = ['(NS)', '(Non', 'NS)']
  const lower = value.toLowerCase()
  const titleCased = `${lower.charAt(0).toUpperCase()}${lower.substring(1)}`

  return preservedWords.reduce((result, word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return result.replace(new RegExp(escaped, 'gi'), word)
  }, titleCased)
}
