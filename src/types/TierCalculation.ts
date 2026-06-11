export type LatestTier = {
  tierScore: string
  calculationId: string
  calculationDate: string
  changeReason: string
  provisional: boolean
}

export type LatestTierResponse = {
  calculation: LatestTier | null
  httpStatus: number
}
