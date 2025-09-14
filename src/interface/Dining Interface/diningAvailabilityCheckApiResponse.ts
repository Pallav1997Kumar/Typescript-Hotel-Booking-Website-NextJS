interface IDiningAvailabilityCheckSuccessApiResponse {
    message: string;
}

interface IDiningAvailabilityCheckErrorApiResponse {
    errorMessage: string;
    availableTableCountTwoPerson?: number;
    availableTableCountFourPerson?: number;
    availableTableCountSixPerson?: number;
}

type DiningAvailabilityCheckApiResponse = 
    | IDiningAvailabilityCheckSuccessApiResponse 
    | IDiningAvailabilityCheckErrorApiResponse;


export type { 
    DiningAvailabilityCheckApiResponse, 
    IDiningAvailabilityCheckErrorApiResponse,
    IDiningAvailabilityCheckSuccessApiResponse
};