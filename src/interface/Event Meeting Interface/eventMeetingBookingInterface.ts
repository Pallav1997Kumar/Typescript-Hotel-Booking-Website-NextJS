import { 
    MeetingEventBookingTime,
    MeetingEventSeatingArrangement,
    MeetingEventsRoomTitle 
} from "./eventMeetingRoomConstantInterface";

import { 
    MeetingEventAreaSeatingCapacity, 
    PriceForEquipments 
} from "./eventMeetingRoomInterface";


interface IPropsEventsMeetingBookingComponent{
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventsSeatingInfo: MeetingEventAreaSeatingCapacity[];
    meetingEventAreaPath: string;
}

interface IPropsEventsMeetingDateTypeBookingComponent extends IPropsEventsMeetingBookingComponent{
    roomBookingDateType: string;
}

export type { 
    IPropsEventsMeetingBookingComponent, 
    IPropsEventsMeetingDateTypeBookingComponent 
};


interface SelectedMealsType {
    midNight: string[];
    morning: string[];
    afternoon: string[];
    evening: string[];
    night: string[];
}

interface FinalPriceList extends PriceForEquipments{
    totalPriceOfAllSeats: number;
    totalPriceOfAllCircularTables?: number;
    numberOfCircularTableRequired?: number;
}

interface SeatingArrangementPriceList{
    priceNameProperty?: string;
    priceOfProperty?: number;
}

export type { 
    SelectedMealsType, 
    FinalPriceList, 
    SeatingArrangementPriceList 
};


interface SingleDateEventBookingDetailsInterface {
    roomBookingDateType: string;
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventBookingDate: Date | string;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: string;
    selectedMealsOnBookingDate?: SelectedMealsType;
}

interface SingleDateEventBookingDetailsWithPriceInterface extends SingleDateEventBookingDetailsInterface{
    eventCartId: number;
    totalPriceEventMeetingRoom: number
}

export type { 
    SingleDateEventBookingDetailsWithPriceInterface, 
    SingleDateEventBookingDetailsInterface 
};


interface MultipleContinuousDatesBookingDetailsInterface {
    roomBookingDateType: string;
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventStartBookingDate: Date | string;
    meetingEventEndBookingDate: Date | string;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: string;
    selectedMealsOnBookingDate?: SelectedMealsType;
}

interface MultipleContinuousDatesBookingDetailsWithPriceInterface extends MultipleContinuousDatesBookingDetailsInterface{
    eventCartId: number;
    totalPriceEventMeetingRoom: number
}

interface MultipleContinuousDatesBookingDetailsEachDayInfoInterface {
    meetingEventsInfoTitle?: MeetingEventsRoomTitle;
    meetingEventBookingTime?: MeetingEventBookingTime[];
    meetingEventSeatingArrangement?: MeetingEventSeatingArrangement;
    maximumGuestAttending?: number;
    wantFoodServices?: string;
    selectedMealsOnBookingDate?: SelectedMealsType;
}

interface DateWithPriceInterface {
    currentDate: string;
    fullDayTotalPrice: number;    
}

export type { 
    MultipleContinuousDatesBookingDetailsWithPriceInterface, 
    MultipleContinuousDatesBookingDetailsInterface,
    MultipleContinuousDatesBookingDetailsEachDayInfoInterface, 
    DateWithPriceInterface 
};


interface NonContinuousMultipleDatesBookingDetailsWithDateNumberInterface {
    dateNumber: number;
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventBookingDate: Date | string;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: string;
    selectedMealsOnBookingDate?: SelectedMealsType;
}

interface NonContinuousMultipleDatesBookingDetailsInterface {
    eventCartId: number;
    roomBookingDateType: string;
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    totalPriceOfAllDates: number;
    allDatesBookingInformation: NonContinuousMultipleDatesDateBookingDetailsWithPrice[];
}

interface NonContinuousMultipleDatesDateBookingDetailsWithPrice extends NonContinuousMultipleDatesBookingDetailsWithDateNumberInterface{
    totalPriceEventMeetingRoom: number;
}

export type { 
    NonContinuousMultipleDatesBookingDetailsWithDateNumberInterface, 
    NonContinuousMultipleDatesBookingDetailsInterface, 
    NonContinuousMultipleDatesDateBookingDetailsWithPrice 
};