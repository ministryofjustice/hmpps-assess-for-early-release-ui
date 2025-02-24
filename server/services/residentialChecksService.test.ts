import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createResidentialChecksView } from '../data/__testutils/testObjects'
import ResidentialChecksService from './residentialChecksService'
import { parseIsoDate } from '../utils/utils'
import AssessmentStatus from '../enumeration/assessmentStatus'

const assessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'

describe('ResidentialChecksService', () => {
  let residentialChecksService: ResidentialChecksService

  beforeEach(() => {
    assessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    residentialChecksService = new ResidentialChecksService(assessForEarlyReleaseApiClientBuilder)
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
        view.assessmentSummary.prisonNumber,
        1,
      )

      expect(assessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
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
