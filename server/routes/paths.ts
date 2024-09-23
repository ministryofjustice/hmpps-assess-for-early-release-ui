import { path } from 'static-path'

const supportHome = path('/support')
const prison = path('/prison')

const caseload = prison.path('caseload')
const assessmentHome = prison.path('assessment/:prisonNumber')

const initialChecks = assessmentHome.path('initial-checks')

const optOutCheckPath = assessmentHome.path('opt-out-check')
const optOutPath = assessmentHome.path('opt-out')

const paths = {
  support: {
    home: supportHome,
  },
  prison: {
    caseload,
    assessment: {
      home: assessmentHome,
      initialChecks,
      optOutCheckPath,
      optOutPath,
    },
  },
}

export default paths
