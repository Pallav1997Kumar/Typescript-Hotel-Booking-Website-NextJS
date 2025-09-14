interface IDiningRoomEventBookingSuccessApiResponse {
    status: number;
    message: string;
}

interface IDiningRoomEventBookingErrorApiResponse {
    status: number;
    errorMessage: string;
}

type DiningRoomEventBookingApiResponse = 
    | IDiningRoomEventBookingSuccessApiResponse
    | IDiningRoomEventBookingErrorApiResponse;

    
export type { 
    IDiningRoomEventBookingSuccessApiResponse, 
    IDiningRoomEventBookingErrorApiResponse, 
    DiningRoomEventBookingApiResponse 
}