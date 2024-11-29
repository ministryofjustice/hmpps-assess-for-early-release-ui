import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createResidentialChecksView } from '../data/__testutils/testObjects'
import ResidentialChecksService from './residentialChecksService'

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
      expect(result).toEqual(result)
    })
  })
})
