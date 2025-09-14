import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import HotelRoomSuiteBookingInfo from "@/database models/booking models/room suites models/hotelRoomSuiteBookingInfo";

import { getDatesInRange } from "@/functions/date";
import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants";
import { ROOM_SUITE_BOOKING_UNLOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";

import { IViewRoomsSuitesCartByCartIdSuccessApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";
import { RoomsSuitesTitle } from "@/interface/Rooms and Suites Interface/roomsSuitesConstantInterface";


Connection();


async function POST(request: NextRequest) {
    try {
        const body: IViewRoomsSuitesCartByCartIdSuccessApiResponse = await request.json();
        const eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse = body;

        const bookingRoomTitle: RoomsSuitesTitle = eachRoomSuiteBookingInfo.cartInfo.bookingRoomTitle;
        const bookingCheckinDate: Date = new Date(eachRoomSuiteBookingInfo.cartInfo.bookingCheckinDate);
        const bookingCheckoutDate: Date = new Date(eachRoomSuiteBookingInfo.cartInfo.bookingCheckoutDate);
        
        const datesList: Date[] = getDatesInRange(bookingCheckinDate, bookingCheckoutDate);

        for (const eachDate of datesList) {
            await HotelRoomSuiteBookingInfo.updateOne(
                {
                    bookingRoomTitle,
                    hotelBookingDate: eachDate
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
            { message: ROOM_SUITE_BOOKING_UNLOCKED_SUCCESSFULLY },
            { status: 200 }
        );
    } 
    catch (error) {
        console.log('src/app/api/hotel-add-booking/rooms-suites/unlock-only/route' + error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST };
