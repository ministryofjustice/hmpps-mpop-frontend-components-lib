import { AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import MPoPComponents from './MPoPComponents'
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

  beforeEach(() => {
    jest.clearAllMocks()
    mpopComponents = new MPoPComponents(null as any, config, null as any)
  })

  describe('getCalculationDetails', () => {
    it('should return calculation and status 200 on success', async () => {
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
        calculation: mockApiResponse,
        httpStatus: 200,
      })

      expect(mockedRestClient.prototype.get).toHaveBeenCalledWith('/v3/crn/X123456/tier', 'authToken')
    })

    it('should return null calculation with 404 httpStatus when the handler returns null', async () => {
      mockedRestClient.prototype.get.mockResolvedValue(null)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: null,
        httpStatus: 404,
      })
    })

    it('should return status from error object when the API fails', async () => {
      const error = { status: 401, message: 'Unauthorized' }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: null,
        httpStatus: 401,
      })
    })

    it('should return status 500 if the error object has no status', async () => {
      const error = { message: 'Network Failure' }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getTierDetails('authToken', 'X123456')

      expect(result).toEqual({
        calculation: null,
        httpStatus: 500,
      })
    })
  })
})
