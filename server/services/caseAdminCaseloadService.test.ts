import { CaseAdminCaseloadService } from '.'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAgent, createAssessmentSummary, createOffenderSummary } from '../data/__testutils/testObjects'
import { convertToTitleCase } from '../utils/utils'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const agent = createAgent() as Agent

describe('CA Caseload Service', () => {
  let caseAdminCaseloadService: CaseAdminCaseloadService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    caseAdminCaseloadService = new CaseAdminCaseloadService(AssessForEarlyReleaseApiClientBuilder)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Caseload', () => {
    it('get case admin caseload', async () => {
      const aCase = createOffenderSummary({})
      assessForEarlyReleaseApiClient.getCaseAdminCaseload.mockResolvedValue([aCase])

      const result = await caseAdminCaseloadService.getCaseAdminCaseload(token, agent, 'MDI')

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token, agent)
      expect(result).toEqual([
        {
          name: convertToTitleCase(`${aCase.forename} ${aCase.surname}`.trim()),
          prisonNumber: aCase.prisonNumber,
          hdced: aCase.hdced,
          workingDaysToHdced: 3,
          probationPractitioner: convertToTitleCase(aCase.probationPractitioner?.trim()),
          isPostponed: aCase.isPostponed,
          postponementReasons: aCase.postponementReasons,
          postponementDate: aCase.postponementDate,
          status: 'NOT_STARTED',
          addressChecksComplete: false,
          currentTask: aCase.currentTask,
          taskOverdueOn: aCase.taskOverdueOn,
        },
      ])
    })
  })

  describe('Assessment Summary', () => {
    const assessmentSummary = createAssessmentSummary({})

    it('get assessment summary', async () => {
      assessForEarlyReleaseApiClient.getAssessmentSummary.mockResolvedValue(assessmentSummary)

      const result = await caseAdminCaseloadService.getAssessmentSummary(token, agent, assessmentSummary.prisonNumber)

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token, agent)
      expect(result).toEqual(assessmentSummary)
    })
  })
})
