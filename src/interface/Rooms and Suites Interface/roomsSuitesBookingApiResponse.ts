interface IRoomsSuitesBookingSuccessApiResponse {
    status: number;
    message: string;
}

interface IRoomsSuitesBookingErrorApiResponse {
    status: number;
    errorMessage: string;
}

type RoomsSuitesBookingApiResponse = 
    | IRoomsSuitesBookingSuccessApiResponse
    | IRoomsSuitesBookingErrorApiResponse;

export type { 
    IRoomsSuitesBookingSuccessApiResponse, 
    IRoomsSuitesBookingErrorApiResponse, 
    RoomsSuitesBookingApiResponse 
}