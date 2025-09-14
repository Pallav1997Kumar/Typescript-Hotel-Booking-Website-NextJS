import { 
    MeetingEventBookingTime,
    MeetingEventSeatingArrangement, 
    MeetingEventsRoomTitle 
} from "./eventMeetingRoomConstantInterface";


//Interface For Meeting Event Room
interface MeetingEventAreaInfo {
    meetingEventAreaInfoTitle: MeetingEventsRoomTitle;
    meetingEventAreaInfoDetails: string;
}
  
interface MeetingEventAreaSeatingCapacity {
    meetingEventAreaSeatingTitle: MeetingEventSeatingArrangement;
    meetingEventAreaSeatingCapacity: number | string;
}
  
interface MeetingEventArea {
    meetingEventAreaTitle: MeetingEventsRoomTitle;
    meetingEventAreaPath: string;
    meetingEventAreaImage: string;
    meetingEventAreaShortDescription: string;
    meetingEventAreaDescription: string;
    meetingEventAreaInfo: MeetingEventAreaInfo[];
    meetingEventAreaSeatingCapacityInfo: MeetingEventAreaSeatingCapacity[];
    meetingEventAreaOtherConveniences: string[];
}

export type { 
    MeetingEventAreaInfo, 
    MeetingEventAreaSeatingCapacity, 
    MeetingEventArea 
};


//Interface for Food Service Price
interface FoodServicePricePerGuest {
    foodTitle: string;
    pricePerGuest: number;
}

interface MeetingEventFoodServiceTimingList{
    bookingTime: MeetingEventBookingTime;
    foodServicePricePerGuest: FoodServicePricePerGuest[];
}

interface EventMeetingFoodServicePrice{
    day: string;
    meetingEventTimingList: MeetingEventFoodServiceTimingList[];
}

export type { 
    FoodServicePricePerGuest, 
    MeetingEventFoodServiceTimingList, 
    EventMeetingFoodServicePrice 
};


//Interface For Booking Basic Price
interface MeetingEventTimingList{
    bookingTime: MeetingEventBookingTime;
    basicPrice: number;
}

interface DayList{
    day: string;
    meetingEventTimingList: MeetingEventTimingList[];
}

interface MeetingEventsRoomBookingBasicPrice{
    meetingEventAreaTitle: MeetingEventsRoomTitle;
    totalNoOfRoom: number;
    dayList: DayList[];
}

export type { 
    MeetingEventTimingList, 
    DayList, 
    MeetingEventsRoomBookingBasicPrice 
};


//Interface for Seating Arrangement Price
interface PriceForEquipments {
    priceForStage: number;
    priceForProjector: number;
    priceForElectricalAppliance: number;
    priceForEachSeat: number;
    priceForEachCircularTable?: number;
    noOfGuestInEachCircularTable?: number;
    priceForUShapeTable?: number;
    priceOfBoardroomTable?: number;
}
  
interface SeatingArrangement {
    meetingEventAreaSeatingTitle: MeetingEventSeatingArrangement;
    priceForEquipments: PriceForEquipments;
}
  
interface EventMeetingPriceForSeatingArrangement {
    meetingEventAreaTitle: MeetingEventsRoomTitle;
    seatingArrangement: SeatingArrangement[];
}

export type { 
    PriceForEquipments, 
    SeatingArrangement, 
    EventMeetingPriceForSeatingArrangement 
};


interface EventMeetingRoomsInfoResponse {
    meetingEventsRooms: MeetingEventArea[];
}

export type { EventMeetingRoomsInfoResponse };