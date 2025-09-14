type MeetingEventsRoomTitle =
    |'Crystal Hall'
    | 'Portico'
    | 'Oriental'
    | 'Terrace Garden'
    | 'Banquet Lawns'
    | 'Mandarin';

type MeetingEventBookingTime = 
    | "Morning" 
    | "Afternoon" 
    | "Evening" 
    | "Night" 
    | "Mid Night";

type MeetingEventSeatingArrangement =
    | "Theatre" 
    | "Circular" 
    | "U Shaped" 
    | "Boardroom" 
    | "Classroom" 
    | "Reception";

export type {
    MeetingEventsRoomTitle,
    MeetingEventBookingTime,
    MeetingEventSeatingArrangement
};