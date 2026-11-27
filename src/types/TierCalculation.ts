import type { ApiResponse } from './ApiResponse'

export type TierTag = {
  text: 'Missing' | 'Provisional' | 'Unavailable' | null
  color: 'red' | 'orange' | 'grey' | null
}

export type LatestTierApiResponse = {
  tierScore: string
  calculationId: string
  calculationDate: string
  changeReason: string
  provisional: boolean
}

export type LatestTier = LatestTierApiResponse & {
  tag: TierTag
}

export type LatestTierResponse = ApiResponse & {
  calculation: LatestTier
}
