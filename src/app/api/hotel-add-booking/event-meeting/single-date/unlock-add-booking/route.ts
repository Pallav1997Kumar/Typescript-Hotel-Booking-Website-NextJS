import { NextRequest, NextResponse } from "next/server";
import { UpdateWriteOpResult } from "mongoose";

import Connection from "@/database config/config";
import unlockExpiredEventMeetingLocks from "@/functions/utils/unlockExpiredEventMeetingLocks";

import HotelEventMeetingRoomBookingInfo from "@/database models/booking models/events meetings models/hotelEventMeetingRoomBookingInfo";


import { EVENT_MEETING_BOOKING_UNLOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";
import { getDateText } from "@/functions/date";

import { 
    BOOKING_UNAVAILABLE_LOCKED, 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";


import { IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";
import { IHotelEventMeetingRoomBookingInfo } from "@/interface/Event Meeting Interface/hotelEventMeetingBookingInterface";

import { 
    MeetingEventBookingTime, 
    MeetingEventsRoomTitle 
} from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


Connection();


async function POST(request: NextRequest) {
    try {
        const body: IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse = await request.json();
        const eachEventMeetingBookingInfo: IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse = body;

        const meetingEventsInfoTitle: MeetingEventsRoomTitle = eachEventMeetingBookingInfo.cartInfo.meetingEventsInfoTitle;
        const meetingEventBookingDate: Date = eachEventMeetingBookingInfo.cartInfo.meetingEventBookingDate;
        const meetingEventBookingTime: MeetingEventBookingTime[] = eachEventMeetingBookingInfo.cartInfo.meetingEventBookingTime;
        const maximumGuestAttending: number = eachEventMeetingBookingInfo.cartInfo.maximumGuestAttending;

        const meetingEventBookingDateString: string = getDateText(new Date(meetingEventBookingDate));

        await unlockExpiredEventMeetingLocks();

        for (const eachMeetingEventBookingTime of meetingEventBookingTime){

            // Check existing booking info
            const hotelEventMeetingBookingInformation: IHotelEventMeetingRoomBookingInfo[] = 
                await HotelEventMeetingRoomBookingInfo.find({
                    meetingEventBookingDate,
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
                            meetingEventBookingDate,
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
                            `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} for ${meetingEventBookingDateString} ${eachMeetingEventBookingTime}.`;
                        
                        return NextResponse.json(
                            { errorMessage: errorMessage }, 
                            { status: 400 }
                        );
                    }

                }
                else{
                    const errorMessage: string = 
                        `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} for ${meetingEventBookingDateString} ${eachMeetingEventBookingTime}.`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }

            }
            else {
                const errorMessage: string = 
                    `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} for ${meetingEventBookingDateString} ${eachMeetingEventBookingTime}.`;
                
                return NextResponse.json(
                    { errorMessage: errorMessage }, 
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { message: EVENT_MEETING_BOOKING_UNLOCKED_SUCCESSFULLY }, 
            { status: 200 }
        );
        
        
    } 
    catch (error) {
        console.error(error);
        console.log('src/app/api/hotel-add-booking/event-meeting/single-date/unlock-add-booking/route' + error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { POST };