import { ApiConfig, AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type {
  _OffenderResponse,
  Agent,
  OffenderResponse,
  _AssessmentResponse,
  AssessmentResponse,
  AssessmentSearchResponse,
  _AssessmentSearchResponse,
  _OffenderSearchResponse,
  OffenderSearchResponse,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import config from '../config'
import { parseIsoDate, parseIsoDateTime } from '../utils/utils'
import logger from '../../logger'

export default class AferSupportApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('assessForEarlyReleaseApi', config.apis.assessForEarlyReleaseApi as ApiConfig, logger, authenticationClient)
  }

  async doOffenderSearch(token: string, agent: Agent, searchString: string): Promise<OffenderSearchResponse[]> {
    const offenderSearchResponse = await this.getWithToken<_OffenderSearchResponse[]>(
      `/support/offender/search/${searchString}`,
      token,
      agent,
    )

    return offenderSearchResponse.map(_OffenderSearchResponse => {
      return {
        ..._OffenderSearchResponse,
        dateOfBirth: parseIsoDate(_OffenderSearchResponse.dateOfBirth),
        name: `${_OffenderSearchResponse.forename} ${_OffenderSearchResponse.surname}`,
      }
    })
  }

  async getOffender(token: string, agent: Agent, prisonNumber: string): Promise<OffenderResponse> {
    const offenderResponse = await this.getWithToken<_OffenderResponse>(
      `/support/offender/${prisonNumber}`,
      token,
      agent,
    )

    logger.debug(offenderResponse)

    return {
      ...offenderResponse,
      dateOfBirth: parseIsoDate(offenderResponse.dateOfBirth),
      createdTimestamp: parseIsoDateTime(offenderResponse.createdTimestamp),
      lastUpdatedTimestamp: parseIsoDateTime(offenderResponse.lastUpdatedTimestamp),
    }
  }

  async getCurrentAssessment(token: string, agent: Agent, prisonNumber: string): Promise<AssessmentResponse> {
    const currentAssessment = await this.getWithToken<_AssessmentResponse>(
      `/support/offender/${prisonNumber}/assessment/current`,
      token,
      agent,
    )

    return {
      ...currentAssessment,
      postponementDate: parseIsoDate(currentAssessment.postponementDate),
      deletedTimestamp: parseIsoDateTime(currentAssessment.deletedTimestamp),
      lastUpdatedTimestamp: parseIsoDateTime(currentAssessment.lastUpdatedTimestamp),
      createdTimestamp: parseIsoDateTime(currentAssessment.createdTimestamp),
      hdced: parseIsoDate(currentAssessment.hdced),
      crd: parseIsoDate(currentAssessment.crd),
      sentenceStartDate: parseIsoDate(currentAssessment.sentenceStartDate),
    }
  }

  async getAssessment(token: string, agent: Agent, assessmentId: string): Promise<AssessmentResponse> {
    const assessment = await this.getWithToken<_AssessmentResponse>(
      `/support/offender/assessment/${assessmentId}`,
      token,
      agent,
    )

    return {
      ...assessment,
      postponementDate: parseIsoDate(assessment.postponementDate),
      deletedTimestamp: parseIsoDateTime(assessment.deletedTimestamp),
      lastUpdatedTimestamp: parseIsoDateTime(assessment.lastUpdatedTimestamp),
      createdTimestamp: parseIsoDateTime(assessment.createdTimestamp),
      hdced: parseIsoDate(assessment.hdced),
      crd: parseIsoDate(assessment.crd),
      sentenceStartDate: parseIsoDate(assessment.sentenceStartDate),
    }
  }

  async getAssessments(token: string, agent: Agent, prisonNumber: string): Promise<AssessmentSearchResponse[]> {
    const assessments = await this.getWithToken<_AssessmentSearchResponse[]>(
      `/support/offender/${prisonNumber}/assessments`,
      token,
      agent,
    )
    return assessments.map(assessment => {
      return {
        ...assessment,
        deletedTimestamp: parseIsoDateTime(assessment.deletedTimestamp),
        lastUpdatedTimestamp: parseIsoDateTime(assessment.lastUpdatedTimestamp),
        createdTimestamp: parseIsoDateTime(assessment.createdTimestamp),
        deleted: assessment.deletedTimestamp !== null,
      }
    })
  }

  async deleteAssessment(token: string, agent: Agent, assessmentId: string): Promise<void> {
    await this.deleteWithToken<void>(`/support/offender/assessment/${assessmentId}`, token, agent)
  }

  async deleteCurrentAssessment(token: string, agent: Agent, prisonNumber: string): Promise<void> {
    await this.deleteWithToken<void>(`/support/offender/${prisonNumber}/assessment/current`, token, agent)
  }

  private getDefaultHeaders(agent: Agent) {
    return {
      username: agent?.username,
      fullName: agent?.fullName,
      role: agent?.role,
      onBehalfOf: agent?.onBehalfOf,
    }
  }

  private getWithToken<T>(path: string, token: string, agent: Agent, responseType = ''): Promise<T> {
    return this.get<T>(
      {
        path,
        headers: this.getDefaultHeaders(agent),
        responseType,
      },
      token,
    )
  }

  private deleteWithToken<T>(path: string, token: string, agent: Agent): Promise<T> {
    return this.delete<T>(
      {
        path,
        headers: this.getDefaultHeaders(agent),
      },
      token,
    )
  }
}
