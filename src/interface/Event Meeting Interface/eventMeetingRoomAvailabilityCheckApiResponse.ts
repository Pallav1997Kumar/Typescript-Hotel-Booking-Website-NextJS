interface IHotelEventMeetingRoomAvailabilityCheckSuccessApiResponse {
    message: string
}

interface IHotelEventMeetingRoomAvailabilityCheckErrorApiResponse {
    errorMessage: string
}

type HotelEventMeetingRoomAvailabilityCheckApiResponse = 
    | IHotelEventMeetingRoomAvailabilityCheckSuccessApiResponse
    | IHotelEventMeetingRoomAvailabilityCheckErrorApiResponse;


export type {
    HotelEventMeetingRoomAvailabilityCheckApiResponse,
    IHotelEventMeetingRoomAvailabilityCheckErrorApiResponse,
    IHotelEventMeetingRoomAvailabilityCheckSuccessApiResponse
};