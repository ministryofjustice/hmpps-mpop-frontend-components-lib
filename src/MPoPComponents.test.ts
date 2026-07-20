import { AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import MPoPComponents, { tierTags } from './MPoPComponents'
import { SuppressingRestClient } from './SuppressingRestClient'
import * as yearsSinceModule from './utils/yearsSince'

jest.mock('@ministryofjustice/hmpps-rest-client')
jest.mock('./SuppressingRestClient')
jest.mock('./utils/yearsSince')

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
    masApiConfig: {
      url: 'https://manage-supervision-and-delius-dev.hmpps.service.justice.gov.uk',
      timeout: {
        response: 5000,
        deadline: 5000,
      },
      agent: new AgentConfig(5000),
    },
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

  describe('getPersonalDetails', () => {
    const mockSummary = {
      name: { forename: 'John', middleName: 'A', surname: 'Doe' },
      crn: 'X123456',
      offenderId: 1,
      pnc: 'PNC123',
      noms: 'NOMS456',
      dateOfBirth: '1990-01-01',
    }

    beforeEach(() => {
      jest.spyOn(yearsSinceModule, 'yearsSince').mockReturnValue('35')
    })

    it('should return personalDetails with computed age and status 200 when the API responds', async () => {
      mockedRestClient.prototype.get.mockResolvedValue(mockSummary)

      const result = await mpopComponents.getPersonalDetails('authToken', 'X123456')

      expect(result).toEqual({
        personalDetails: { ...mockSummary, age: '35' },
        httpStatus: 200,
        error: null,
      })

      expect(mockedRestClient.prototype.get).toHaveBeenCalledWith('/personal-details/X123456/summary', 'authToken')
    })

    it('should return null personalDetails with status 404 when the API returns null', async () => {
      mockedRestClient.prototype.get.mockResolvedValue(null)

      const result = await mpopComponents.getPersonalDetails('authToken', 'X123456')

      expect(result).toEqual({
        personalDetails: null,
        httpStatus: 404,
        error: null,
      })
    })

    it('should return responseStatus from the error object when the API fails', async () => {
      const error = { responseStatus: 401, data: { status: 401, userMessage: 'Unauthorized' } }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getPersonalDetails('authToken', 'X123456')

      expect(result).toEqual({
        personalDetails: null,
        httpStatus: 401,
        error: new Error('500 Internal Server Error'),
      })
    })

    it('should return status 500 when the error object has no responseStatus', async () => {
      const error = { message: 'Network Failure' }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getPersonalDetails('authToken', 'X123456')

      expect(result).toEqual({
        personalDetails: null,
        httpStatus: 500,
        error: new Error('500 Internal Server Error'),
      })
    })

    it('should preserve the original Error instance when the API throws an Error', async () => {
      const error = new Error('Network Failure')

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getPersonalDetails('authToken', 'X123456')

      expect(result).toEqual({
        personalDetails: null,
        httpStatus: 500,
        error,
      })
    })
  })

  describe('getSupervisionPackage', () => {
    const mockSupervisionPackage = {
      phase: {
        name: { code: 'SENT', description: 'In Custody' },
        startDate: '2026-07-08T00:00:00Z',
        endDate: '2026-08-10T00:00:00Z',
      },
      earlyEngagement: {
        startDate: '2026-08-10T00:00:00Z',
        endDate: '2026-10-31T00:00:00Z',
        weeks: 12,
        completed: 0,
      },
      currentYear: {
        startDate: '2026-07-08',
        endDate: '2027-01-07',
        isFirstYear: true,
        appointments: { allowance: 46, scheduled: 0, completed: 0 },
      },
      inputs: {
        date: '2026-07-14T14:36:34.103477524+01:00',
        gender: 'Male',
        integratedOffenderManagementRedRated: false,
        offenderPersonalDisorderPathway: false,
        intensiveSupervisionCourt: false,
        nationalSecurityDivision: false,
        finalThirdEligibility: { eligible: false, since: '2026-07-10' },
        sentences: [
          {
            eventNumber: '1',
            startDate: '2026-07-08',
            endDate: '2027-01-07',
            supervisionPackage: { code: 'SPA', description: 'A' },
            type: {
              code: '307',
              description: 'Adult Custody < 12m',
              isCustodial: true,
            },
            custody: {
              status: { code: 'B', description: 'Released - On Licence' },
              finalThirdDate: '2026-11-07',
              releases: [{ releaseDate: '2026-07-10' }],
            },
            inBreach: false,
          },
        ],
      },
    }

    it('should return supervisionPackage with status 200 when the API responds', async () => {
      mockedRestClient.prototype.get.mockResolvedValue(mockSupervisionPackage)

      const result = await mpopComponents.getSupervisionPackage('authToken', 'X123456')

      expect(result).toEqual({
        supervisionPackage: mockSupervisionPackage,
        httpStatus: 200,
        error: null,
      })

      expect(mockedRestClient.prototype.get).toHaveBeenCalledWith('/case/X123456/current-phase', 'authToken')
    })

    it('should return null supervisionPackage with status 404 when the API returns null', async () => {
      mockedRestClient.prototype.get.mockResolvedValue(null)

      const result = await mpopComponents.getSupervisionPackage('authToken', 'X123456')

      expect(result).toEqual({
        supervisionPackage: null,
        httpStatus: 404,
        error: null,
      })
    })

    it('should return responseStatus from the error object when the API fails', async () => {
      const error = { responseStatus: 401, data: { status: 401, userMessage: 'Unauthorized' } }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getSupervisionPackage('authToken', 'X123456')

      expect(result).toEqual({
        supervisionPackage: null,
        httpStatus: 401,
        error: new Error('500 Internal Server Error'),
      })
    })

    it('should return null supervisionPackage with status 500 when the API throws', async () => {
      const error = { message: 'Network Failure' }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getSupervisionPackage('authToken', 'X123456')

      expect(result).toEqual({
        supervisionPackage: null,
        httpStatus: 500,
        error: new Error('500 Internal Server Error'),
      })
    })

    it('should preserve the original Error instance when the API throws an Error', async () => {
      const error = new Error('Network Failure')

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getSupervisionPackage('authToken', 'X123456')

      expect(result).toEqual({
        supervisionPackage: null,
        httpStatus: 500,
        error,
      })
    })
  })

  describe('getPersonSchedule', () => {
    const mockPersonSchedule = {
      personSummary: {
        name: { forename: 'John', surname: 'Doe' },
        crn: 'X123456',
        dateOfBirth: '1990-01-01',
      },
      personSchedule: {
        size: 1,
        page: 0,
        totalResults: 1,
        totalPages: 1,
        appointments: [
          {
            id: '1',
            type: 'Appointment',
            startDateTime: '2026-08-01T10:00:00Z',
          },
        ],
      },
    }

    it('should return personSchedule with status 200 when the API responds using default parameters', async () => {
      mockedRestClient.prototype.get.mockResolvedValue(mockPersonSchedule)

      const result = await mpopComponents.getPersonSchedule('authToken', 'X123456')

      expect(result).toEqual({
        personSchedule: mockPersonSchedule,
        httpStatus: 200,
        error: null,
      })

      expect(mockedRestClient.prototype.get).toHaveBeenCalledWith(
        '/schedule/X123456/upcoming?size=1&page=0&sortBy=date&ascending=true',
        'authToken',
      )
    })

    it('should build the query using the provided type, page, size and sortBy parameters', async () => {
      mockedRestClient.prototype.get.mockResolvedValue(mockPersonSchedule)

      const result = await mpopComponents.getPersonSchedule(
        'authToken',
        'X123456',
        'previous',
        '2',
        '10',
        '&sortBy=date&ascending=false',
      )

      expect(result).toEqual({
        personSchedule: mockPersonSchedule,
        httpStatus: 200,
        error: null,
      })

      expect(mockedRestClient.prototype.get).toHaveBeenCalledWith(
        '/schedule/X123456/previous?size=10&page=2&sortBy=date&ascending=false',
        'authToken',
      )
    })

    it('should return null personSchedule with status 404 when the API returns null', async () => {
      mockedRestClient.prototype.get.mockResolvedValue(null)

      const result = await mpopComponents.getPersonSchedule('authToken', 'X123456')

      expect(result).toEqual({
        personSchedule: null,
        httpStatus: 404,
        error: null,
      })
    })

    it('should return responseStatus from the error object when the API fails', async () => {
      const error = { responseStatus: 401, data: { status: 401, userMessage: 'Unauthorized' } }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getPersonSchedule('authToken', 'X123456')

      expect(result).toEqual({
        personSchedule: null,
        httpStatus: 401,
        error: new Error('500 Internal Server Error'),
      })
    })

    it('should return null personSchedule with status 500 when the error object has no responseStatus', async () => {
      const error = { message: 'Network Failure' }

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getPersonSchedule('authToken', 'X123456')

      expect(result).toEqual({
        personSchedule: null,
        httpStatus: 500,
        error: new Error('500 Internal Server Error'),
      })
    })

    it('should preserve the original Error instance when the API throws an Error', async () => {
      const error = new Error('Network Failure')

      mockedRestClient.prototype.get.mockRejectedValue(error)

      const result = await mpopComponents.getPersonSchedule('authToken', 'X123456')

      expect(result).toEqual({
        personSchedule: null,
        httpStatus: 500,
        error,
      })
    })
  })
})
