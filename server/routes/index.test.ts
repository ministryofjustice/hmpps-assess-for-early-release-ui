import fs from 'fs'
import { templateRenderer } from '../utils/__testutils/templateTestUtils'

const render = templateRenderer(fs.readFileSync('server/views/pages/index.njk').toString())

describe('Views - Home', () => {
  it('should display support card when flag is true in context', () => {
    const $ = render({ shouldShowSupportCard: true })

    expect($('#supportCard').length).toBe(1)
  })
})
