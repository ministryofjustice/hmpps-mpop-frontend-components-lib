import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthOptions } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type Logger from 'bunyan'

import type { MPoPComponentsConfig } from './types/MPoPComponentsConfig'
import type { LatestTierApiResponse, LatestTierResponse, TierTag } from './types/TierCalculation'
import { SuppressingRestClient } from './SuppressingRestClient'

export const tierTags: Record<string, TierTag> = {
  missing: { text: 'Missing', color: 'red' },
  provisional: { text: 'Provisional', color: 'orange' },
  unavailable: { text: 'Unavailable', color: 'grey' },
  none: { text: null, color: null },
}

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
    let error: Error | null = null
    let tierDetails: LatestTierResponse

    try {
      const calculation = await this.tierApiRestClient.get<LatestTierApiResponse>(`/v3/crn/${crn}/tier`, authOptions)

      if (!calculation) {
        tierDetails = {
          calculation: {
            tierScore: '',
            calculationId: '',
            calculationDate: '',
            changeReason: '',
            provisional: false,
            tag: { ...tierTags.unavailable },
          },
          httpStatus: 404,
        }
      } else {
        let tag: TierTag
        if (calculation.tierScore === 'MISSING') {
          tag = { ...tierTags.missing }
        } else if (calculation.tierScore && calculation.provisional) {
          tag = { ...tierTags.provisional }
        } else {
          tag = { ...tierTags.none }
        }

        tierDetails = {
          calculation: { ...calculation, tag },
          httpStatus: 200,
        }
      }
    } catch (err) {
      error = err instanceof Error ? err : new Error('500 Internal Server Error')
      const responseStatus = (err as { responseStatus?: number } | null)?.responseStatus

      tierDetails = {
        calculation: {
          tierScore: '',
          calculationId: '',
          calculationDate: '',
          changeReason: '',
          provisional: false,
          tag: { ...tierTags.unavailable },
        },
        httpStatus: responseStatus ?? 500,
      }
    }

    return {
      ...tierDetails,
      error,
    }
  }
}
