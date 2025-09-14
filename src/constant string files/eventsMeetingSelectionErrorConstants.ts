const singleDateEventsMeetingSelectionErrorConstants = {
    BOOKING_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date, Event Booking Time and Event Seating Arrangement.' as const,
    
    BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time and Event Seating Arrangement' as const,
    BOOKING_DATE_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date and Event Booking Time' as const,
    BOOKING_DATE_BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date and Event Booking Time' as const,

    BOOKING_DATE_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date' as const,
    BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time' as const,
    SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Seating Arrangement' as const,

    GUEST_NOT_LESS_THAN_ONE: 'Number of guest cannot be less than 1' as const,
    GUEST_COUNT_GREATER_THAN_CAPACITY: 'You have entered Number of Guests greater than Seating Arrangement Capacity' as const,
    SELECT_FOOD_ITEM: 'Please Select atleast one Food Item if you want Food Services!' as const
} as const;

const multipleContinousDatesEventsMeetingSelectionErrorConstants = {
    GUEST_COUNT_GREATER_THAN_CAPACITY: 'You have entered Number of Guests greater than Seating Arrangement Capacity' as const,
    GUEST_NOT_LESS_THAN_ONE: 'Number of guest cannot be less than 1' as const,
    SELECT_FOOD_ITEM: 'Please Select atleast one Food Item if you want Food Services!' as const,

    BOOKING_START_DATE_BOOKING_END_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date, Event Booking End Date, Event Booking Time and Event Seating Arrangement' as const,

    BOOKING_START_DATE_BOOKING_END_DATE_BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date, Event Booking End Date and Event Booking Time' as const,
    BOOKING_START_DATE_BOOKING_END_DATE_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date, Event Booking End Date and Event Seating Arrangement' as const,
    BOOKING_START_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date, Event Booking Time and Event Seating Arrangement' as const,
    BOOKING_END_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking End Date, Event Booking Time and Event Seating Arrangement' as const,

    BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time and Event Seating Arrangement' as const,
    BOOKING_END_DATE_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking End Date and Event Seating Arrangement' as const,
    BOOKING_END_DATE_BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking End Date and Event Booking Time' as const,
    BOOKING_START_DATE_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date and Event Seating Arrangement' as const,
    BOOKING_START_DATE_BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date and Event Booking Time' as const,

    BOOKING_START_DATE_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Start Date' as const,
    BOOKING_END_DATE_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking End Date' as const,
    BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time' as const,
    SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Seating Arrangement' as const
} as const;

const multipleNonContinousDatesEventsMeetingSelectionErrorConstants = {
    GUEST_COUNT_GREATER_THAN_CAPACITY: 'You have entered Number of Guests greater than Seating Arrangement Capacity' as const,
    SELECT_FOOD_ITEM: 'Please Select atleast one Food Item if you want Food Services!' as const,
    GUEST_NOT_LESS_THAN_ONE: 'Number of guest cannot be less than 1' as const,

    BOOKING_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date, Event Booking Time and Event Seating Arrangement.' as const,
    
    BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time and Event Seating Arrangement' as const,
    BOOKING_DATE_SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date and Event Booking Time' as const,
    BOOKING_DATE_BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date and Event Booking Time' as const,

    BOOKING_DATE_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Date' as const,
    BOOKING_TIME_REQUIRED: 'Incorrect Input !!!  Please Choose Event Booking Time' as const,
    SEATING_ARRANGEMENT_REQUIRED: 'Incorrect Input !!!  Please Choose Event Seating Arrangement' as const,

    INPUT_NOT_LESS_THAN_TWO: 'Number of input cannot be less than 2' as const,
    MULTIPLE_SAME_DATES_CHOOSEN: 'You have Choosen Two or More Same Dates' as const,
    ALL_DATES_INPUT_NOT_CHOOSEN: 'You have not Choosen Inputs for all the Dates' as const
} as const;

export { 
    singleDateEventsMeetingSelectionErrorConstants, 
    multipleContinousDatesEventsMeetingSelectionErrorConstants, 
    multipleNonContinousDatesEventsMeetingSelectionErrorConstants 
};
