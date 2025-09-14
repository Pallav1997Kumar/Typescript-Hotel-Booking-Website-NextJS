import { NextRequest, NextResponse } from "next/server";
import { UpdateWriteOpResult } from "mongoose";

import Connection from "@/database config/config";

import HotelRoomSuiteBookingInfo from "@/database models/booking models/room suites models/hotelRoomSuiteBookingInfo";

import { getDatesInRange, getDateText } from "@/functions/date";
import { 
    INTERNAL_SERVER_ERROR, 
    BOOKING_UNAVAILABLE_LOCKED 
} from "@/constant string files/apiErrorMessageConstants";
import { ROOM_SUITE_BOOKING_UNLOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";

import { IViewRoomsSuitesCartByCartIdSuccessApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";
import { IHotelRoomSuiteBookingInfo } from "@/interface/Rooms and Suites Interface/hotelRoomsSuitesBookingInterface";
import { RoomsSuitesTitle } from "@/interface/Rooms and Suites Interface/roomsSuitesConstantInterface";


Connection();


async function POST(request: NextRequest) {
    try {
        const body: IViewRoomsSuitesCartByCartIdSuccessApiResponse = await request.json();
        const eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse = body;

        const bookingRoomTitle: RoomsSuitesTitle = eachRoomSuiteBookingInfo.cartInfo.bookingRoomTitle;
        const bookingCheckinDate: Date = new Date(eachRoomSuiteBookingInfo.cartInfo.bookingCheckinDate);
        const bookingCheckoutDate: Date = new Date(eachRoomSuiteBookingInfo.cartInfo.bookingCheckoutDate);
        const totalGuest: number = eachRoomSuiteBookingInfo.cartInfo.totalGuest;
        const totalRooms: number = eachRoomSuiteBookingInfo.cartInfo.totalRooms;

        const checkinDateString: string = getDateText(bookingCheckinDate);
        const checkoutDateString: string = getDateText(bookingCheckoutDate);

        const datesList: Date[] = getDatesInRange(bookingCheckinDate, bookingCheckoutDate);

        for (const eachDate of datesList) {
            const hotelRoomSuiteBookingInformation: IHotelRoomSuiteBookingInfo[] = 
                await HotelRoomSuiteBookingInfo.find({
                    bookingRoomTitle,
                    hotelBookingDate: eachDate
                });

            if (hotelRoomSuiteBookingInformation.length > 0) {
                const existingBooking: IHotelRoomSuiteBookingInfo = hotelRoomSuiteBookingInformation[0];

                const updatedTotalGuestCount: number = existingBooking.totalGuestCount + totalGuest;
                const updatedBookedRoomsCount: number = existingBooking.bookedRoomsCount + totalRooms;
                const updatedAvailableRoomsCount: number = existingBooking.availableRoomsCount - totalRooms;

                if (updatedAvailableRoomsCount >= 0) {
                    const updateRoomSuiteResult: UpdateWriteOpResult = await HotelRoomSuiteBookingInfo.updateOne(
                        {
                            bookingRoomTitle,
                            hotelBookingDate: eachDate
                        },
                        {
                            $set: {
                                totalGuestCount: updatedTotalGuestCount,
                                bookedRoomsCount: updatedBookedRoomsCount,
                                availableRoomsCount: updatedAvailableRoomsCount,
                                isBookingLocked: false,
                                lockedAt: null,
                            }
                        }
                    );

                    if (updateRoomSuiteResult.modifiedCount === 0) {
                        const errorMessage: string = 
                            `${bookingRoomTitle} ${BOOKING_UNAVAILABLE_LOCKED.ROOM_SUITE_UNAVAILABLE} from ${checkinDateString} to ${checkoutDateString}.`;
                        
                        return NextResponse.json(
                            { errorMessage: errorMessage }, 
                            { status: 400 }
                        );
                    }

                } 
                else {
                    const errorMessage: string = 
                        `${bookingRoomTitle} ${BOOKING_UNAVAILABLE_LOCKED.ROOM_SUITE_UNAVAILABLE} from ${checkinDateString} to ${checkoutDateString}.`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }

            } 
            else {
                const errorMessage: string = 
                    `${bookingRoomTitle} ${BOOKING_UNAVAILABLE_LOCKED.ROOM_SUITE_UNAVAILABLE} from ${checkinDateString} to ${checkoutDateString}.`;
                
                return NextResponse.json(
                    { errorMessage: errorMessage }, 
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { message: ROOM_SUITE_BOOKING_UNLOCKED_SUCCESSFULLY },
            { status: 200 }
        );

    } catch (error) {
        console.log('src/app/api/hotel-add-booking/rooms-suites/unlock-add-booking/route', error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}


export { POST };