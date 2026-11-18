import type { Readable } from 'stream'
import type { RestClient, AuthOptions } from '@ministryofjustice/hmpps-rest-client'
import type Logger from 'bunyan'

export class SuppressingRestClient {
  constructor(
    private readonly restClient: RestClient,
    private readonly logger: Logger | Console,
  ) {}

  async get<T>(path: string, authOptions: AuthOptions | string): Promise<T | null> {
    return this.restClient.get<T | null>(
      {
        path,
        errorHandler: (requestPath, method, error) => {
          if (error.responseStatus === 404) {
            this.logger.debug(`API returned 404 (Not Found) for ${method}: ${requestPath}`)
            return null
          }
          throw error
        },
      },
      authOptions,
    )
  }

  async stream(path: string, authOptions: AuthOptions | string): Promise<Readable | null> {
    try {
      return await this.restClient.stream(
        {
          path,
          errorLogger: (requestPath, method, error) => {
            if (error.responseStatus !== 404) {
              this.logger.warn({ ...error }, `Error calling API, path: '${requestPath}', verb: '${method}'`)
            }
          },
        },
        authOptions,
      )
    } catch (error) {
      if ((error as { responseStatus?: number } | null)?.responseStatus === 404) {
        this.logger.debug(`API returned 404 (Not Found) for GET: ${path}`)
        return null
      }
      throw error
    }
  }
}
