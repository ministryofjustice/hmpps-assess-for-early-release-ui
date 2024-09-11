export interface components {
  schemas: {
    /** @description Offender Summary */
    OffenderSummary: {
      /** @description The offender's prisoner number. */
      prisonNumber: string
      /**
       * Format: int64
       * @description The offender's booking id.
       */
      bookingId: number
      /** @description The offender's first name. */
      forename: string
      /** @description The offender's last name. */
      surname: string
      /** @description The offender's home detention curfew eligibility date. */
      hdced?: string
    }
    /** @description Offender Summary */
    AssessmentSummary: {
      /** @description The offender's first name. */
      forename?: string
      /** @description The offender's last name. */
      surname?: string
      /** @description The offender's prisoner number. */
      prisonNumber: string
      /** @description The offender's home detention curfew eligibility date. */
      hdced: string
      /** @description The offender's conditional release date. */
      crd?: string
      /** @description The name of the prison the offender is in. */
      location: string
      /** @enum {string} */
      /**
       * @description The assessment status
       * @example NOT_STARTED
       * @enum {string}
       */
      status: 'NOT_STARTED' | 'OPTED_OUT'
    }
  }
}
