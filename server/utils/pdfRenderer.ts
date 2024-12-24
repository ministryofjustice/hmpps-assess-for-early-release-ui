import { Request, Response, NextFunction } from 'express'
import GotenbergClient from '../data/gotenbergClient'
import logger from '../../logger'

/*
 * This function accepts a Gotenberg client as its only argument.
 * It returns a handler function to render a normal HTML view template to
 * produce the raw HTML (including images, stylesheet etc). It then uses a
 * callback function to pass rendered HTML view into the Gotenberg client
 * to produce and return a PDF document.
 */

// TODO: Revisit to fully define these types for the "any" placeholders
export default function pdfRenderer(client: GotenbergClient) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.renderPDF = (
      view: string,
      // Define the pageData as - { url: string, licence: Licence, otherData: type? }
      pageData: Buffer,
      options: { filename: string } = { filename: 'document.pdf' },
    ) => {
      res.render(view, pageData, (error: Error | null) => {
        if (error) {
          throw error
        }

        res.header('Content-Type', 'application/pdf')
        res.header('Content-Transfer-Encoding', 'binary')
        res.header('Content-Disposition', `inline; filename=${options.filename}`)

        return client
          .renderPdf(pageData)
          .then(buffer => res.send(buffer))
          .catch(reason => {
            logger.warn(reason)
          })
      })
    }
    next()
  }
}
