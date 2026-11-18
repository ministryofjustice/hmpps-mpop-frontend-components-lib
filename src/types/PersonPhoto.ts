import type { Readable } from 'stream'

export type PersonPhotoResponse = {
  photo: Readable | null
  httpStatus: number
  error?: Error | null
}

export type PersonPhotoAvailability = {
  hasPhoto: boolean
  httpStatus: number
  error?: Error | null
}
