import { path } from 'static-path'

const supportHome = path('/support')
const prison = path('/prison')
const probation = path('/probation')
const showPaths = supportHome.path('/paths')

const prisonCaseload = prison.path('caseload')
const probationCaseload = probation.path('caseload')
const prisonAssessmentHome = prison.path('assessment/:prisonNumber')
const probationAssessmentHome = probation.path('assessment/:prisonNumber')

const tasklist = prisonAssessmentHome.path('initial-checks')
const check = tasklist.path(':type/:checkCode')

const addressCheckTasklist = probationAssessmentHome.path('address-checks/:checkRequestId')
const addressCheckTask = addressCheckTasklist.path(':taskCode')
const optOutCheck = prisonAssessmentHome.path('opt-out-check')
const optOut = prisonAssessmentHome.path('opt-out')

const prisonCurfewAddress = prisonAssessmentHome.path('curfew-address')
const probationCurfewAddress = probationAssessmentHome.path('curfew-address')
const findAddress = prisonCurfewAddress.path('find-address')
const selectAddress = prisonCurfewAddress.path('select-address')
const noAddressFound = prisonCurfewAddress.path('no-address-found')
const addResidentDetails = prisonCurfewAddress.path('resident-details/:checkRequestId')
const moreInformationRequiredCheck = prisonCurfewAddress.path(':checkRequestId/more-information-required-check')
const moreInformationRequired = prisonCurfewAddress.path(':checkRequestId/more-information-required')
const requestMoreAddressChecks = prisonCurfewAddress.path('/request-more-address-checks')
const deleteAddressCheckRequest = prisonCurfewAddress.path(':checkRequestId/request-more-address-checks/delete')
const checkYourAnswers = prisonCurfewAddress.path('/check-your-answers')
const checkCurfewAddresses = probationCurfewAddress.path('/check-addresses')
const deleteCheckYourAnswers = prisonCurfewAddress.path(':checkRequestId/check-your-answers/delete')

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
      optOutCheck,
      optOut,
      curfewAddress: {
        findAddress,
        selectAddress,
        noAddressFound,
        addResidentDetails,
        moreInformationRequiredCheck,
        moreInformationRequired,
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
    },
  },
}

export default paths
