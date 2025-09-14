interface IDiningBookingSuccessApiResponse {
    status: number;
    message: string;
}

interface IDiningBookingErrorApiResponse {
    status: number;
    errorMessage: string;
}

type DiningBookingApiResponse = 
    | IDiningBookingSuccessApiResponse
    | IDiningBookingErrorApiResponse;

export type { IDiningBookingSuccessApiResponse, IDiningBookingErrorApiResponse, DiningBookingApiResponse }