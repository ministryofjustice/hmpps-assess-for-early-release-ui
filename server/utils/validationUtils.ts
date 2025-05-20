const PHONE_NUMBER_REGEX =
  /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{3,4}\s?\d{4}))(\s?\\#(\d{4}|\d{3}))?$/

const isValidPhoneNumber = (phoneNumber: string) => {
  return PHONE_NUMBER_REGEX.test(phoneNumber)
}

export default isValidPhoneNumber
