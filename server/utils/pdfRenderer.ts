import { Request, Response, NextFunction } from 'express'

export default function pdfRenderer() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.renderPDF = (pageData: Buffer, options: { filename: string } = { filename: 'document.pdf' }) => {
      res.header('Content-Type', 'application/pdf')
      res.header('Content-Transfer-Encoding', 'binary')
      res.header('Content-Disposition', `inline; filename=${options.filename}`)

      return res.send(pageData)
    }
    next()
  }
}
