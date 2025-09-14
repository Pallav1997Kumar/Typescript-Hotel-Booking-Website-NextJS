import { NextRequest, NextResponse } from "next/server";
import { UpdateWriteOpResult } from "mongoose";

import Connection from "@/database config/config";
import unlockExpiredEventMeetingLocks from "@/functions/utils/unlockExpiredEventMeetingLocks";

import HotelEventMeetingRoomBookingInfo from "@/database models/booking models/events meetings models/hotelEventMeetingRoomBookingInfo";


import { EVENT_MEETING_BOOKING_UNLOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";
import { getDatesInRangeInclusiveBothDate, getDateText } from "@/functions/date";

import { 
    BOOKING_UNAVAILABLE_LOCKED, 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";


import { IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";
import { IHotelEventMeetingRoomBookingInfo } from "@/interface/Event Meeting Interface/hotelEventMeetingBookingInterface";

import { 
    MeetingEventBookingTime,
    MeetingEventsRoomTitle
} from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


Connection();


async function POST(request: NextRequest) {
    try {
        const body: IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse = await request.json();
        const eachEventMeetingBookingInfo: IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse = body;

        const meetingEventsInfoTitle: MeetingEventsRoomTitle = eachEventMeetingBookingInfo.cartInfo.meetingEventsInfoTitle;
        const meetingEventStartBookingDate: Date = new Date(eachEventMeetingBookingInfo.cartInfo.meetingEventStartBookingDate);
        const meetingEventEndBookingDate: Date = new Date(eachEventMeetingBookingInfo.cartInfo.meetingEventEndBookingDate);
        const meetingEventBookingTime: MeetingEventBookingTime[] = eachEventMeetingBookingInfo.cartInfo.meetingEventBookingTime;
        const maximumGuestAttending: number = eachEventMeetingBookingInfo.cartInfo.maximumGuestAttending;

        const meetingEventStartBookingDateString: string = getDateText(meetingEventStartBookingDate);
        const meetingEventEndBookingDateString: string =  getDateText(meetingEventEndBookingDate);

        const datesList: Date[] = getDatesInRangeInclusiveBothDate(meetingEventStartBookingDate, meetingEventEndBookingDate);

        await unlockExpiredEventMeetingLocks();

        for (const eachDate of datesList) {

            for (const eachMeetingEventBookingTime of meetingEventBookingTime){

                // Check existing booking info
                const hotelEventMeetingBookingInformation: IHotelEventMeetingRoomBookingInfo[] = 
                    await HotelEventMeetingRoomBookingInfo.find({
                        meetingEventBookingDate: eachDate,
                        meetingEventsInfoTitle,
                        meetingEventBookingTime: eachMeetingEventBookingTime
                    });

                if(hotelEventMeetingBookingInformation.length > 0){
                    const existingBooking: IHotelEventMeetingRoomBookingInfo = hotelEventMeetingBookingInformation[0];

                    const totalGuestCount: number = existingBooking.totalGuestCount;
                    const updatedTotalGuestCount: number = totalGuestCount + maximumGuestAttending;

                    const availableNumbersOfRoom: number = existingBooking.availableNumbersOfRoom;
                    const updatedAvailableNumbersOfRoom: number = availableNumbersOfRoom - 1;

                    const bookedNumbersOfRoom: number = existingBooking.bookedNumbersOfRoom;
                    const updatedBookedNumbersOfRoom: number = bookedNumbersOfRoom + 1;

                    if(updatedAvailableNumbersOfRoom >= 0){
                        const updateEventMeetingResult: UpdateWriteOpResult = await HotelEventMeetingRoomBookingInfo.updateOne(
                            {
                                meetingEventsInfoTitle,
                                meetingEventBookingDate: eachDate,
                                meetingEventBookingTime: eachMeetingEventBookingTime
                            },
                            {
                                $set: {
                                    totalGuestCount: updatedTotalGuestCount,
                                    availableNumbersOfRoom: updatedAvailableNumbersOfRoom,
                                    bookedNumbersOfRoom: updatedBookedNumbersOfRoom,
                                    isBookingLocked: false,
                                    lockedAt: null,
                                }
                            }
                        );

                        if (updateEventMeetingResult.modifiedCount === 0) {
                            const errorMessage: string = 
                                `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} from ${meetingEventStartBookingDateString} to ${meetingEventEndBookingDateString} ${eachMeetingEventBookingTime}.`;
                            
                            return NextResponse.json(
                                { errorMessage: errorMessage }, 
                                { status: 400 }
                            );
                        }

                    }
                    else{
                        const errorMessage: string = 
                            `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} from ${meetingEventStartBookingDateString} to ${meetingEventEndBookingDateString} ${eachMeetingEventBookingTime}.`;
                        
                        return NextResponse.json(
                            { errorMessage: errorMessage }, 
                            { status: 400 }
                        );
                    }

                }
                else {
                    const errorMessage: string = 
                        `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} from ${meetingEventStartBookingDateString} to ${meetingEventEndBookingDateString} ${eachMeetingEventBookingTime}.`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }
            }

        }

        return NextResponse.json(
            { message: EVENT_MEETING_BOOKING_UNLOCKED_SUCCESSFULLY }, 
            { status: 200 }
        );
        
        
    } 
    catch (error) {
        console.error(error);
        console.log('src/app/api/hotel-add-booking/event-meeting/multiple-dates-continous/unlock-add-booking/route' + error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { POST };