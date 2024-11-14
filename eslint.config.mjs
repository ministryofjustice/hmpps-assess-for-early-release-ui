import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default hmppsConfig({
  extraIgnorePaths: ['test_results'],
  extraPathsAllowingDevDependencies: ['playwright.config.ts'],
  extraGlobals: { $: false },
  extraFrontendGlobals: {
    // jquery
    $: 'readable',
    // GA4
    gtag: 'readable',
  },
})