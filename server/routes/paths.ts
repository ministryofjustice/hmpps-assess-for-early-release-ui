import { path } from 'static-path'

const supportHome = path('/support')

const showPaths = supportHome.path('/paths')
const offender = path('/offender/:prisonNumber')
const document = offender.path('document/:documentSubjectType')

const prison = path('/omu')
const prisonCaseload = prison.path('case-list')
const prisonAssessmentHome = prison.path('application-overview/:prisonNumber')
const currentAssessment = prison.path('assessment/:prisonNumber')
const tasklist = currentAssessment.path('assess-eligibility-and-suitability')
const check = tasklist.path(':type/:checkCode')
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

const decisionMaker = path('/decisionMaker')
const decisionMakerCaseload = decisionMaker.path('caseload')
const decisionMakerAssessmentHome = decisionMaker.path('assessment/:prisonNumber')

const paths = {
  support: {
    home: supportHome,
    showPaths,
  },
  prison: {
    prisonCaseload,
    assessment: {
      home: prisonAssessmentHome,
      initialChecks: {
        tasklist,
        check,
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
