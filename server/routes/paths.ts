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
    },
  },
}

export default paths
