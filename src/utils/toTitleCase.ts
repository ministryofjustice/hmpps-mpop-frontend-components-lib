export const toTitleCase = (value: string | null | undefined): string => {
  if (!value) return ''
  const lower = value.toLowerCase()
  return `${lower.charAt(0).toUpperCase()}${lower.substring(1)}`
}
