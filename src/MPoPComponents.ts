import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthOptions } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type Logger from 'bunyan'

import type { MpopComponentsConfig } from './types/MpopComponentsConfig'
import type { LatestTierCalculation, LatestTierCalculationResponse } from './types/TierCalculation'
import {SuppressingRestClient} from "./SuppressingRestClient";

export default class MpopComponents {
    private readonly tierApiRestClient: SuppressingRestClient

    constructor(
        authenticationClient: AuthenticationClient,
        config: MpopComponentsConfig,
        logger: Logger | Console = console,
    ) {
        this.tierApiRestClient = new SuppressingRestClient(
            new RestClient('ARNS API', config, logger, authenticationClient),
            logger,
        )
    }

    async getCalculationDetails(authOptions: AuthOptions | string, crn: string): Promise<LatestTierCalculationResponse> {
        try {
            const response = await this.tierApiRestClient.get<LatestTierCalculation | null>(
                `/crn/${crn}/tier/details`,
                authOptions,
            )

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
            const status = error && typeof error === 'object' && 'status' in error ? (error as { status?: number }).status : 500

            return {
                calculation: null,
                httpStatus: status ?? 500,
            }
        }
    }
}