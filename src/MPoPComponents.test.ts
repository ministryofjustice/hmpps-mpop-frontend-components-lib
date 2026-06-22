import { AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import MPoPComponents, { tierTags } from './MPoPComponents'
import { SuppressingRestClient } from './SuppressingRestClient'

jest.mock('@ministryofjustice/hmpps-rest-client')
jest.mock('./SuppressingRestClient')

describe('MPoPComponents', () => {
  let mpopComponents: MPoPComponents
  const mockedRestClient = SuppressingRestClient as jest.MockedClass<typeof SuppressingRestClient>

  const config = {
    url: 'http://localhost/tier-api',
    healthPath: '/health/ping',
    timeout: {
      response: 5000,
      deadline: 5000,
    },
    agent: new AgentConfig(5000),
  } as any

  const unavailableCalculation = {
    tierScore: '',
    calculationId: '',
    calculationDate: '',
    changeReason: '',
    provisional: false,
    tag: { ...tierTags.unavailable },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mpopComponents = new MPoPComponents(null as any, config, console)
  })

  describe('getTierDetails', () => {
    it('should return calculation with the "none" tag and status 200 for a standard tier', async () => {
      const mockApiResponse = {
        tierScore: 'D2',
        calculationId: '123e4567-e89b-12d3-a456-426614174000',
        calculationDate: '2021-04-23T18:25:43.511Z',
        changeReason: 'A registration was added',
        provisional: false,
      }

      mockedRestClient.prototype.get.mockResolvedValue(mockApiResponse)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: {
          ...mockApiResponse,
          tag: { ...tierTags.none },
        },
        httpStatus: 200,
        error: null,
      })

      expect(mockedRestClient.prototype.get).toHaveBeenCalledWith('/v3/crn/X123456/tier', 'authToken')
    })

    it('should return calculation with the "missing" tag when the tier score is MISSING', async () => {
      const mockApiResponse = {
        tierScore: 'MISSING',
        calculationId: '123e4567-e89b-12d3-a456-426614174000',
        calculationDate: '2021-04-23T18:25:43.511Z',
        changeReason: 'A registration was added',
        provisional: false,
      }

      mockedRestClient.prototype.get.mockResolvedValue(mockApiResponse)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: {
          ...mockApiResponse,
          tag: { ...tierTags.missing },
        },
        httpStatus: 200,
        error: null,
      })
    })

    it('should return calculation with the "provisional" tag when the tier is provisional', async () => {
      const mockApiResponse = {
        tierScore: 'D2',
        calculationId: '123e4567-e89b-12d3-a456-426614174000',
        calculationDate: '2021-04-23T18:25:43.511Z',
        changeReason: 'A registration was added',
        provisional: true,
      }

      mockedRestClient.prototype.get.mockResolvedValue(mockApiResponse)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: {
          ...mockApiResponse,
          tag: { ...tierTags.provisional },
        },
        httpStatus: 200,
        error: null,
      })
    })

    it('should return an unavailable calculation with 404 httpStatus when the handler returns null', async () => {
      mockedRestClient.prototype.get.mockResolvedValue(null)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: unavailableCalculation,
        httpStatus: 404,
        error: null,
      })
    })

    it('should return responseStatus from error object when the API fails', async () => {
      const error = {
        responseStatus: 401,
        data: {
          status: 401,
          userMessage: 'Unauthorized',
        },
      }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: unavailableCalculation,
        httpStatus: 401,
        error: new Error('500 Internal Server Error'),
      })
    })

    it('should return responseStatus from SanitisedError when the API fails', async () => {
      const error = {
        responseStatus: 403,
        data: {
          status: 403,
          userMessage: 'Access denied',
          developerMessage: null,
          moreInfo: null,
        },
      }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: unavailableCalculation,
        httpStatus: 403,
        error: new Error('500 Internal Server Error'),
      })
    })

    it('should return status 500 if the error object has no responseStatus', async () => {
      const error = { message: 'Network Failure' }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: unavailableCalculation,
        httpStatus: 500,
        error: new Error('500 Internal Server Error'),
      })
    })

    it('should preserve the original Error instance when the API throws an Error', async () => {
      const error = new Error('Network Failure')

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: unavailableCalculation,
        httpStatus: 500,
        error,
      })
    })
  })
})
