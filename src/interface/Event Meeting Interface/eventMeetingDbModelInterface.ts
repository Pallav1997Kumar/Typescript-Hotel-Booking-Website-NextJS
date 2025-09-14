import  { Document, Types } from "mongoose";

import { 
    MeetingEventsRoomTitle, 
    MeetingEventBookingTime,
    MeetingEventSeatingArrangement
} from "./eventMeetingRoomConstantInterface";


interface ISingleDateCartInfo extends Document {
    customerId: Types.ObjectId;
    eventCartId: number;
    roomBookingDateType: 'Single Date';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventBookingDate: Date;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: "Yes" | "No";
    selectedMealsOnBookingDate: Map<string, string[]>;
    totalPriceEventMeetingRoom: number;
}

interface ISingleDateBookingInfo extends Document {
    customerId: Types.ObjectId;
    transactionId: Types.ObjectId;
    roomBookingDateType: 'Single Date';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventBookingDate: Date;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: "Yes" | "No";
    selectedMealsOnBookingDate: Map<string, string[]>;
    totalPriceEventMeetingRoom: number;
}

export type { ISingleDateCartInfo, ISingleDateBookingInfo };


interface IContinousMultipleDatesBookingInfo extends Document{
    customerId: Types.ObjectId;
    transactionId: Types.ObjectId;
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
}

interface IContinousMultipleDatesCartInfo extends Document{
    customerId: Types.ObjectId;
    eventCartId: number;
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
}

export type { IContinousMultipleDatesBookingInfo, IContinousMultipleDatesCartInfo };


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
}

interface INonContinousMultipleDatesBookingInfo extends Document {
    customerId: Types.ObjectId;
    transactionId: Types.ObjectId;
    roomBookingDateType: 'Multiple Dates Non Continuous';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    totalPriceOfAllDates: number;
    allDatesBookingInformation: IDateBooking[];
}

interface INonContinousMultipleDatesCartInfo extends Document {
    customerId: Types.ObjectId;
    eventCartId: number;
    roomBookingDateType: 'Multiple Dates Non Continuous';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    totalPriceOfAllDates: number;
    allDatesBookingInformation: IDateBooking[];
}

export type { 
    IDateBooking, 
    INonContinousMultipleDatesBookingInfo, 
    INonContinousMultipleDatesCartInfo 
};