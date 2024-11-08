import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default hmppsConfig({
  extraIgnorePaths: ['test_results'],
  extraPathsAllowingDevDependencies: ['playwright.config.ts'],
  extraGlobals: { $: false },
})
