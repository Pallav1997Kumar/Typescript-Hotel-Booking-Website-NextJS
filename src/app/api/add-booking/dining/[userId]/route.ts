import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import DiningBookingInfo from "@/database models/booking models/dining models/diningBookingInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_DINING_BOOKING_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";

import { 
    DiningRestaurantTitle, 
    MealType 
} from "@/interface/Dining Interface/hotelDiningConstantInterface";

import { 
    ITableBookingCountDetails, 
    IDiningBookingInfo 
} from "@/interface/Dining Interface/diningDatabaseModelsInterface";



Connection();


interface IDiningBookingInfoRequestBody {
    diningBookingInfoDetail: {
        cartInfo: {
            diningRestaurantTitle: DiningRestaurantTitle;
            tableBookingDate: string; // Can be Date in DB, but is passed as string
            noOfGuests: number;
            mealType: MealType;
            tableBookingTime: string;
            tableBookingCountDetails: ITableBookingCountDetails;
            priceForBooking: number;
        };
    };
    transactionId: string;
}


async function POST(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try {
        const params = context.params;
        const loginUserId: string = params.userId;
        const customerId: string = loginUserId;
        const body: IDiningBookingInfoRequestBody = await request.json();

        
        const diningRestaurantTitle: DiningRestaurantTitle = 
            body.diningBookingInfoDetail.cartInfo.diningRestaurantTitle;

        const tableBookingDate: string = 
            body.diningBookingInfoDetail.cartInfo.tableBookingDate;

        const noOfGuests: number  = 
            body.diningBookingInfoDetail.cartInfo.noOfGuests;

        const mealType: MealType = 
            body.diningBookingInfoDetail.cartInfo.mealType;

        const tableBookingTime: string = 
            body.diningBookingInfoDetail.cartInfo.tableBookingTime;

        const tableBookingCountDetails: ITableBookingCountDetails = 
            body.diningBookingInfoDetail.cartInfo.tableBookingCountDetails;
        
        const priceForBooking: number = 
            body.diningBookingInfoDetail.cartInfo.priceForBooking;

        const transactionId: string = 
            body.transactionId;      


        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){

            const newDiningBookingInfo: IDiningBookingInfo = 
                new DiningBookingInfo({
                    customerId: new Types.ObjectId(customerId),
                    transactionId: new Types.ObjectId(transactionId),
                    diningRestaurantTitle,
                    tableBookingDate: new Date(tableBookingDate),
                    noOfGuests,
                    mealType,
                    tableBookingTime,
                    tableBookingCountDetails,
                    priceForBooking
                });

            await newDiningBookingInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_DINING_BOOKING_SUCCESSFUL },
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    } catch (error) {

        console.log('src/app/api/add-booking/dining/[userId]/route.ts');
        console.log(error)
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );

    }
}

export { POST };