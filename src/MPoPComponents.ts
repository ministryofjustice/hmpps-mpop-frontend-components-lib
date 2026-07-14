import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthOptions } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type Logger from 'bunyan'

import type { MPoPComponentsConfig } from './types/MPoPComponentsConfig'
import type { LatestTierApiResponse, LatestTierResponse, TierTag } from './types/TierCalculation'
import { SuppressingRestClient } from './SuppressingRestClient'
import type { PersonalDetailsSummary, PersonalDetailsResponse } from './types/PersonalDetails'
import type { SupervisionPackage, SupervisionPackageResponse } from './types/SupervisionPackage'
import { yearsSince } from './utils/yearsSince'

export const tierTags: Record<string, TierTag> = {
  missing: { text: 'Missing', color: 'red' },
  provisional: { text: 'Provisional', color: 'orange' },
  unavailable: { text: 'Unavailable', color: 'grey' },
  none: { text: null, color: null },
}

export default class MPoPComponents {
  private readonly tierApiRestClient: SuppressingRestClient

  private readonly masApiRestClient: SuppressingRestClient

  private readonly supervisionPackageApiRestClient: SuppressingRestClient

  constructor(
    authenticationClient: AuthenticationClient,
    config: MPoPComponentsConfig,
    logger: Logger | Console = console,
  ) {
    this.tierApiRestClient = new SuppressingRestClient(
      new RestClient('Tier API', config, logger, authenticationClient),
      logger,
    )

    this.masApiRestClient = new SuppressingRestClient(
      new RestClient('MAS API', config.masApiConfig ?? config, logger, authenticationClient),
      logger,
    )

    this.supervisionPackageApiRestClient = new SuppressingRestClient(
      new RestClient(
        'Supervision Package API',
        config.supervisionPackageApiConfig ?? config,
        logger,
        authenticationClient,
      ),
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

  async getPersonalDetails(authOptions: AuthOptions | string, crn: string): Promise<PersonalDetailsResponse> {
    let error: Error | null = null
    let personalDetailsResponse: PersonalDetailsResponse

    try {
      const response = await this.masApiRestClient.get<PersonalDetailsSummary>(
        `/personal-details/${crn}/summary`,
        authOptions,
      )
      if (!response) {
        personalDetailsResponse = {
          personalDetails: null,
          httpStatus: 404,
        }
      } else {
        personalDetailsResponse = {
          personalDetails: { ...response, age: yearsSince(response.dateOfBirth) },
          httpStatus: 200,
        }
      }
    } catch (err) {
      error = err instanceof Error ? err : new Error('500 Internal Server Error')
      const responseStatus = (err as { responseStatus?: number } | null)?.responseStatus

      personalDetailsResponse = {
        personalDetails: null,
        httpStatus: responseStatus ?? 500,
      }
    }

    return {
      ...personalDetailsResponse,
      error,
    }
  }

  async getSupervisionPackage(authOptions: AuthOptions | string, crn: string): Promise<SupervisionPackageResponse> {
    let error: Error | null = null
    let supervisionPackageResponse: SupervisionPackageResponse

    try {
      const response = await this.supervisionPackageApiRestClient.get<SupervisionPackage>(
        `/case/${crn}/current-phase`,
        authOptions,
      )

      if (!response) {
        supervisionPackageResponse = {
          supervisionPackage: null,
          httpStatus: 404,
        }
      } else {
        supervisionPackageResponse = {
          supervisionPackage: response,
          httpStatus: 200,
        }
      }
    } catch (err) {
      const responseStatus = (err as { responseStatus?: number } | null)?.responseStatus
      error = err instanceof Error ? err : new Error('500 Internal Server Error')
      supervisionPackageResponse = {
        supervisionPackage: null,
        httpStatus: responseStatus ?? 500,
      }
    }

    return {
      ...supervisionPackageResponse,
      error,
    }
  }
}
