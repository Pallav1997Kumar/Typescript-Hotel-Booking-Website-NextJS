interface IEventMeetingBookingLockCheckingSuccessApiResponse {
    message: string;
}

interface IEventMeetingBookingLockCheckingErrorApiResponse {
    errorMessage: string;
}

type EventMeetingBookingLockCheckingApiResponse = 
    | IEventMeetingBookingLockCheckingSuccessApiResponse
    | IEventMeetingBookingLockCheckingErrorApiResponse;


export type {
    IEventMeetingBookingLockCheckingSuccessApiResponse,
    IEventMeetingBookingLockCheckingErrorApiResponse,
    EventMeetingBookingLockCheckingApiResponse
}



interface IEventMeetingBookingTransactionCreationSuccessApiResponse {
    message: string;
    transactionId: string;
}

interface IEventMeetingBookingTransactionCreationErrorApiResponse {
    errorMessage: string;
}

type EventMeetingBookingTransactionCreationApiResponse = 
    | IEventMeetingBookingTransactionCreationSuccessApiResponse
    | IEventMeetingBookingTransactionCreationErrorApiResponse;


export type {
    IEventMeetingBookingTransactionCreationSuccessApiResponse,
    IEventMeetingBookingTransactionCreationErrorApiResponse,
    EventMeetingBookingTransactionCreationApiResponse
}



interface IEventMeetingBookingDeductMoneyFromWalletSuccessApiResponse {
    message: string;
}

interface IEventMeetingBookingDeductMoneyFromWalletErrorApiResponse {
    errorMessage: string;
}

type EventMeetingBookingDeductMoneyFromWalletApiResponse = 
    | IEventMeetingBookingDeductMoneyFromWalletSuccessApiResponse
    | IEventMeetingBookingDeductMoneyFromWalletErrorApiResponse;


export type {
    IEventMeetingBookingDeductMoneyFromWalletSuccessApiResponse,
    IEventMeetingBookingDeductMoneyFromWalletErrorApiResponse,
    EventMeetingBookingDeductMoneyFromWalletApiResponse
}



interface IEventMeetingBookingUnlockAddBookingSuccessApiResponse {
    message: string;
}

interface IEventMeetingBookingUnlockAddBookingErrorApiResponse {
    errorMessage: string;
}

type EventMeetingBookingUnlockAddBookingApiResponse = 
    | IEventMeetingBookingUnlockAddBookingSuccessApiResponse
    | IEventMeetingBookingUnlockAddBookingErrorApiResponse;


export type {
    IEventMeetingBookingUnlockAddBookingSuccessApiResponse,
    IEventMeetingBookingUnlockAddBookingErrorApiResponse,
    EventMeetingBookingUnlockAddBookingApiResponse
}



interface IEventMeetingBookingAddBookingSuccessApiResponse {
    message: string;
}

interface IEventMeetingBookingAddBookingErrorApiResponse {
    errorMessage: string;
}

type EventMeetingBookingAddBookingApiResponse = 
    | IEventMeetingBookingAddBookingSuccessApiResponse
    | IEventMeetingBookingAddBookingErrorApiResponse;


export type {
    IEventMeetingBookingAddBookingSuccessApiResponse,
    IEventMeetingBookingAddBookingErrorApiResponse,
    EventMeetingBookingAddBookingApiResponse
}



interface IEventMeetingBookingDeleteCartSuccessApiResponse {
    message: string;
}

interface IEventMeetingBookingDeleteCartErrorApiResponse {
    errorMessage: string;
}

type EventMeetingBookingDeleteCartApiResponse = 
    | IEventMeetingBookingDeleteCartSuccessApiResponse
    | IEventMeetingBookingDeleteCartErrorApiResponse;


export type {
    IEventMeetingBookingDeleteCartSuccessApiResponse,
    IEventMeetingBookingDeleteCartErrorApiResponse,
    EventMeetingBookingDeleteCartApiResponse
}