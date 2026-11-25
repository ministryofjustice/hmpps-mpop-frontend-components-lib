import type { ApiResponse } from './ApiResponse'

export interface UserAlertsCount {
  count: number
}

export type UserAlertsCountResponse = ApiResponse & {
  userAlertsCount: string | null
}
