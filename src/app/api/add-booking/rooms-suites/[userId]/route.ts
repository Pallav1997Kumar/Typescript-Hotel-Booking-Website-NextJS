import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import RoomsSuitesBookingInfo from "@/database models/booking models/room suites models/roomsSuitesBookingInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";
import { 
    INFORMATION_ADD_TO_ROOMS_SUITES_BOOKING_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";
import { RoomsSuitesTitle } from "@/interface/Rooms and Suites Interface/roomsSuitesConstantInterface";

import { 
    IGuestRoomDetails, 
    IRoomsSuitesBookingInfo 
} from "@/interface/Rooms and Suites Interface/roomsSuitesDbModelsInterface"; 



Connection();


interface IRoomSuiteBookingInfoRequestBody {
    roomSuiteBookingInfoDetail: {
        cartInfo: {
            bookingRoomTitle: RoomsSuitesTitle;
            bookingCheckinDate: string; // Can be Date in DB, but is passed as string
            bookingCheckoutDate: string; // Can be Date in DB, but is passed as string
            totalRooms: number;
            totalGuest: number;
            guestRoomsDetails: IGuestRoomDetails[];
            totalPriceOfAllRooms: number;
        };
    };
    transactionId: string;
}


async function POST(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        const loginUserId: string = params.userId;
        const customerId: string = loginUserId;
        const body: IRoomSuiteBookingInfoRequestBody = await request.json();

        const bookingRoomTitle: RoomsSuitesTitle = 
            body.roomSuiteBookingInfoDetail.cartInfo.bookingRoomTitle;

        const bookingCheckinDate: string = 
            body.roomSuiteBookingInfoDetail.cartInfo.bookingCheckinDate;

        const bookingCheckoutDate: string = 
            body.roomSuiteBookingInfoDetail.cartInfo.bookingCheckoutDate;

        const totalRooms: number = body.roomSuiteBookingInfoDetail.cartInfo.totalRooms;
        const totalGuest: number = body.roomSuiteBookingInfoDetail.cartInfo.totalGuest;

        const guestRoomsDetails: IGuestRoomDetails[] = 
            body.roomSuiteBookingInfoDetail.cartInfo.guestRoomsDetails;
        const totalPriceOfAllRooms: number = 
            body.roomSuiteBookingInfoDetail.cartInfo.totalPriceOfAllRooms;

        const transactionId: string = body.transactionId;  

        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const newRoomSuitesBookingInfo: IRoomsSuitesBookingInfo = new RoomsSuitesBookingInfo({
                customerId: new Types.ObjectId(customerId),
                transactionId: new Types.ObjectId(transactionId),
                bookingRoomTitle,
                bookingCheckinDate: new Date(bookingCheckinDate),
                bookingCheckoutDate: new Date(bookingCheckoutDate),
                totalRooms,
                totalGuest,
                guestRoomsDetails,
                totalPriceOfAllRooms
            });

            await newRoomSuitesBookingInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_ROOMS_SUITES_BOOKING_SUCCESSFUL },
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    }
    catch(error){

        console.log('src/app/api/add-booking/rooms-suites/[userId]/route.ts');
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );

    }
}

export { POST }