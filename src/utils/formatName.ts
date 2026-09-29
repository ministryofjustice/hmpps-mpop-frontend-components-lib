export const formatName = (value: string | null | undefined): string => {
  if (!value) return ''
  return value.trim().replace(/(^|[\s'-])(\p{L})/gu, (_match, separator: string, letter: string) => {
    return `${separator}${letter.toUpperCase()}`
  })
}
