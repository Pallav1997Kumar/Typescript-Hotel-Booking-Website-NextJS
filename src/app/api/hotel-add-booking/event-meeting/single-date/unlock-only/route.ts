import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import HotelEventMeetingRoomBookingInfo from "@/database models/booking models/events meetings models/hotelEventMeetingRoomBookingInfo";


import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants";
import { EVENT_MEETING_BOOKING_UNLOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";


import { IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";
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
        const meetingEventBookingTime:MeetingEventBookingTime[] = eachEventMeetingBookingInfo.cartInfo.meetingEventBookingTime;
        

        for (const eachMeetingEventBookingTime of meetingEventBookingTime) {
            await HotelEventMeetingRoomBookingInfo.updateOne(
                {
                    meetingEventsInfoTitle,
                    meetingEventBookingDate,
                    meetingEventBookingTime: eachMeetingEventBookingTime
                },
                {
                    $set: {
                        isBookingLocked: false,
                        lockedAt: null,
                    }
                }
            );
        }

        return NextResponse.json(
            { message: EVENT_MEETING_BOOKING_UNLOCKED_SUCCESSFULLY },
            { status: 200 }
        );
    } 
    catch (error) {
        console.log('src/app/api/hotel-add-booking/event-meeting/single-date/unlock-only/route' + error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST };
