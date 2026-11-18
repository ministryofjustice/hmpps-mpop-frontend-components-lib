import { Readable } from 'stream'
import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import { SuppressingRestClient } from './SuppressingRestClient'

jest.mock('@ministryofjustice/hmpps-rest-client')

describe('SuppressingRestClient', () => {
  let handler: SuppressingRestClient
  let mockedRestClient: jest.Mocked<RestClient>
  let mockedLogger: any

  beforeEach(() => {
    mockedRestClient = new RestClient('API', {} as any, null as any, null as any) as jest.Mocked<RestClient>
    mockedLogger = { debug: jest.fn(), warn: jest.fn() }

    handler = new SuppressingRestClient(mockedRestClient, mockedLogger)
  })

  it('should pass through successful responses', async () => {
    mockedRestClient.get.mockResolvedValue({ data: 'success' })

    const result = await handler.get('/test-path', 'authOptions')

    expect(result).toEqual({ data: 'success' })
    expect(mockedRestClient.get).toHaveBeenCalledWith(expect.objectContaining({ path: '/test-path' }), 'authOptions')
    expect(mockedLogger.debug).not.toHaveBeenCalled()
  })

  it('should suppress 404 errors and return null via the errorHandler', async () => {
    const notFoundResponse = { responseStatus: 404 }

    mockedRestClient.get.mockImplementation(async (req: any) => {
      return req.errorHandler('/test-path', 'GET', notFoundResponse)
    })

    const result = await handler.get('/test-path', 'authToken')

    expect(result).toBeNull()
    expect(mockedLogger.debug).toHaveBeenCalledWith('API returned 404 (Not Found) for GET: /test-path')
  })

  it('should rethrow non-404 errors via the errorHandler', async () => {
    const internalServerErrorResponse = { responseStatus: 500, message: 'Internal Server Error' }

    mockedRestClient.get.mockImplementation(async (req: any) => {
      return req.errorHandler('/test-path', 'GET', internalServerErrorResponse)
    })

    await expect(handler.get('/test-path', 'authToken')).rejects.toEqual(internalServerErrorResponse)
    expect(mockedLogger.debug).not.toHaveBeenCalled()
  })

  describe('stream', () => {
    it('should pass through the stream', async () => {
      const stream = Readable.from(['image'])
      mockedRestClient.stream.mockResolvedValue(stream)

      const result = await handler.stream('/test-path', 'authToken')

      expect(result).toBe(stream)
      expect(mockedRestClient.stream).toHaveBeenCalledWith(expect.objectContaining({ path: '/test-path' }), 'authToken')
    })

    it('should return null for a 404 without logging a warning', async () => {
      const notFoundResponse = { responseStatus: 404 }
      mockedRestClient.stream.mockImplementation(async (req: any) => {
        req.errorLogger('/test-path', 'GET', notFoundResponse)
        throw notFoundResponse
      })

      const result = await handler.stream('/test-path', 'authToken')

      expect(result).toBeNull()
      expect(mockedLogger.warn).not.toHaveBeenCalled()
      expect(mockedLogger.debug).toHaveBeenCalledWith('API returned 404 (Not Found) for GET: /test-path')
    })

    it('should log a warning and rethrow other errors', async () => {
      const internalServerErrorResponse = { responseStatus: 500, message: 'Internal Server Error' }
      mockedRestClient.stream.mockImplementation(async (req: any) => {
        req.errorLogger('/test-path', 'GET', internalServerErrorResponse)
        throw internalServerErrorResponse
      })

      await expect(handler.stream('/test-path', 'authToken')).rejects.toEqual(internalServerErrorResponse)
      expect(mockedLogger.warn).toHaveBeenCalled()
    })
  })
})
