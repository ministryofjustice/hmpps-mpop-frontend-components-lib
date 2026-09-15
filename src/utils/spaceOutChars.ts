export const spaceOutChars = (value: string | null | undefined): string => {
  if (!value) return ''
  return value.split('').join(' ')
}
