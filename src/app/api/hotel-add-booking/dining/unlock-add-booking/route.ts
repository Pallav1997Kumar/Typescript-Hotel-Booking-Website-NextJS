import { NextRequest, NextResponse } from "next/server";
import { UpdateWriteOpResult } from "mongoose";

import Connection from "@/database config/config";
import unlockExpiredDiningLocks from "@/functions/utils/unlockExpiredDiningLocks";

import HotelDiningTableBookingInfo from "@/database models/booking models/dining models/hotelDiningTableBookingInfo";


import { getDateText } from "@/functions/date";
import { DINING_BOOKING_UNLOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";

import { 
    BOOKING_UNAVAILABLE_LOCKED, 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";


import { IViewDiningCartByCartIdSuccessApiResponse } from "@/interface/Dining Interface/diningCartApiResponse";
import { ITableBookingCountDetails } from "@/interface/Dining Interface/diningDatabaseModelsInterface";
import { IHotelDiningTableBookingInfo } from "@/interface/Dining Interface/hotelDiningBookingInterface";

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
        const noOfGuests: number = eachDiningBookingInfo.cartInfo.noOfGuests;
        const tableBookingCountDetails: ITableBookingCountDetails = eachDiningBookingInfo.cartInfo.tableBookingCountDetails;
        const tableCountTwoPerson: number = tableBookingCountDetails.tableCountTwoPerson;
        const tableCountFourPerson: number = tableBookingCountDetails.tableCountFourPerson;
        const tableCountSixPerson: number = tableBookingCountDetails.tableCountSixPerson;

        const tableBookingDateString: string = getDateText(new Date(tableBookingDate));

        await unlockExpiredDiningLocks();


        const hotelDiningTableBookingInformation: IHotelDiningTableBookingInfo[] = 
            await HotelDiningTableBookingInfo.find({
                tableBookingDate,
                diningRestaurantTitle,
                mealType,
                tableBookingTime
            });

        if(hotelDiningTableBookingInformation.length > 0){
            const existingBooking: IHotelDiningTableBookingInfo = hotelDiningTableBookingInformation[0];
            
            const totalNoOfGuest: number = existingBooking.totalNoOfGuest;
            const updatedTotalNoOfGuest: number = totalNoOfGuest + noOfGuests;

            const availableTableCountTwoPerson: number = 
                existingBooking.availableTablesCount.tableCountTwoPerson;
            const availableTableCountFourPerson: number = 
                existingBooking.availableTablesCount.tableCountFourPerson;
            const availableTableCountSixPerson: number = 
                existingBooking.availableTablesCount.tableCountSixPerson;
            
            const updatedAvailableTableCountTwoPerson: number = 
                availableTableCountTwoPerson - tableCountTwoPerson;
            const updatedAvailableTableCountFourPerson: number = 
                availableTableCountFourPerson - tableCountFourPerson;
            const updatedAvailableTableCountSixPerson: number = 
                availableTableCountSixPerson - tableCountSixPerson;

            const bookedTableCountTwoPerson: number = 
                existingBooking.bookedTablesCount.tableCountTwoPerson;
            const bookedTableCountFourPerson: number = 
                existingBooking.bookedTablesCount.tableCountFourPerson;
            const bookedTableCountSixPerson: number = 
                existingBooking.bookedTablesCount.tableCountSixPerson;
            
            const updatedBookedTableCountTwoPerson: number = 
                bookedTableCountTwoPerson + tableCountTwoPerson;
            const updatedBookedTableCountFourPerson: number = 
                bookedTableCountFourPerson + tableCountFourPerson;
            const updatedBookedTableCountSixPerson = 
                bookedTableCountSixPerson + tableCountSixPerson;

            if(updatedAvailableTableCountTwoPerson >= 0 &&
                updatedAvailableTableCountFourPerson >= 0 &&
                updatedAvailableTableCountSixPerson >= 0
            ){

                const updateDiningResult: UpdateWriteOpResult = await HotelDiningTableBookingInfo.updateOne(
                    {
                        tableBookingDate,
                        diningRestaurantTitle,
                        mealType,
                        tableBookingTime,    
                    },
                    {
                        $set: { 
                            totalNoOfGuest: updatedTotalNoOfGuest,
                            isBookingLocked: false,
                            lockedAt: null,
                            availableTablesCount: {
                                tableCountTwoPerson: updatedAvailableTableCountTwoPerson,
                                tableCountFourPerson: updatedAvailableTableCountFourPerson,
                                tableCountSixPerson: updatedAvailableTableCountSixPerson,
                            },
                            bookedTablesCount: {
                                tableCountTwoPerson: updatedBookedTableCountTwoPerson,
                                tableCountFourPerson: updatedBookedTableCountFourPerson,
                                tableCountSixPerson: updatedBookedTableCountSixPerson,
                            }
                        }
                    }
                );

                if(updateDiningResult.modifiedCount > 0){
                    return NextResponse.json(
                        { message: DINING_BOOKING_UNLOCKED_SUCCESSFULLY }, 
                        { status: 200 }
                    );
                }
                else {
                    const errorMessage: string = 
                        `${diningRestaurantTitle} ${BOOKING_UNAVAILABLE_LOCKED.DINING_TABLE_UNAVAILABLE} for ${tableBookingDateString} for ${mealType}(${tableBookingTime}).`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }

            }
            else {
                const errorMessage: string = 
                    `${diningRestaurantTitle} ${BOOKING_UNAVAILABLE_LOCKED.DINING_TABLE_UNAVAILABLE} for ${tableBookingDateString} for ${mealType}(${tableBookingTime}).`;
                
                return NextResponse.json(
                    { errorMessage: errorMessage }, 
                    { status: 400 }
                );
            }
        }
        else {
            const errorMessage: string = 
                `${diningRestaurantTitle} ${BOOKING_UNAVAILABLE_LOCKED.DINING_TABLE_UNAVAILABLE} for ${tableBookingDateString} for ${mealType}(${tableBookingTime}).`;
            
            return NextResponse.json(
                { errorMessage: errorMessage }, 
                { status: 400 }
            );
        }
    } 
    catch (error) {
        console.log('src/app/api/hotel-add-booking/dining/unlock-add-booking/route' + error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
    
}


export { POST };