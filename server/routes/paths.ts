import { path } from 'static-path'

const supportHome = path('/support')
const prison = path('/prison')

const caseload = prison.path('caseload')
const assessmentHome = prison.path('assessment/:prisonNumber')

const tasklist = assessmentHome.path('initial-checks')
const check = tasklist.path(':type/:checkCode')

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
      initialChecks: {
        tasklist,
        check,
      },
      optOutCheckPath,
      optOutPath,
    },
  },
}

export default paths
