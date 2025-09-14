import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import RoomsSuitesBookingInfo from "@/database models/booking models/room suites models/roomsSuitesBookingInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, 
    ROOMS_SUITES_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";
import { IRoomsSuitesBookingInfo } from '@/interface/Rooms and Suites Interface/roomsSuitesDbModelsInterface';
import { IOptions } from "@/interface/timeZoneInterface";


Connection();


interface IRoomsSuitesBookingUser {
    bookingInfo: IRoomsSuitesBookingInfo;
    transactionDetails: {
      _id: mongoose.Types.ObjectId;
      transactionAmount: number;
      transactionType: string;
      transactionDescription: string;
      transactionDateTime: Date;
    };
}


async function GET(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try {
        const params = context.params;
        const loginUserIdString: string = params.userId;
        const loginUserId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(loginUserIdString); 

        const currentDate: Date = new Date();
        const options: IOptions = { timeZone: 'Asia/Kolkata' };
        const currentIstDate: Date = new Date(currentDate.toLocaleString('en-US', options));

        const hotelUser: IHotelCustomersUser | null = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){

            const roomSuiteUserBooking: IRoomsSuitesBookingUser[] | null = await RoomsSuitesBookingInfo.aggregate([
                {
                    $match: {
                        customerId: loginUserId,
                        bookingCheckoutDate: { $lt: currentIstDate }
                    }
                },
                {
                    $lookup: {
                        from: 'hotelcustomerstransactions', 
                        localField: 'transactionId',
                        foreignField: '_id',
                        as: 'transactionDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$transactionDetails',
                        preserveNullAndEmptyArrays: true 
                    }
                },
                {
                    $project: {
                        bookingInfo: "$$ROOT",
                    }
                }
            ]);

            if(roomSuiteUserBooking){
                
                if(roomSuiteUserBooking.length > 0){
                    return NextResponse.json(
                        { message: ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, roomSuitesBookingInfo: roomSuiteUserBooking },
                        { status: 200 }
                    );
                }

                else{
                    return NextResponse.json(
                        { message: ROOMS_SUITES_BOOKING_INFO_IS_EMPTY },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: ROOMS_SUITES_BOOKING_INFO_IS_EMPTY },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET };