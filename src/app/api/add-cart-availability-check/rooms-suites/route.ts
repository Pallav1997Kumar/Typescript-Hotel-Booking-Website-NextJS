import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";
import unlockExpiredRoomSuiteLocks from "@/functions/utils/unlockExpiredDiningLocks";

import HotelRoomSuiteBookingInfo from "@/database models/booking models/room suites models/hotelRoomSuiteBookingInfo"; 


import { ROOMS_SUITES_AVAILABLE } from "@/constant string files/apiSuccessMessageConstants";

import { 
    BOOKING_UNAVAILABLE_LOCKED, 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    getDatesInRange, 
    getDateText, 
    getNextMidnightUTC 
} from "@/functions/date";


import { RoomsSuitesBookingDetailsInterface } from "@/interface/Rooms and Suites Interface/roomsSuitesBookingInterface";
import { IHotelRoomSuiteBookingInfo } from "@/interface/Rooms and Suites Interface/hotelRoomsSuitesBookingInterface";
import { RoomsSuitesTitle } from "@/interface/Rooms and Suites Interface/roomsSuitesConstantInterface";

import { 
    RoomSuitesEachDayInfoRespone, 
    RoomWithDateDetails, 
    DateDetail 
} from "@/interface/Rooms and Suites Interface/eachDayRoomSuitesInfoInterface";



Connection();


async function POST(request: NextRequest) {
    try {
        const body: RoomsSuitesBookingDetailsInterface = await request.json();
        const bookingDetails: RoomsSuitesBookingDetailsInterface = body; 

        const roomTitle: RoomsSuitesTitle = bookingDetails.roomTitle;
        const checkinDate: string | Date = bookingDetails.checkinDate;
        const checkoutDate: string | Date = bookingDetails.checkoutDate;
        const totalRooms: number = bookingDetails.totalRooms;

        const utcCheckinDate: string = getNextMidnightUTC(checkinDate);
        const utcCheckoutDate: string = getNextMidnightUTC(checkoutDate);

        const roomsWithDateInformation: RoomWithDateDetails | undefined = await fetchRoomsSuitesEachDayData(roomTitle);
        
        if(!roomsWithDateInformation){
            throw new Error("roomsWithDateInformation is missing");
        }
        
        const dateDetailsOfRoom: DateDetail[] = roomsWithDateInformation.dateDetails;
        
        await unlockExpiredRoomSuiteLocks();

        const datesList: Date[] = getDatesInRange(new Date(utcCheckinDate), new Date(utcCheckoutDate));

        for (const eachDate of datesList) {
            const hotelRoomSuiteBookingInformation: IHotelRoomSuiteBookingInfo[] = 
                await HotelRoomSuiteBookingInfo.find({
                    bookingRoomTitle: roomTitle,
                    hotelBookingDate: eachDate
                });

            const dateString: string = getDateText(eachDate);
            
            if(hotelRoomSuiteBookingInformation.length > 0){

                const isBookingLocked: boolean = hotelRoomSuiteBookingInformation[0].isBookingLocked;

                if(isBookingLocked){
                    const errorMessage: string = 
                        `${BOOKING_UNAVAILABLE_LOCKED.ROOM_SUITE_LOCKED} for ${dateString}. ${BOOKING_UNAVAILABLE_LOCKED.PLEASE_TRY_AGAIN_LATER}`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }
                else{
                    const availableRoomsCount: number = hotelRoomSuiteBookingInformation[0].availableRoomsCount;
                    if(availableRoomsCount >= totalRooms){

                    }
                    else {
                        const errorMessage: string = 
                            `${BOOKING_UNAVAILABLE_LOCKED.ROOM_SUITE_UNAVAILABLE} for ${dateString}.`;
                        
                        return NextResponse.json(
                            { errorMessage: errorMessage }, 
                            { status: 400 }
                        );
                    }
                }
            }
            else{
                const particularDateDetails: DateDetail | undefined = 
                    dateDetailsOfRoom.find(function (eachDateDetails) {
                        return eachDate.getTime() === new Date(eachDateDetails.date).getTime();
                    });

                const particularRoomTotalCount: number = particularDateDetails?.totalRoom || 0;

                if (particularRoomTotalCount >= totalRooms) {

                }
                else{
                    const errorMessage: string = 
                        `${BOOKING_UNAVAILABLE_LOCKED.ROOM_SUITE_UNAVAILABLE} for ${dateString}.`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );

                }

            }
        }

        return NextResponse.json(
            { message: ROOMS_SUITES_AVAILABLE }, 
            { status: 200 }
        );
    } 
    catch (error) {
        console.log(error);
        console.error();
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


async function fetchRoomsSuitesEachDayData(title: string): Promise<RoomWithDateDetails | undefined> {
    try {
        const response: Response = 
            await fetch(`${process.env.URL}/api/hotel-booking-information/room-and-suites-information/each-day-information/`);
        
        const data: RoomSuitesEachDayInfoRespone = await response.json();
        const allRoomsWithDate: RoomWithDateDetails[] = data.roomsWithDate;

        const particularRoomEachDayInfo: RoomWithDateDetails | undefined = 
            allRoomsWithDate.find(function (eachRoomWithDate: RoomWithDateDetails) {
                return eachRoomWithDate.roomTitle == title;
            });
        
        if(!particularRoomEachDayInfo){
            throw new Error("particularRoomEachDayInfo is missing");
        }
        
        return particularRoomEachDayInfo;
    } catch (error) {
        console.log(error);
    }
}


export { POST }; 