import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";
import unlockExpiredEventMeetingLocks from "@/functions/utils/unlockExpiredEventMeetingLocks";

import HotelEventMeetingRoomBookingInfo from "@/database models/booking models/events meetings models/hotelEventMeetingRoomBookingInfo";


import { EVENT_MEETING_AVAILABLE } from "@/constant string files/apiSuccessMessageConstants";

import { 
    BOOKING_UNAVAILABLE_LOCKED, 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    getDatesInRangeInclusiveBothDate, 
    getDateText, 
    getNextMidnightUTC 
} from "@/functions/date";


import { MultipleContinuousDatesBookingDetailsInterface } from "@/interface/Event Meeting Interface/eventMeetingBookingInterface";
import { IHotelEventMeetingRoomBookingInfo } from "@/interface/Event Meeting Interface/hotelEventMeetingBookingInterface";

import { 
    MeetingEventBookingTime, 
    MeetingEventsRoomTitle 
} from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


Connection();


async function POST(request: NextRequest){
    try {
        const body: MultipleContinuousDatesBookingDetailsInterface = await request.json();
        const bookingDetails: MultipleContinuousDatesBookingDetailsInterface = body;

        const meetingEventsInfoTitle: MeetingEventsRoomTitle = bookingDetails.meetingEventsInfoTitle;
        const meetingEventStartBookingDate: string | Date = bookingDetails.meetingEventStartBookingDate;
        const meetingEventEndBookingDate: string | Date = bookingDetails.meetingEventEndBookingDate;
        const meetingEventBookingTime: MeetingEventBookingTime[] = bookingDetails.meetingEventBookingTime;
        
        const utcMeetingEventBookingStartDate: string = getNextMidnightUTC(meetingEventStartBookingDate);
        const utcMeetingEventBookingEndDate: string = getNextMidnightUTC(meetingEventEndBookingDate);

        const datesList: Date[] = 
            getDatesInRangeInclusiveBothDate(new Date(utcMeetingEventBookingStartDate), new Date(utcMeetingEventBookingEndDate));

        await unlockExpiredEventMeetingLocks();

        for (const eachDate of datesList){

            for(const eachMeetingEventBookingTime of meetingEventBookingTime){

                const hotelEventMeetingBookingInformation: IHotelEventMeetingRoomBookingInfo[] = 
                    await HotelEventMeetingRoomBookingInfo.find({
                        meetingEventBookingDate: eachDate,
                        meetingEventsInfoTitle,
                        meetingEventBookingTime: eachMeetingEventBookingTime
                    });

                if(hotelEventMeetingBookingInformation.length > 0){

                    const isBookingLocked: boolean = hotelEventMeetingBookingInformation[0].isBookingLocked;
                    const availableNumbersOfRoom: number = hotelEventMeetingBookingInformation[0].availableNumbersOfRoom;

                    if(isBookingLocked){
                        const errorMessage: string = 
                            `${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_LOCKED} on ${getDateText(eachDate)} for ${eachMeetingEventBookingTime}. ${BOOKING_UNAVAILABLE_LOCKED.PLEASE_TRY_AGAIN_LATER}`;
                        
                        return NextResponse.json(
                            { errorMessage: errorMessage }, 
                            { status: 400 }
                        );
                    }
                    else{
                        if(availableNumbersOfRoom === 0){
                            const errorMessage: string = 
                                `${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} on ${getDateText(eachDate)} for ${eachMeetingEventBookingTime}.`;
                            
                            return NextResponse.json(
                                { errorMessage: errorMessage },
                                { status: 400 }
                            );
                        }
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