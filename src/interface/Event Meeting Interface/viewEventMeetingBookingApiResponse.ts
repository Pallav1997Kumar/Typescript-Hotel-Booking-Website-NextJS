import { 
    IHotelCustomersDetailsFrontend, 
    ITransactionDetailsFrontend 
} from "@/interface/hotelCustomersInterface";

import { 
    MeetingEventBookingTime, 
    MeetingEventSeatingArrangement, 
    MeetingEventsRoomTitle 
} from "./eventMeetingRoomConstantInterface";


//Interfaces for Customer Starts

//Single Date Starts
interface ISingleDateBookingInfoForCustomer {
    _id: string;
    customerId: string;
    transactionId: string;
    roomBookingDateType: 'Single Date';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventBookingDate: Date;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: "Yes" | "No";
    selectedMealsOnBookingDate: Map<string, string[]>;
    totalPriceEventMeetingRoom: number;
    __v: number;
    transactionDetails: ITransactionDetailsFrontend;
}

export type { ISingleDateBookingInfoForCustomer };
//Single Date Ends


//Multiple Continous Dates Starts
interface IContinousMultipleDatesBookingInfoForCustomer {
    _id: string;
    customerId: string;
    transactionId: string;
    roomBookingDateType: 'Multiple Dates Continuous';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventStartBookingDate: Date;
    meetingEventEndBookingDate: Date;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: "Yes" | "No";
    selectedMealsOnBookingDate: Map<string, string[]>;
    totalPriceEventMeetingRoom: number;
    __v: number;
    transactionDetails: ITransactionDetailsFrontend;   
}

export type { IContinousMultipleDatesBookingInfoForCustomer };
//Multiple Continous Dates Ends


//Multiple Non Continous Dates Starts
interface IDateBooking {
    dateNumber: number;
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventBookingDate: Date;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: "Yes" | "No";
    selectedMealsOnBookingDate: Map<string, string[]>;
    totalPriceEventMeetingRoom: number;
    _id: string;
}

export type { IDateBooking };


interface INonContinousMultipleDatesBookingInfoForCustomer {
    _id: string;
    customerId: string;
    transactionId: string;
    roomBookingDateType: 'Multiple Dates Non Continuous';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    totalPriceOfAllDates: number;
    allDatesBookingInformation: IDateBooking[];
    __v: number;
    transactionDetails: ITransactionDetailsFrontend;
}

export type { INonContinousMultipleDatesBookingInfoForCustomer };
//Multiple Non Continous Dates Ends


interface EventMeetingBookingInfoForCustomer {
    _id: string;
    bookingInfo: 
        ISingleDateBookingInfoForCustomer |
        IContinousMultipleDatesBookingInfoForCustomer |
        INonContinousMultipleDatesBookingInfoForCustomer;
}

export type { EventMeetingBookingInfoForCustomer };


interface IViewEventMeetingBookingSuccessResponseForCustomer {
    message: string;
    eventMeetingBookingInfo?: EventMeetingBookingInfoForCustomer[];
}

interface IViewEventMeetingBookingErrorResponseForCustomer {
    errorMessage: string;
}

type ViewEventMeetingBookingResponseForCustomer = 
    | IViewEventMeetingBookingSuccessResponseForCustomer
    | IViewEventMeetingBookingErrorResponseForCustomer;

export type { ViewEventMeetingBookingResponseForCustomer }; 

//Interfaces for Customer Ends




//Interface for Admin Starts

//Single Date Starts
interface ISingleDateBookingInfoForAdmin {
    _id: string;
    customerId: string;
    transactionId: string;
    roomBookingDateType: 'Single Date';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventBookingDate: Date;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: "Yes" | "No";
    selectedMealsOnBookingDate: Map<string, string[]>;
    totalPriceEventMeetingRoom: number;
    __v: number;
    transactionDetails: ITransactionDetailsFrontend;
    customerDetails: IHotelCustomersDetailsFrontend;
}

export type { ISingleDateBookingInfoForAdmin }; 
//Single Date Ends


//Multiple Continous Dates Starts
interface IContinousMultipleDatesBookingInfoForAdmin {
    _id: string;
    customerId: string;
    transactionId: string;
    roomBookingDateType: 'Multiple Dates Continuous';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventStartBookingDate: Date;
    meetingEventEndBookingDate: Date;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: "Yes" | "No";
    selectedMealsOnBookingDate: Map<string, string[]>;
    totalPriceEventMeetingRoom: number;
    __v: number;
    transactionDetails: ITransactionDetailsFrontend; 
    customerDetails: IHotelCustomersDetailsFrontend;  
}

export type { IContinousMultipleDatesBookingInfoForAdmin };
//Multiple Continous Dates Ends


//Multiple Non Continous Dates Starts
interface INonContinousMultipleDatesBookingInfoForAdmin {
    _id: string;
    customerId: string;
    transactionId: string;
    roomBookingDateType: 'Multiple Dates Non Continuous';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    totalPriceOfAllDates: number;
    allDatesBookingInformation: IDateBooking[];
    __v: number;
    transactionDetails: ITransactionDetailsFrontend;
    customerDetails: IHotelCustomersDetailsFrontend;
}

export type { INonContinousMultipleDatesBookingInfoForAdmin };
//Multiple Non Continous Dates Ends


interface EventMeetingBookingInfoForAdmin {
    _id: string;
    bookingInfo: 
        ISingleDateBookingInfoForAdmin |
        IContinousMultipleDatesBookingInfoForAdmin |
        INonContinousMultipleDatesBookingInfoForAdmin;
}

export type { EventMeetingBookingInfoForAdmin };


interface IViewEventMeetingBookingSuccessResponseForAdmin {
    message: string;
    eventMeetingBookingInfo?: EventMeetingBookingInfoForAdmin[];
}

interface IViewEventMeetingBookingErrorResponseForAdmin {
    errorMessage: string;
}

type ViewEventMeetingBookingResponseForAdmin = 
    | IViewEventMeetingBookingSuccessResponseForAdmin
    | IViewEventMeetingBookingErrorResponseForAdmin;

export type { ViewEventMeetingBookingResponseForAdmin }; 

//Interface for Admin Ends