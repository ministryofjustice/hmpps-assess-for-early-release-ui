# hmpps-assess-for-early-release-ui
[![repo standards badge](https://img.shields.io/badge/endpoint.svg?&style=flat&logo=github&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-assess-for-early-release-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-assess-for-early-release-ui "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-assess-for-early-release-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-assess-for-early-release-ui)

A service to allow prisoners to be assessed for suitability for early release.

## Running the app
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

`docker compose pull`

`docker compose up`

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* redis - session store and token caching

### Running the app for development

To start the main services excluding the example typescript template app: 

`docker compose up --scale=app=0`

Install dependencies using `npm install`, ensuring you are using `node v20`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

And then, to build the assets and start the app with esbuild:

`npm run start:dev`

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Running integration tests

For local running, start a test db and wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with auto-restart on changes)

And to run all the tests:

`npx playwright test`
 
Or run tests with the playwright UI:

`npx playwright test --ui`

Or to run a subset of tests,

# by directory
`npx playwright test integration_tests`

# by filename
`npx playwright test signIn`

# or by test name (-g)
`npx playwright test -g 'User name visible in header'`

