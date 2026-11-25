import { RiskFlag } from '../types/RiskFlag'

export const getStaffRisk = (data: RiskFlag[] | null | undefined): RiskFlag | null =>
  data?.find(
    item =>
      item?.description === 'Risk to Staff' &&
      (!item.levelDescription || ['medium', 'high', 'very high'].includes(item.levelDescription.toLowerCase())),
  ) ?? null

export const getProbationRisk = (data: RiskFlag[] | null | undefined): RiskFlag | null =>
  data?.find(item => item?.description === 'Risk to Probation Staff') ?? null
