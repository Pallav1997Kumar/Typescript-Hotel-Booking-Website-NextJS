import { 
    MeetingEventBookingTime, 
    MeetingEventsRoomTitle 
} from "./eventMeetingRoomConstantInterface";

import { 
    EventMeetingPriceForSeatingArrangement, 
    FoodServicePricePerGuest 
} from "./eventMeetingRoomInterface";


interface EventTimingDetailsForFoodPrice {
    meetingEventCurrentTiming: MeetingEventBookingTime;
    meetingEventCurrentTimingFoodPrice: FoodServicePricePerGuest[]; 
}

interface DateDetailsForFoodPrice {
    date: string; 
    eventTimingDetails: EventTimingDetailsForFoodPrice[];
}

export type { 
    EventTimingDetailsForFoodPrice, 
    DateDetailsForFoodPrice 
};


interface MeetingEventDetails {
    meetingEventTitle: MeetingEventsRoomTitle;
    dateDetails: DateDetailsBasicPrice[];
}

interface EventTimingDetailsBasicPrice {
    currentMeetingEventTiming: MeetingEventBookingTime;
    currentMeetingEventTimingBasicPrice: number;
    totalNoOfRooms: number;
}

interface DateDetailsBasicPrice {
    date: string; 
    eventTimingDetails: EventTimingDetailsBasicPrice[];
}

export type { 
    MeetingEventDetails, 
    EventTimingDetailsBasicPrice, 
    DateDetailsBasicPrice 
};


interface EventMeetingEachDayResponse {
    meetingEventDetailsWithDate: MeetingEventDetails[];
}

interface EventMeetingEachDayFoodPriceResponse {
    meetingEventFoodPriceWithDate: DateDetailsForFoodPrice[];
}

interface EventMeetingEachDaySeatingArrangementResponse {
    eventMeetingPriceForSeatingArrangement: EventMeetingPriceForSeatingArrangement[];
}


export type { 
    EventMeetingEachDayResponse, 
    EventMeetingEachDayFoodPriceResponse, 
    EventMeetingEachDaySeatingArrangementResponse 
};