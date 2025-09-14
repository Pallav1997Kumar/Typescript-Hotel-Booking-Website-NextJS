import { 
    MeetingEventBookingTime, 
    MeetingEventsRoomTitle 
} from "./eventMeetingRoomConstantInterface";

interface IHotelEventMeetingRoomBookingInfo extends Document {
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventBookingDate: Date;
    meetingEventBookingTime: MeetingEventBookingTime;
    totalGuestCount: number;
    totalNumbersOfRoom: number;
    availableNumbersOfRoom: number;
    bookedNumbersOfRoom: number;
    isBookingLocked: boolean;
    lockedAt?: Date | null;
}


interface IHotelEventMeetingRoomBookingInfoInput {
    meetingEventsInfoTitle: IHotelEventMeetingRoomBookingInfo['meetingEventsInfoTitle'];
    meetingEventBookingDate: Date;
    meetingEventBookingTime: IHotelEventMeetingRoomBookingInfo['meetingEventBookingTime'];
    totalGuestCount: number;
    totalNumbersOfRoom: number;
    availableNumbersOfRoom: number;
    bookedNumbersOfRoom: number;
    isBookingLocked: boolean;
    lockedAt?: Date | null;
}


export type { IHotelEventMeetingRoomBookingInfo, IHotelEventMeetingRoomBookingInfoInput };