export const INTERNAL_SERVER_ERROR: string = 'Internal Server Error';

export const REGISTRATION_ERROR_MESSAGE = {
    EMAIL_ADDRESS_ALREADY_EXIST: 'Email Address already exist!' as const,
    INVALID_DOMAIN_EMAIL_ADDRESS: 'This Email Address belongs for business purpose. Please select other domain Email Address!' as const,
} as const;

export const LOGIN_ERROR_MESSAGE = {
    INCORRECT_PASSWORD: 'Incorrect Password!' as const,
    EMAIL_ADDRESS_DOES_NOT_EXIST: 'Email Address does not exist!' as const,
} as const;

export const USER_NOT_FOUND: string = 'User not Found!';

export const UPDATE_PASSWORD = {
    INCORRECT_OLD_PASSWORD: 'Incorrect Old Password' as const,
} as const;

export const CART_ID_NOT_FOUND: string = 'Cart Id not Found!';

export const JWT_TOKEN_IS_MISSING: string = 'JWT token is missing';

export const TRANSACTION_ID_NOT_FOUND: string = 'Transaction Id not Found!';

export const INVALID_BOOKING_PAYLOAD: string = "Invalid booking payload.";

export const BOOKING_UNAVAILABLE_LOCKED = {
    DINING_TABLE_UNAVAILABLE: 'Dining Table Unavailable' as const,
    DINING_TABLE_LOCKED: 'Dining Table Locked' as const,
    ROOM_SUITE_UNAVAILABLE: 'Rooms Suites Unavailable' as const,
    ROOM_SUITE_LOCKED: 'Rooms Suites Locked' as const,
    EVENT_MEETING_ROOM_UNAVAILABLE: 'Event Meeting Rooms Unavailable' as const,
    EVENT_MEETING_ROOM_LOCKED: 'Event Meeting Rooms Locked' as const,
    PLEASE_TRY_AGAIN_LATER: 'Please try again later after 5 minuites.' as const
}
