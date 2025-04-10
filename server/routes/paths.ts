import { path } from 'static-path'

const supportHome = path('/support')
const supportOffender = supportHome.path('offender')
const supportOffenderSearch = supportOffender.path('/search')
const supportOffenderSearchView = supportOffenderSearch.path('/:searchOffenderQuery')

const supportOffenderView = supportOffender.path(':prisonNumber/view')
const supportAssessments = supportOffender.path(':prisonNumber/assessments')
const supportAssessmentView = supportOffender.path(':prisonNumber/assessment/:id')
const supportAssessmentDelete = supportOffender.path(':prisonNumber/assessment/:id/delete')

const showPaths = supportHome.path('/paths')
const offender = path('/offender/:prisonNumber')
const document = offender.path('document/:documentSubjectType')

const prison = path('/omu')
const prisonCaseload = prison.path('case-list')
const prisonAssessmentHome = prison.path('application-overview/:prisonNumber')
const currentAssessment = prison.path('assessment/:prisonNumber')
const tasklist = currentAssessment.path('assess-eligibility-and-suitability')
const check = tasklist.path(':type/:checkCode')
const checksComplete = tasklist.path('checks-complete')
const enterCurfewAddressOrCasArea = currentAssessment.path('enter-curfew-address-or-cas-area')
const optOutCheck = enterCurfewAddressOrCasArea.path('opt-in-opt-out')
const optOut = enterCurfewAddressOrCasArea.path('opt-out-reason')
const findAddress = enterCurfewAddressOrCasArea.path('find-address')
const selectAddress = enterCurfewAddressOrCasArea.path('select-an-address')
const noAddressFound = enterCurfewAddressOrCasArea.path('no-address-found')
const addResidentDetails = enterCurfewAddressOrCasArea.path('add-details-of-residents/:checkRequestId')
const moreInformationRequiredCheck = enterCurfewAddressOrCasArea.path(':checkRequestId/additional-information')
const requestMoreAddressChecks = enterCurfewAddressOrCasArea.path('/add-another')
const deleteAddressCheckRequest = enterCurfewAddressOrCasArea.path(':checkRequestId/add-another/delete')
const checkYourAnswers = enterCurfewAddressOrCasArea.path('check-address-details')
const deleteCheckYourAnswers = enterCurfewAddressOrCasArea.path(':checkRequestId/check-address-details/delete')

const probation = path('/probation')
const probationCaseload = probation.path('caseload')
const probationAssessmentHome = probation.path('assessment/:prisonNumber')
const addressCheckTasklist = probationAssessmentHome.path('address-checks/:checkRequestId')
const addressCheckTask = addressCheckTasklist.path(':taskCode')
const probationCurfewAddress = probationAssessmentHome.path('curfew-address')
const checkCurfewAddresses = probationCurfewAddress.path('/check-addresses')
const reviewInformation = probationAssessmentHome.path('review-information')
const nonDisclosableInformation = probationAssessmentHome.path('non-disclosable-information')

const decisionMaker = path('/decisionMaker')
const decisionMakerCaseload = decisionMaker.path('caseload')
const decisionMakerAssessmentHome = decisionMaker.path('assessment/:prisonNumber')

const paths = {
  support: {
    home: supportHome,
    showPaths,
    offender: {
      supportOffenderSearch,
      supportOffenderSearchView,
      supportOffenderView,
      supportAssessments,
      supportAssessmentView,
      supportAssessmentDelete,
    },
  },
  prison: {
    prisonCaseload,
    assessment: {
      home: prisonAssessmentHome,
      initialChecks: {
        tasklist,
        check,
        checksComplete,
      },
      enterCurfewAddressOrCasArea: {
        optOutCheck,
        optOut,
        findAddress,
        selectAddress,
        noAddressFound,
        addResidentDetails,
        moreInformationRequiredCheck,
        requestMoreAddressChecks,
        deleteAddressCheckRequest,
        checkYourAnswers,
        deleteCheckYourAnswers,
      },
    },
  },
  probation: {
    probationCaseload,
    assessment: {
      home: probationAssessmentHome,
      curfewAddress: {
        checkCurfewAddresses,
        addressCheckTasklist,
        addressCheckTask,
      },
      reviewInformation,
      nonDisclosableInformation,
    },
  },
  decisionMaker: {
    decisionMakerCaseload,
    assessment: {
      home: decisionMakerAssessmentHome,
    },
  },
  offender: {
    document,
  },
}

export default paths
