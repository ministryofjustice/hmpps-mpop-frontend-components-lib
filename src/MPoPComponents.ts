import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthOptions } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type Logger from 'bunyan'

import type { MpopComponentsConfig } from './types/MpopComponentsConfig'
import type { LatestTier, LatestTierResponse } from './types/TierCalculation'
import { SuppressingRestClient } from './SuppressingRestClient'

export default class MpopComponents {
  private readonly tierApiRestClient: SuppressingRestClient

  constructor(
    authenticationClient: AuthenticationClient,
    config: MpopComponentsConfig,
    logger: Logger | Console = console,
  ) {
    this.tierApiRestClient = new SuppressingRestClient(
      new RestClient('Tier API', config, logger, authenticationClient),
      logger,
    )
  }

  async getTierDetails(authOptions: AuthOptions | string, crn: string): Promise<LatestTierResponse> {
    try {
      const response = await this.tierApiRestClient.get<LatestTier | null>(`/v3/crn/${crn}/tier`, authOptions)

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
      const status =
        error && typeof error === 'object' && 'status' in error ? (error as { status?: number }).status : 500

      return {
        calculation: null,
        httpStatus: status ?? 500,
      }
    }
  }
}
