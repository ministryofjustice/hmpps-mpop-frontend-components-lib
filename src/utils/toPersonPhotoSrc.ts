export const toPersonPhotoSrc = ({
  checkInPhotoUrl,
  noms,
  hasPrisonPhoto,
  prisonPhotoHref,
}: {
  checkInPhotoUrl?: string | null
  noms?: string | null
  hasPrisonPhoto?: boolean
  prisonPhotoHref: (noms: string) => string
}): string | undefined => {
  if (checkInPhotoUrl) {
    return checkInPhotoUrl
  }
  if (noms && hasPrisonPhoto) {
    return prisonPhotoHref(noms)
  }
  return undefined
}
