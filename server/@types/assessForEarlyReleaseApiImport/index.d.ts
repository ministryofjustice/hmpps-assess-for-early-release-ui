export interface components {
  schemas: {
    /** @description Offender Summary */
    OffenderSummary: {
      /** @description The offender's prisoner number. */
      prisonerNumber: string
      /**
       * Format: int64
       * @description The offender's booking id.
       */
      bookingId: number
      /** @description The offender's first name. */
      firstName: string
      /** @description The offender's last name. */
      lastName: string
      /** @description The offender's home detention curfew eligibility date. */
      hdced?: string
    }
  }
}
