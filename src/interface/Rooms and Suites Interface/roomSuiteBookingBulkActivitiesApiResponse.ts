interface IRoomsSuitesBookingLockCheckingSuccessApiResponse {
    message: string;
}

interface IRoomsSuitesBookingLockCheckingErrorApiResponse {
    errorMessage: string;
}

type RoomsSuitesBookingLockCheckingApiResponse = 
    | IRoomsSuitesBookingLockCheckingSuccessApiResponse
    | IRoomsSuitesBookingLockCheckingErrorApiResponse;


export type {
    IRoomsSuitesBookingLockCheckingSuccessApiResponse,
    IRoomsSuitesBookingLockCheckingErrorApiResponse,
    RoomsSuitesBookingLockCheckingApiResponse
}



interface IRoomsSuitesBookingTransactionCreationSuccessApiResponse {
    message: string;
    transactionId: string;
}

interface IRoomsSuitesBookingTransactionCreationErrorApiResponse {
    errorMessage: string;
}

type RoomsSuitesBookingTransactionCreationApiResponse = 
    | IRoomsSuitesBookingTransactionCreationSuccessApiResponse
    | IRoomsSuitesBookingTransactionCreationErrorApiResponse;


export type {
    IRoomsSuitesBookingTransactionCreationSuccessApiResponse,
    IRoomsSuitesBookingTransactionCreationErrorApiResponse,
    RoomsSuitesBookingTransactionCreationApiResponse
}



interface IRoomsSuitesBookingDeductMoneyFromWalletSuccessApiResponse {
    message: string;
}

interface IRoomsSuitesBookingDeductMoneyFromWalletErrorApiResponse {
    errorMessage: string;
}

type RoomsSuitesBookingDeductMoneyFromWalletApiResponse = 
    | IRoomsSuitesBookingDeductMoneyFromWalletSuccessApiResponse
    | IRoomsSuitesBookingDeductMoneyFromWalletErrorApiResponse;


export type {
    IRoomsSuitesBookingDeductMoneyFromWalletSuccessApiResponse,
    IRoomsSuitesBookingDeductMoneyFromWalletErrorApiResponse,
    RoomsSuitesBookingDeductMoneyFromWalletApiResponse
}



interface IRoomsSuitesBookingUnlockAddBookingSuccessApiResponse {
    message: string;
}

interface IRoomsSuitesBookingUnlockAddBookingErrorApiResponse {
    errorMessage: string;
}

type RoomsSuitesBookingUnlockAddBookingApiResponse = 
    | IRoomsSuitesBookingUnlockAddBookingSuccessApiResponse
    | IRoomsSuitesBookingUnlockAddBookingErrorApiResponse;


export type {
    IRoomsSuitesBookingUnlockAddBookingSuccessApiResponse,
    IRoomsSuitesBookingUnlockAddBookingErrorApiResponse,
    RoomsSuitesBookingUnlockAddBookingApiResponse
}



interface IRoomsSuitesBookingAddBookingSuccessApiResponse {
    message: string;
}

interface IRoomsSuitesBookingAddBookingErrorApiResponse {
    errorMessage: string;
}

type RoomsSuitesBookingAddBookingApiResponse = 
    | IRoomsSuitesBookingAddBookingSuccessApiResponse
    | IRoomsSuitesBookingAddBookingErrorApiResponse;


export type {
    IRoomsSuitesBookingAddBookingSuccessApiResponse,
    IRoomsSuitesBookingAddBookingErrorApiResponse,
    RoomsSuitesBookingAddBookingApiResponse
}



interface IRoomsSuitesBookingDeleteCartSuccessApiResponse {
    message: string;
}

interface IRoomsSuitesBookingDeleteCartErrorApiResponse {
    errorMessage: string;
}

type RoomsSuitesBookingDeleteCartApiResponse = 
    | IRoomsSuitesBookingDeleteCartSuccessApiResponse
    | IRoomsSuitesBookingDeleteCartErrorApiResponse;


export type {
    IRoomsSuitesBookingDeleteCartSuccessApiResponse,
    IRoomsSuitesBookingDeleteCartErrorApiResponse,
    RoomsSuitesBookingDeleteCartApiResponse
}