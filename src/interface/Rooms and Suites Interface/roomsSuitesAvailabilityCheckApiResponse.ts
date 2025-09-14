interface IRoomsSuitesAvailabilityCheckSuccessApiResponse {
  message: string;
}

// Error response
interface IRoomsSuitesAvailabilityCheckErrorApiResponse {
  errorMessage: string;
}

// Combined type
type RoomsSuitesAvailabilityCheckApiResponse = 
  | IRoomsSuitesAvailabilityCheckSuccessApiResponse 
  | IRoomsSuitesAvailabilityCheckErrorApiResponse;


export type {
    IRoomsSuitesAvailabilityCheckSuccessApiResponse, 
    IRoomsSuitesAvailabilityCheckErrorApiResponse,
    RoomsSuitesAvailabilityCheckApiResponse
}