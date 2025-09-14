const incorrectCardDetailsErrorConstant = {
    CARD_NUMBER_SHOULD_BE_16_DIGITS: 'Card Number should be 16 digits.' as const,
    CVV_NUMBER_SHOULD_BE_3_DIGITS: 'CVV Number should be 3 digits.' as const,
    INVALID_EXIPY_MONTH: 'Enter Valid Expiry Month. Cannot be more than 12.' as const,
    INVALID_EXPIRY_YEAR: 'Enter Four Digit Expiry Year.' as const,

    ENTER_CARD_HOLDER_NAME: 'Enter Card Holder Name.' as const,
    ENTER_CARD_NUMBER: 'Enter Card Number.' as const,
    ENTER_CARD_CVV_NUMBER: 'Enter Card CVV Number.' as const,
    ENTER_CARD_EXPIRY_MONTH: 'Enter Card Expiry Month.' as const,
    ENTER_CARD_EXPIRY_YEAR: 'Enter Card Expiry Year.' as const
} as const;

export { incorrectCardDetailsErrorConstant }