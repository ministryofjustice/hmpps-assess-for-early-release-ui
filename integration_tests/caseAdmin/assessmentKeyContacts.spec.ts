import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { assessmentContactsResponse, assessmentSummary, contactResponse } from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'

test.describe('Case admin assessment key contacts', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Case admin view key contacts', async ({ page }) => {
    // Given
    const prisonNumber: string = 'A1234AE'
    const assessmentSummaryDto = assessmentSummary(prisonNumber, AssessmentStatus.NOT_STARTED)

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummaryDto)

    const probationCom = contactResponse('Reli Boral', 'PROBATION_COM', 'reli.boral@moj.gov.uk', 'Cardiff')
    const prisonDm = contactResponse('Shussa Vollox', 'PRISON_DM', 'shussa.vollox@moj.gov.uk', 'London')
    const prisonCa = contactResponse('Hena Nivalli', 'PRISON_CA', 'hena.nivalli@moj.gov.uk', 'Bristol')

    const contacts = [probationCom, prisonDm, prisonCa]
    await assessForEarlyRelease.stubGetAssessmentContacts(
      assessmentSummaryDto.prisonNumber,
      assessmentContactsResponse(contacts),
    )
    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(paths.prison.assessment.home({ prisonNumber }))

    // When
    const keyContactsTab = page.locator('#tab_keycontacts')

    // Then
    await expect(keyContactsTab).toBeVisible()
    await keyContactsTab.click()

    const prisonCaText = page.getByTestId('PRISON_CA')
    const prisonCaParent = prisonCaText.locator('..').locator('..')
    await expect(prisonCaText).toContainText('Case administrator')
    await expect(prisonCaParent).toContainText('Hena Nivalli')
    await expect(prisonCaParent).toContainText('hena.nivalli@moj.gov.uk')
    await expect(prisonCaParent).toContainText('Bristol')

    const probationComText = page.getByTestId('PROBATION_COM')
    const probationComParent = probationComText.locator('..').locator('..')
    await expect(probationComText).toContainText('Probation practitioner')
    await expect(probationComParent).toContainText('Reli Boral')
    await expect(probationComParent).toContainText('reli.boral@moj.gov.uk')
    await expect(probationComParent).toContainText('Cardiff')

    const prisonDmText = page.getByTestId('PRISON_DM')
    const prisonDmParent = prisonDmText.locator('..').locator('..')
    await expect(prisonDmText).toContainText('Decision maker')
    await expect(prisonDmParent).toContainText('Shussa Vollox')
    await expect(prisonDmParent).toContainText('shussa.vollox@moj.gov.uk')
    await expect(prisonDmParent).toContainText('London')
  })

  test('Case admin view key contacts when no contacts found', async ({ page }) => {
    // Given
    const prisonNumber: string = 'A1234AE'
    const assessmentSummaryDto = assessmentSummary(prisonNumber, AssessmentStatus.NOT_STARTED)

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummaryDto)
    await assessForEarlyRelease.stubGetAssessmentContacts(
      assessmentSummaryDto.prisonNumber,
      assessmentContactsResponse([]),
    )
    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(paths.prison.assessment.home({ prisonNumber }))

    // When
    const keyContactsTab = page.locator('#tab_keycontacts')

    // Then
    await expect(keyContactsTab).toBeVisible()
    await keyContactsTab.click()

    const prisonCaText = page.getByTestId('PRISON_CA')
    const prisonCaParent = prisonCaText.locator('..').locator('..')
    await expect(prisonCaText).toContainText('Case administrator')
    await expect(prisonCaParent).toContainText('No case administrator has worked on this application yet')

    const probationComText = page.getByTestId('PROBATION_COM')
    const probationComParent = probationComText.locator('..').locator('..')
    await expect(probationComText).toContainText('Probation practitioner')
    await expect(probationComParent).toContainText('No probation practitioner has worked on this application yet')

    const prisonDmText = page.getByTestId('PRISON_DM')
    const prisonDmParent = prisonDmText.locator('..').locator('..')
    await expect(prisonDmText).toContainText('Decision maker')
    await expect(prisonDmParent).toContainText('No decision maker has worked on this application yet')
  })
})
