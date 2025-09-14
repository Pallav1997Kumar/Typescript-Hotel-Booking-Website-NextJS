const roomBookingDateTypeConstants = {
    SINGLE_DATE: 'Single Date' as const,
    MULTIPLE_DATES_CONTINOUS: 'Multiple Dates Continuous' as const,
    MULTIPLE_DATES_NON_CONTINOUS: 'Multiple Dates Non Continuous' as const
} as const;

const wantFoodServiceConstants = {
    WANT_FOOD_SERVICE_YES: 'Yes' as const,
    WANT_FOOD_SERVICE_NO: 'No' as const
} as const;

const eventMeetingTimingConstants = {
    MID_NIGHT_TIME: 'Mid Night' as const,
    NIGHT_TIME: 'Night' as const,
    EVENING_TIME: 'Evening' as const,
    AFTERNOON_TIME: 'Afternoon' as const,
    MORNING_TIME: 'Morning' as const
} as const;

export { roomBookingDateTypeConstants, wantFoodServiceConstants, eventMeetingTimingConstants };
