import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import DiningCartInfo from "@/database models/booking models/dining models/diningCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_CART_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";

import { 
    DiningRestaurantTitle, 
    MealType 
} from "@/interface/Dining Interface/hotelDiningConstantInterface";

import { 
    ITableBookingCountDetails, 
    IDiningCartInfo 
} from "@/interface/Dining Interface/diningDatabaseModelsInterface";


Connection();


interface IDiningCartRequestBody {
    diningCartId: number;
    diningRestaurantTitle: DiningRestaurantTitle;
    tableBookingDate: Date;
    noOfGuests: number;
    mealType: MealType;
    tableBookingTime: string;
    tableBookingCountDetails: ITableBookingCountDetails;
    priceForBooking: number;
}


async function POST(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try {
        const params = context.params;
        const loginUserId: string = params.userId;
        const customerId: string = loginUserId;
        const body: IDiningCartRequestBody = await request.json();
        
        const diningCartId: number = body.diningCartId;
        const diningRestaurantTitle: DiningRestaurantTitle = body.diningRestaurantTitle;
        const tableBookingDate: Date = body.tableBookingDate;
        const noOfGuests: number = body.noOfGuests;
        const mealType: MealType = body.mealType;
        const tableBookingTime: string = body.tableBookingTime;
        const tableBookingCountDetails: ITableBookingCountDetails = body.tableBookingCountDetails;
        const priceForBooking: number = body.priceForBooking;

        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const newDiningCartInfo: IDiningCartInfo = new DiningCartInfo({
                customerId: new Types.ObjectId(customerId),
                diningCartId,
                diningRestaurantTitle,
                tableBookingDate,
                noOfGuests,
                mealType,
                tableBookingTime,
                tableBookingCountDetails,
                priceForBooking
            });

            await newDiningCartInfo.save();
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
    } catch (error) {
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST };