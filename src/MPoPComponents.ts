import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthOptions } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type Logger from 'bunyan'

import type { MPoPComponentsConfig } from './types/MPoPComponentsConfig'
import type { LatestTier, LatestTierResponse } from './types/TierCalculation'
import { SuppressingRestClient } from './SuppressingRestClient'

export default class MPoPComponents {
  private readonly tierApiRestClient: SuppressingRestClient

  constructor(
    authenticationClient: AuthenticationClient,
    config: MPoPComponentsConfig,
    logger: Logger | Console = console,
  ) {
    this.tierApiRestClient = new SuppressingRestClient(
      new RestClient('Tier API', config, logger, authenticationClient),
      logger,
    )
  }

  async getTierDetails(authOptions: AuthOptions | string, crn: string): Promise<LatestTierResponse> {
    try {
      const response = await this.tierApiRestClient.get<LatestTier>(`/v3/crn/${crn}/tier`, authOptions)

      if (!response) {
        return {
          calculation: null,
          httpStatus: 404,
        }
      }

      return {
        calculation: response,
        httpStatus: 200,
      }
    } catch (error) {
      const err = error as {
        responseStatus?: number
      } | null

      return {
        calculation: null,
        httpStatus: err?.responseStatus ?? 500,
      }
    }
  }
}
