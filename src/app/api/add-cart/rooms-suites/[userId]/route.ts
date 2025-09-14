import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import RoomsSuitesCartInfo from "@/database models/booking models/room suites models/roomsSuitesCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_CART_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";
import { RoomsSuitesTitle } from "@/interface/Rooms and Suites Interface/roomsSuitesConstantInterface";

import { 
    IGuestRoomDetails, 
    IRoomsSuitesCartInfo 
} from "@/interface/Rooms and Suites Interface/roomsSuitesDbModelsInterface";


Connection();


interface IRoomSuiteCartRequestBody {
    roomCartId: number;
    roomTitle: RoomsSuitesTitle;
    checkinDate: Date;
    checkoutDate: Date;
    totalRooms: number;
    totalGuest: number;
    guestRoomsDetails: IGuestRoomDetails[];
    totalPriceOfAllRooms: number;
}

async function POST(request: NextRequest, context: IContextUserId){
    try{
        const params = context.params;
        const loginUserId: string = params.userId;
        const customerId: string = loginUserId;
        const body: IRoomSuiteCartRequestBody = await request.json();

        const customerCartID: number = body.roomCartId;
        const bookingRoomTitle: RoomsSuitesTitle = body. roomTitle;
        const bookingCheckinDate: Date = body.checkinDate;
        const bookingCheckoutDate: Date = body.checkoutDate;
        const totalRooms: number = body.totalRooms;
        const totalGuest: number = body.totalGuest;
        const guestRoomsDetails: IGuestRoomDetails[] = body.guestRoomsDetails;
        const totalPriceOfAllRooms: number = body.totalPriceOfAllRooms;

        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const newRoomSuitesCartInfo : IRoomsSuitesCartInfo = new RoomsSuitesCartInfo({
                customerId: new Types.ObjectId(customerId),
                customerCartID,
                bookingRoomTitle,
                bookingCheckinDate,
                bookingCheckoutDate,
                totalRooms,
                totalGuest,
                guestRoomsDetails,
                totalPriceOfAllRooms
            });

            await newRoomSuitesCartInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_CART_SUCCESSFUL },
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
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST }