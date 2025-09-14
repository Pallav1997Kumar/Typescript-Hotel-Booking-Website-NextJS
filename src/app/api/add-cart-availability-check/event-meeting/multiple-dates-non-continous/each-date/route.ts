import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";
import unlockExpiredEventMeetingLocks from "@/functions/utils/unlockExpiredEventMeetingLocks";

import HotelEventMeetingRoomBookingInfo from "@/database models/booking models/events meetings models/hotelEventMeetingRoomBookingInfo";


import { getNextMidnightUTC } from "@/functions/date";
import { EVENT_MEETING_AVAILABLE } from "@/constant string files/apiSuccessMessageConstants";

import { 
    BOOKING_UNAVAILABLE_LOCKED, 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";


import { NonContinuousMultipleDatesBookingDetailsWithDateNumberInterface } from "@/interface/Event Meeting Interface/eventMeetingBookingInterface";
import { IHotelEventMeetingRoomBookingInfo } from "@/interface/Event Meeting Interface/hotelEventMeetingBookingInterface";

import { 
    MeetingEventBookingTime, 
    MeetingEventsRoomTitle 
} from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


Connection();


async function POST(request: NextRequest){
    try {
        const body: NonContinuousMultipleDatesBookingDetailsWithDateNumberInterface = await request.json();
        const bookingDetails: NonContinuousMultipleDatesBookingDetailsWithDateNumberInterface = body;

        const meetingEventsInfoTitle: MeetingEventsRoomTitle = bookingDetails.meetingEventsInfoTitle;
        const meetingEventBookingDate: string | Date = bookingDetails.meetingEventBookingDate;
        const meetingEventBookingTime: MeetingEventBookingTime[] = bookingDetails.meetingEventBookingTime;
        
        const utcMeetingEventBookingDate: string = getNextMidnightUTC(meetingEventBookingDate);

        await unlockExpiredEventMeetingLocks();

        for(const eachMeetingEventBookingTime of meetingEventBookingTime){

            const hotelEventMeetingBookingInformation: IHotelEventMeetingRoomBookingInfo[] = 
                await HotelEventMeetingRoomBookingInfo.find({
                    meetingEventBookingDate: utcMeetingEventBookingDate,
                    meetingEventsInfoTitle,
                    meetingEventBookingTime: eachMeetingEventBookingTime
                });

            if(hotelEventMeetingBookingInformation.length > 0){

                const isBookingLocked: boolean = hotelEventMeetingBookingInformation[0].isBookingLocked;
                const availableNumbersOfRoom: number = hotelEventMeetingBookingInformation[0].availableNumbersOfRoom;

                if(isBookingLocked){
                    const errorMessage: string = 
                        `${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_LOCKED} for ${eachMeetingEventBookingTime}. ${BOOKING_UNAVAILABLE_LOCKED.PLEASE_TRY_AGAIN_LATER}`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }
                else{
                    if(availableNumbersOfRoom === 0){
                        const errorMessage: string = 
                            `${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} for ${eachMeetingEventBookingTime}.`;
                        
                        return NextResponse.json(
                            { errorMessage: errorMessage },
                            { status: 400 }
                        );
                    }
                }

            }

        }

        return NextResponse.json(
            { message: EVENT_MEETING_AVAILABLE },
            { status: 200 }
        );

    } 
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { POST };