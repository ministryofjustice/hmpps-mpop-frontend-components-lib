export type LatestTierCalculation = {
    tierScore: string
    calculationId: string
    calculationDate: string
    changeReason: string
    provisional: boolean
}

export type LatestTierCalculationResponse = {
    calculation: LatestTierCalculation | null
    httpStatus: number
}