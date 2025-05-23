import { renderTemplate } from '../../../utils/__testutils/templateTestUtils'

describe('tasks', () => {
  it('Initial state', () => {
    const $ = renderTemplate(
      ' {% from "partials/assessment/tasks.njk" import tasks %} {{ tasks("PRISON_CA", assessmentSummary) }}',
      {
        assessmentSummary: {
          forename: 'Test',
          surname: 'Person',
          prisonNumber: 'A1234AA',
          tasks: [
            { name: 'ASSESS_ELIGIBILITY', progress: 'READY_TO_START' },
            { name: 'ENTER_CURFEW_ADDRESS', progress: 'LOCKED' },
            { name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION', progress: 'LOCKED' },
            { name: 'COMPLETE_14_DAY_CHECKS', progress: 'LOCKED' },
            { name: 'COMPLETE_2_DAY_CHECKS', progress: 'LOCKED' },
            { name: 'PRINT_LICENCE', progress: 'LOCKED' },
          ],
          toDoEligibilityAndSuitabilityBy: '2022-01-08',
          result: null,
        },
      },
    )

    expect($('[data-qa="ASSESS_ELIGIBILITY"] h2').text()).toContain('Assess eligibility and suitability')
    expect($('[data-qa="ASSESS_ELIGIBILITY"] .app-task-badge').text()).toContain('Ready to start')
    expect($('[data-qa="ASSESS_ELIGIBILITY"].ready-to-start').length).toStrictEqual(1)
    expect($('[data-qa="ASSESS_ELIGIBILITY"] .govuk-button').text()).toContain('Start')
    expect($('[data-qa="ASSESS_ELIGIBILITY"] p').text()).not.toContain('Result:')

    expect($('[data-qa="ENTER_CURFEW_ADDRESS"] h2').text()).toContain('Enter curfew addresses or CAS areas')
    expect($('[data-qa="ENTER_CURFEW_ADDRESS"] .app-task-badge').length).toStrictEqual(0)
    expect($('[data-qa="ENTER_CURFEW_ADDRESS"].locked').length).toStrictEqual(1)

    expect($('[data-qa="REVIEW_APPLICATION_AND_SEND_FOR_DECISION"] h2').text()).toContain(
      'Review application and send for decision',
    )
    expect($('[data-qa="REVIEW_APPLICATION_AND_SEND_FOR_DECISION"] .app-task-badge').length).toStrictEqual(0)
    expect($('[data-qa="REVIEW_APPLICATION_AND_SEND_FOR_DECISION"].locked').length).toStrictEqual(1)

    expect($('[data-qa="COMPLETE_14_DAY_CHECKS"] h2').text()).toContain('Complete 14-day check')
    expect($('[data-qa="COMPLETE_14_DAY_CHECKS"] .app-task-badge').length).toStrictEqual(0)
    expect($('[data-qa="COMPLETE_14_DAY_CHECKS"].locked').length).toStrictEqual(1)

    expect($('[data-qa="COMPLETE_2_DAY_CHECKS"] h2').text()).toContain('Complete 2-day check')
    expect($('[data-qa="COMPLETE_2_DAY_CHECKS"] .app-task-badge').length).toStrictEqual(0)
    expect($('[data-qa="COMPLETE_2_DAY_CHECKS"].locked').length).toStrictEqual(1)

    expect($('[data-qa="PRINT_LICENCE"] h2').text()).toContain('Print licence')
    expect($('[data-qa="PRINT_LICENCE"] .app-task-badge').length).toStrictEqual(0)
    expect($('[data-qa="PRINT_LICENCE"].locked').length).toStrictEqual(1)
  })

  it('After eligibility checks pass', () => {
    const $ = renderTemplate(
      ' {% from "partials/assessment/tasks.njk" import tasks %} {{ tasks("PRISON_CA", assessmentSummary) }}',
      {
        assessmentSummary: {
          forename: 'Test',
          surname: 'Person',
          prisonNumber: 'A1234AA',
          tasks: [
            { name: 'ASSESS_ELIGIBILITY', progress: 'COMPLETE' },
            { name: 'ENTER_CURFEW_ADDRESS', progress: 'READY_TO_START' },
            { name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION', progress: 'LOCKED' },
            { name: 'COMPLETE_14_DAY_CHECKS', progress: 'LOCKED' },
            { name: 'COMPLETE_2_DAY_CHECKS', progress: 'LOCKED' },
            { name: 'PRINT_LICENCE', progress: 'LOCKED' },
          ],
          toDoEligibilityAndSuitabilityBy: '2022-01-08',
          result: 'Eligible and suitable',
        },
      },
    )

    expect($('[data-qa="ASSESS_ELIGIBILITY"] h2').text()).toContain('Assess eligibility and suitability')
    expect($('[data-qa="ASSESS_ELIGIBILITY"] .app-task-badge').text()).toContain('Completed')
    expect($('[data-qa="ASSESS_ELIGIBILITY"].complete').length).toStrictEqual(1)
    expect($('[data-qa="ASSESS_ELIGIBILITY"] p').text()).toContain('Result: Eligible and suitable')
    expect($('[data-qa="ASSESS_ELIGIBILITY"] a').text()).toContain('View or change')

    expect($('[data-qa="ENTER_CURFEW_ADDRESS"] h2').text()).toContain('Enter curfew addresses or CAS areas')
    expect($('[data-qa="ENTER_CURFEW_ADDRESS"] .app-task-badge').text()).toContain('Ready to start')
    expect($('[data-qa="ENTER_CURFEW_ADDRESS"].ready-to-start').length).toStrictEqual(1)
    expect($('[data-qa="ENTER_CURFEW_ADDRESS"] .govuk-button').text()).toContain('Start')

    expect($('[data-qa="REVIEW_APPLICATION_AND_SEND_FOR_DECISION"] h2').text()).toContain(
      'Review application and send for decision',
    )
    expect($('[data-qa="REVIEW_APPLICATION_AND_SEND_FOR_DECISION"] .app-task-badge').length).toStrictEqual(0)
    expect($('[data-qa="REVIEW_APPLICATION_AND_SEND_FOR_DECISION"].locked').length).toStrictEqual(1)

    expect($('[data-qa="COMPLETE_14_DAY_CHECKS"] h2').text()).toContain('Complete 14-day check')
    expect($('[data-qa="COMPLETE_14_DAY_CHECKS"] .app-task-badge').length).toStrictEqual(0)
    expect($('[data-qa="COMPLETE_14_DAY_CHECKS"].locked').length).toStrictEqual(1)

    expect($('[data-qa="COMPLETE_2_DAY_CHECKS"] h2').text()).toContain('Complete 2-day check')
    expect($('[data-qa="COMPLETE_2_DAY_CHECKS"] .app-task-badge').length).toStrictEqual(0)
    expect($('[data-qa="COMPLETE_2_DAY_CHECKS"].locked').length).toStrictEqual(1)

    expect($('[data-qa="PRINT_LICENCE"] h2').text()).toContain('Print licence')
    expect($('[data-qa="PRINT_LICENCE"] .app-task-badge').length).toStrictEqual(0)
    expect($('[data-qa="PRINT_LICENCE"].locked').length).toStrictEqual(1)
  })
})
