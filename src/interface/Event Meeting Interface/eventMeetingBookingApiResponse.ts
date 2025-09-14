interface IEventMeetingBookingSuccessApiResponse {
    status: number;
    message: string;
}

interface IEventMeetingBookingErrorApiResponse {
    status: number;
    errorMessage: string;
}

type EventMeetingBookingApiResponse = 
    | IEventMeetingBookingSuccessApiResponse
    | IEventMeetingBookingErrorApiResponse;


export type { 
    IEventMeetingBookingSuccessApiResponse, 
    IEventMeetingBookingErrorApiResponse, 
    EventMeetingBookingApiResponse 
}