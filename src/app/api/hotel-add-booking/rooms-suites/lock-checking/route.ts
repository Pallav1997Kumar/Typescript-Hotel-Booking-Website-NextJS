import { NextRequest, NextResponse } from "next/server";
import { UpdateWriteOpResult } from "mongoose";

import Connection from "@/database config/config";
import unlockExpiredRoomSuiteLocks from "@/functions/utils/unlockExpiredRoomSuiteLocks";

import HotelRoomSuiteBookingInfo from "@/database models/booking models/room suites models/hotelRoomSuiteBookingInfo";


import { getDatesInRange, getDateText } from "@/functions/date";
import { ROOM_SUITE_BOOKING_LOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";

import { 
    INTERNAL_SERVER_ERROR, 
    BOOKING_UNAVAILABLE_LOCKED 
} from "@/constant string files/apiErrorMessageConstants";


import { IViewRoomsSuitesCartByCartIdSuccessApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";
import { IHotelRoomSuiteBookingInfo } from "@/interface/Rooms and Suites Interface/hotelRoomsSuitesBookingInterface";
import { RoomsSuitesTitle } from "@/interface/Rooms and Suites Interface/roomsSuitesConstantInterface";

import { 
    DateDetail, 
    RoomSuitesEachDayInfoRespone, 
    RoomWithDateDetails 
} from "@/interface/Rooms and Suites Interface/eachDayRoomSuitesInfoInterface";


Connection();


interface IHotelDiningTableBookingInfoInput {
    bookingRoomTitle: IHotelRoomSuiteBookingInfo['bookingRoomTitle'];
    hotelBookingDate: Date;
    totalGuestCount: number;
    totalRoomsCount: number;
    bookedRoomsCount: number;
    availableRoomsCount: number;
    isBookingLocked: boolean;
    lockedAt?: Date | null;
}


async function POST(request: NextRequest) {
    try {
        const body: IViewRoomsSuitesCartByCartIdSuccessApiResponse = await request.json();
        const eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse = body;

        const bookingRoomTitle: RoomsSuitesTitle  = eachRoomSuiteBookingInfo.cartInfo.bookingRoomTitle;
        const bookingCheckinDate: Date = new Date(eachRoomSuiteBookingInfo.cartInfo.bookingCheckinDate);
        const bookingCheckoutDate: Date = new Date(eachRoomSuiteBookingInfo.cartInfo.bookingCheckoutDate);
        const totalGuest: number = eachRoomSuiteBookingInfo.cartInfo.totalGuest;
        const totalRooms: number = eachRoomSuiteBookingInfo.cartInfo.totalRooms;
        
        const checkinDateString: string = getDateText(bookingCheckinDate);
        const checkoutDateString: string = getDateText(bookingCheckoutDate);

        const roomsWithDateInformation: RoomWithDateDetails | undefined = 
            await fetchRoomsSuitesEachDayData(bookingRoomTitle);

        if(!roomsWithDateInformation){
            throw new Error("roomsWithDateInformation is missing");
        }
        const dateDetailsOfRoom: DateDetail[] = roomsWithDateInformation.dateDetails;

        const datesList: Date[] = getDatesInRange(bookingCheckinDate, bookingCheckoutDate);

        await unlockExpiredRoomSuiteLocks();

        const lockedDates: Date[] = [];

        for (const eachDate of datesList) {
            const hotelRoomSuiteBookingInformation: IHotelRoomSuiteBookingInfo[] = 
                await HotelRoomSuiteBookingInfo.find({
                    bookingRoomTitle,
                    hotelBookingDate: eachDate
                });

            if (hotelRoomSuiteBookingInformation.length > 0) {
                const availableRoomsCount: number = hotelRoomSuiteBookingInformation[0].availableRoomsCount;

                if (availableRoomsCount >= totalRooms) {
                    const unlockRoomSuiteResult: UpdateWriteOpResult = await HotelRoomSuiteBookingInfo.updateOne(
                        {
                            bookingRoomTitle,
                            hotelBookingDate: eachDate,
                            isBookingLocked: false
                        },
                        {
                            $set: { isBookingLocked: true, lockedAt: new Date() }
                        }
                    );

                    if (unlockRoomSuiteResult.modifiedCount === 0) {
                        await rollbackLockedDates(bookingRoomTitle, lockedDates);

                        const errorMessage: string = 
                        `${bookingRoomTitle} ${BOOKING_UNAVAILABLE_LOCKED.ROOM_SUITE_LOCKED} from ${checkinDateString} to ${checkoutDateString}. ${BOOKING_UNAVAILABLE_LOCKED.PLEASE_TRY_AGAIN_LATER}`;
                        
                        return NextResponse.json(
                            { errorMessage: errorMessage }, 
                            { status: 400 }
                        );
                    }
                    else {
                        lockedDates.push(eachDate);
                    }
                } 
                else {
                    await rollbackLockedDates(bookingRoomTitle, lockedDates);

                    const errorMessage: string = 
                    `${bookingRoomTitle} ${BOOKING_UNAVAILABLE_LOCKED.ROOM_SUITE_UNAVAILABLE} from ${checkinDateString} to ${checkoutDateString}.`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }

            } 
            else {
                const particularDateDetails: DateDetail | undefined = 
                    dateDetailsOfRoom.find(function(eachDateDetails: DateDetail) {
                        return eachDate.getTime() === new Date(eachDateDetails.date).getTime();
                    });

                const particularRoomTotalCount: number = particularDateDetails?.totalRoom || 0;

                if (particularRoomTotalCount >= totalRooms) {
                    const bookingPayload: IHotelDiningTableBookingInfoInput = {
                        bookingRoomTitle,
                        hotelBookingDate: eachDate,
                        totalGuestCount: 0,
                        totalRoomsCount: particularRoomTotalCount,
                        bookedRoomsCount: 0,
                        availableRoomsCount: particularRoomTotalCount,
                        isBookingLocked: true,
                        lockedAt: new Date(),
                    };

                    await HotelRoomSuiteBookingInfo.create(bookingPayload);
                    lockedDates.push(eachDate);

                } 
                else {
                    await rollbackLockedDates(bookingRoomTitle, lockedDates);
                    
                    const errorMessage: string = 
                        `${bookingRoomTitle} ${BOOKING_UNAVAILABLE_LOCKED.ROOM_SUITE_UNAVAILABLE} from ${checkinDateString} to ${checkoutDateString}.`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }
            }
        }

        return NextResponse.json(
            { message: ROOM_SUITE_BOOKING_LOCKED_SUCCESSFULLY },
            { status: 200 }
        );
    } 
    catch (error) {
        console.log('src/app/api/hotel-add-booking/rooms-suites/lock-checking/route' + error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}


async function rollbackLockedDates(bookingRoomTitle: string, lockedDates: Date[]) {
    for (const date of lockedDates) {
        await HotelRoomSuiteBookingInfo.updateOne(
            { bookingRoomTitle, hotelBookingDate: date },
            {
                $set: {
                    isBookingLocked: false,
                    lockedAt: null,
                }
            }
        );
    }
}


async function fetchRoomsSuitesEachDayData(title: string): Promise<RoomWithDateDetails | undefined> {
    try {
        const response: Response = await fetch(
            `${process.env.URL}/api/hotel-booking-information/room-and-suites-information/each-day-information/`
        );

        const data: RoomSuitesEachDayInfoRespone = await response.json();
        const allRoomsWithDate: RoomWithDateDetails[] = data.roomsWithDate;

        const particularRoomEachDayInfo: RoomWithDateDetails | undefined = 
            allRoomsWithDate.find(function (eachRoomWithDate: RoomWithDateDetails) {
                return eachRoomWithDate.roomTitle == title;
            });

        if(!particularRoomEachDayInfo){
            throw new Error("particularRoomEachDayInfo is missing")
        }
        
        return particularRoomEachDayInfo;
    } catch (error) {
        console.log(error);
    }
}

export { POST };