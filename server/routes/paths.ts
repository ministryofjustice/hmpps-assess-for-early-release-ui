import { path } from 'static-path'

const supportHome = path('/support')
const prison = path('/prison')
const showPaths = supportHome.path('/paths')

const caseload = prison.path('caseload')
const assessmentHome = prison.path('assessment/:prisonNumber')

const tasklist = assessmentHome.path('initial-checks')
const check = tasklist.path(':type/:checkCode')

const optOutCheck = assessmentHome.path('opt-out-check')
const optOut = assessmentHome.path('opt-out')

const curfewAddress = assessmentHome.path('curfew-address')
const findAddress = curfewAddress.path('find-address')
const selectAddress = curfewAddress.path('select-address')
const noAddressFound = curfewAddress.path('no-address-found')
const addResidentDetails = curfewAddress.path('resident-details/:checkRequestId')
const moreInformationRequiredCheck = curfewAddress.path(':checkRequestId/more-information-required-check')
const moreInformationRequired = curfewAddress.path(':checkRequestId/more-information-required')
const requestMoreAddressChecks = curfewAddress.path(':checkRequestId/request-more-address-checks')

const paths = {
  support: {
    home: supportHome,
    showPaths,
  },
  prison: {
    caseload,
    assessment: {
      home: assessmentHome,
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
      },
    },
  },
}

export default paths
