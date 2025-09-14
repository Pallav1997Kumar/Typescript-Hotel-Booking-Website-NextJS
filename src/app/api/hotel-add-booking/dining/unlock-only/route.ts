import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import HotelDiningTableBookingInfo from "@/database models/booking models/dining models/hotelDiningTableBookingInfo";

import { DINING_BOOKING_UNLOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";
import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants";


import { IViewDiningCartByCartIdSuccessApiResponse } from "@/interface/Dining Interface/diningCartApiResponse";
import { 
    DiningRestaurantTitle, 
    MealType 
} from "@/interface/Dining Interface/hotelDiningConstantInterface";


Connection();


async function POST(request: NextRequest) {
    try {
        const body: IViewDiningCartByCartIdSuccessApiResponse = await request.json();
        const eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse = body;

        const tableBookingDate: Date = eachDiningBookingInfo.cartInfo.tableBookingDate;
        const diningRestaurantTitle: DiningRestaurantTitle = eachDiningBookingInfo.cartInfo.diningRestaurantTitle;
        const mealType: MealType = eachDiningBookingInfo.cartInfo.mealType;
        const tableBookingTime: string = eachDiningBookingInfo.cartInfo.tableBookingTime;

        await HotelDiningTableBookingInfo.updateOne(
            {
                tableBookingDate,
                diningRestaurantTitle,
                mealType,
                tableBookingTime,
            },
            {
                $set: {
                isBookingLocked: false,
                lockedAt: null,
                },
            }
        );

        return NextResponse.json(
            { message: DINING_BOOKING_UNLOCKED_SUCCESSFULLY },
            { status: 200 }
        );

    } catch (error) {
        console.log("src/app/api/hotel-add-booking/dining/unlock-only/route",error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}

export { POST };
