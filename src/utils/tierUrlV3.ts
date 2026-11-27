export const tierUrlV3 = (tierUrl: string, crn: string | null | undefined) => {
  if (!crn) {
    return ''
  }
  return `${tierUrl}/v3/case/${crn}`
}
