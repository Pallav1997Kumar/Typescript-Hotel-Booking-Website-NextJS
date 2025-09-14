import { IDiningBookingInfoForAdmin } from "./Dining Interface/viewDiningBookingApiResponse";
import { IRoomsSuitesBookingInfoForAdmin } from "./Rooms and Suites Interface/viewRoomSuiteBookingApiResponse";

import { 
    IContinousMultipleDatesBookingInfoForAdmin, 
    INonContinousMultipleDatesBookingInfoForAdmin, 
    ISingleDateBookingInfoForAdmin 
} from "./Event Meeting Interface/viewEventMeetingBookingApiResponse";



interface DiningRoomsSuitesEventMeetingBookingInfoForAdmin {
    _id: string;
    bookingInfo: 
        ISingleDateBookingInfoForAdmin |
        IContinousMultipleDatesBookingInfoForAdmin |
        INonContinousMultipleDatesBookingInfoForAdmin |
        IRoomsSuitesBookingInfoForAdmin |
        IDiningBookingInfoForAdmin;
}

export type { DiningRoomsSuitesEventMeetingBookingInfoForAdmin };


interface IViewDiningRoomsSuitesEventMeetingBookingSuccessResponseForAdmin {
    message: string;
    diningRoomsSuitesEventMeetingBookingInfo?: DiningRoomsSuitesEventMeetingBookingInfoForAdmin[]; 
}

interface IViewDiningRoomsSuitesEventMeetingBookingErrorResponseForAdmin {
    errorMessage: string;
}

type ViewDiningRoomsSuitesEventMeetingBookingResponseForAdmin = 
    | IViewDiningRoomsSuitesEventMeetingBookingSuccessResponseForAdmin
    | IViewDiningRoomsSuitesEventMeetingBookingErrorResponseForAdmin;

export type { ViewDiningRoomsSuitesEventMeetingBookingResponseForAdmin };