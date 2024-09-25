import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createInitialChecks, createEligbilityCheck, createSuitabilityCheck } from '../data/__testutils/testObjects'
import EligibilityAndSuitabilityService from './eligiblityAndSuitabilityService'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'

describe('EligibilityAndSuitabilityService', () => {
  let eligibilityAndSuitabilityService: EligibilityAndSuitabilityService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    eligibilityAndSuitabilityService = new EligibilityAndSuitabilityService(AssessForEarlyReleaseApiClientBuilder)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Initial checks', () => {
    const eligibilityCheck1 = createEligbilityCheck({ code: 'eligibility-1' })
    const eligibilityCheck2 = createEligbilityCheck({ code: 'eligibility-2' })
    const suitabilityCheck1 = createSuitabilityCheck({ code: 'suitability-1' })
    const suitabilityCheck2 = createSuitabilityCheck({ code: 'suitability-1' })

    const initialChecks = createInitialChecks({
      eligibility: [eligibilityCheck1, eligibilityCheck2],
      suitability: [suitabilityCheck1, suitabilityCheck2],
    })

    it('get initial checks', async () => {
      assessForEarlyReleaseApiClient.getInitialCheckStatus.mockResolvedValue(initialChecks)

      const result = await eligibilityAndSuitabilityService.getInitialChecks(
        token,
        initialChecks.assessmentSummary.prisonNumber,
      )

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(result).toEqual(result)
    })

    describe('getInitialCheck', () => {
      it('get existing eligibility check', async () => {
        assessForEarlyReleaseApiClient.getInitialCheckStatus.mockResolvedValue(initialChecks)

        const result = await eligibilityAndSuitabilityService.getInitialCheck(
          token,
          initialChecks.assessmentSummary.prisonNumber,
          'eligibility',
          eligibilityCheck1.code,
        )

        expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
        expect(result).toEqual({
          assessmentSummary: initialChecks.assessmentSummary,
          check: eligibilityCheck1,
          nextCheck: eligibilityCheck2,
        })
      })

      it('get non-existing eligibility check', async () => {
        assessForEarlyReleaseApiClient.getInitialCheckStatus.mockResolvedValue(initialChecks)

        await expect(() =>
          eligibilityAndSuitabilityService.getInitialCheck(
            token,
            initialChecks.assessmentSummary.prisonNumber,
            'eligibility',
            'some-non-existent-code',
          ),
        ).rejects.toThrow(`Could not find check of type: 'eligibility', code: 'some-non-existent-code'`)
      })

      it('get final check', async () => {
        assessForEarlyReleaseApiClient.getInitialCheckStatus.mockResolvedValue(initialChecks)

        const result = await eligibilityAndSuitabilityService.getInitialCheck(
          token,
          initialChecks.assessmentSummary.prisonNumber,
          'eligibility',
          eligibilityCheck2.code,
        )

        expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
        expect(result).toEqual({
          assessmentSummary: initialChecks.assessmentSummary,
          check: eligibilityCheck2,
          nextCheck: undefined,
        })
      })
    })
  })
})
