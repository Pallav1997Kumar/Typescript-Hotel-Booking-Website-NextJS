import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import DiningBookingInfo from "@/database models/booking models/dining models/diningBookingInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    DINING_BOOKING_INFO_IS_PRESENT, 
    DINING_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";
import { IDiningBookingInfo } from "@/interface/Dining Interface/diningDatabaseModelsInterface"; 
import { IOptions } from "@/interface/timeZoneInterface";


Connection();


interface IDiningBookingUser {
    bookingInfo: IDiningBookingInfo;
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

        const hotelUser: IHotelCustomersUser | null = await HotelCustomersUsers.findById(loginUserId);
        
        const currentDate: Date = new Date();
        const options: IOptions = { timeZone: 'Asia/Kolkata' };
        const currentIstDate: Date = new Date(currentDate.toLocaleString('en-US', options));

        if(hotelUser){
            
            const bookingDiningUser: IDiningBookingUser[] | null = await DiningBookingInfo.aggregate([
                {
                    $match: {
                        customerId: loginUserId,
                        tableBookingDate: { $gte: currentIstDate }
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
    
            
            if(bookingDiningUser){
                if(bookingDiningUser.length > 0){
                    return NextResponse.json(
                        { 
                            message: DINING_BOOKING_INFO_IS_PRESENT, 
                            diningBookingInfo: bookingDiningUser 
                        },
                        { status: 200 }
                    );
                }
                else{
                    return NextResponse.json(
                        { message: DINING_BOOKING_INFO_IS_EMPTY },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: DINING_BOOKING_INFO_IS_EMPTY },
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
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET };