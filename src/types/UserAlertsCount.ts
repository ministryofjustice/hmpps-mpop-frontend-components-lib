export interface UserAlertsCount {
  count: number
}

export type UserAlertsCountResponse = {
  userAlertsCount: string | null
  httpStatus: number
  error?: Error | null
}
