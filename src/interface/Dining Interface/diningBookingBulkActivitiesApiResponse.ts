interface IDiningBookingLockCheckingSuccessApiResponse {
    message: string;
}

interface IDiningBookingLockCheckingErrorApiResponse {
    errorMessage: string;
}

type DiningBookingLockCheckingApiResponse = 
    | IDiningBookingLockCheckingSuccessApiResponse
    | IDiningBookingLockCheckingErrorApiResponse;


export type {
    IDiningBookingLockCheckingSuccessApiResponse,
    IDiningBookingLockCheckingErrorApiResponse,
    DiningBookingLockCheckingApiResponse
}



interface IDiningBookingTransactionCreationSuccessApiResponse {
    message: string;
    transactionId: string;
}

interface IDiningBookingTransactionCreationErrorApiResponse {
    errorMessage: string;
}

type DiningBookingTransactionCreationApiResponse = 
    | IDiningBookingTransactionCreationSuccessApiResponse
    | IDiningBookingTransactionCreationErrorApiResponse;


export type {
    IDiningBookingTransactionCreationSuccessApiResponse,
    IDiningBookingTransactionCreationErrorApiResponse,
    DiningBookingTransactionCreationApiResponse
}



interface IDiningBookingDeductMoneyFromWalletSuccessApiResponse {
    message: string;
}

interface IDiningBookingDeductMoneyFromWalletErrorApiResponse {
    errorMessage: string;
}

type DiningBookingDeductMoneyFromWalletApiResponse = 
    | IDiningBookingDeductMoneyFromWalletSuccessApiResponse
    | IDiningBookingDeductMoneyFromWalletErrorApiResponse;


export type {
    IDiningBookingDeductMoneyFromWalletSuccessApiResponse,
    IDiningBookingDeductMoneyFromWalletErrorApiResponse,
    DiningBookingDeductMoneyFromWalletApiResponse
}



interface IDiningBookingUnlockAddBookingSuccessApiResponse {
    message: string;
}

interface IDiningBookingUnlockAddBookingErrorApiResponse {
    errorMessage: string;
}

type DiningBookingUnlockAddBookingApiResponse = 
    | IDiningBookingUnlockAddBookingSuccessApiResponse
    | IDiningBookingUnlockAddBookingErrorApiResponse;


export type {
    IDiningBookingUnlockAddBookingSuccessApiResponse,
    IDiningBookingUnlockAddBookingErrorApiResponse,
    DiningBookingUnlockAddBookingApiResponse
}



interface IDiningBookingAddBookingSuccessApiResponse {
    message: string;
}

interface IDiningBookingAddBookingErrorApiResponse {
    errorMessage: string;
}

type DiningBookingAddBookingApiResponse = 
    | IDiningBookingAddBookingSuccessApiResponse
    | IDiningBookingAddBookingErrorApiResponse;


export type {
    IDiningBookingAddBookingSuccessApiResponse,
    IDiningBookingAddBookingErrorApiResponse,
    DiningBookingAddBookingApiResponse
}



interface IDiningBookingDeleteCartSuccessApiResponse {
    message: string;
}

interface IDiningBookingDeleteCartErrorApiResponse {
    errorMessage: string;
}

type DiningBookingDeleteCartApiResponse = 
    | IDiningBookingDeleteCartSuccessApiResponse
    | IDiningBookingDeleteCartErrorApiResponse;


export type {
    IDiningBookingDeleteCartSuccessApiResponse,
    IDiningBookingDeleteCartErrorApiResponse,
    DiningBookingDeleteCartApiResponse
}