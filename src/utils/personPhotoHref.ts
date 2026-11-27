export const PERSON_PHOTO_PATH = '/person-photo/:nomsNumber'

export const personPhotoHref = (nomsNumber: string): string => `/person-photo/${encodeURIComponent(nomsNumber)}`
