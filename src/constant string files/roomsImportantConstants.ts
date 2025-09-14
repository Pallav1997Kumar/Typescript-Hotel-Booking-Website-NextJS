const roomCounterConstant = {
    INCREASE: 'Increase' as const,
    DECREASE: 'Decrease' as const
} as const;

const guestTitleConstant = {
    ADULT: 'Adult' as const,
    CHILDREN: 'Children' as const
} as const;

export { roomCounterConstant, guestTitleConstant };