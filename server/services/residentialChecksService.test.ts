import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAgent, createResidentialChecksView } from '../data/__testutils/testObjects'
import ResidentialChecksService from './residentialChecksService'
import { parseIsoDate } from '../utils/utils'
import AssessmentStatus from '../enumeration/assessmentStatus'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'

const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const agent = createAgent() as Agent

describe('ResidentialChecksService', () => {
  let residentialChecksService: ResidentialChecksService

  beforeEach(() => {
    residentialChecksService = new ResidentialChecksService(assessForEarlyReleaseApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Residential checks task', () => {
    it('gets tasks and their status for an assessment', async () => {
      const view = createResidentialChecksView()
      assessForEarlyReleaseApiClient.getResidentialChecksView.mockResolvedValue(view)

      const result = await residentialChecksService.getResidentialChecksView(
        token,
        agent,
        view.assessmentSummary.prisonNumber,
        1,
      )

      expect(result.tasks).toHaveLength(6)
      expect(result.tasks).toEqual(expect.arrayContaining([expect.objectContaining({ status: 'NOT_STARTED' })]))
      expect(result.assessmentSummary).toEqual(
        expect.objectContaining({
          forename: 'Jim',
          surname: 'Smith',
          dateOfBirth: parseIsoDate('1976-04-14'),
          prisonNumber: 'A1234AB',
          hdced: parseIsoDate('2022-08-01'),
          crd: parseIsoDate('2022-08-10'),
          location: 'Prison',
          status: AssessmentStatus.NOT_STARTED,
          policyVersion: '1.0',
          mainOffense: 'Robbery',
          cellLocation: 'S-2-A1',
        }),
      )
      expect(result.overallStatus).toEqual('NOT_STARTED')
    })
  })
})
