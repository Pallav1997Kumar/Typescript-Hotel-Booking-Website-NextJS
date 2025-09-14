import { NextRequest, NextResponse } from "next/server";
import { UpdateWriteOpResult } from "mongoose";

import Connection from "@/database config/config";
import unlockExpiredDiningLocks from "@/functions/utils/unlockExpiredDiningLocks";

import HotelDiningTableBookingInfo from "@/database models/booking models/dining models/hotelDiningTableBookingInfo";


import { getDateText } from "@/functions/date";
import { DINING_BOOKING_LOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";
import { 
    BOOKING_UNAVAILABLE_LOCKED, 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";


import { IViewDiningCartByCartIdSuccessApiResponse } from "@/interface/Dining Interface/diningCartApiResponse";
import { ITableBookingCountDetails } from "@/interface/Dining Interface/diningDatabaseModelsInterface";
import { IHotelDiningTableBookingInfo } from "@/interface/Dining Interface/hotelDiningBookingInterface";
import { TotalTables } from "@/interface/Dining Interface/hotelDiningInterface";

import { 
    DateDetails, 
    DiningEachDayInfoRespone, 
    DiningWithDate, 
    FoodCategoryDetails 
} from "@/interface/Dining Interface/eachDayDiningInfoInterface";

import { 
    DiningRestaurantTitle,
    MealType
} from "@/interface/Dining Interface/hotelDiningConstantInterface";


Connection();


interface IHotelDiningTableBookingInfoInput {
    diningRestaurantTitle: IHotelDiningTableBookingInfo['diningRestaurantTitle'];
    tableBookingDate: Date;
    mealType: IHotelDiningTableBookingInfo['mealType'];
    tableBookingTime: string;
    totalNoOfGuest: number;
    isBookingLocked: boolean;
    lockedAt?: Date | null;
    totalTablesCount: ITableBookingCountDetails;
    availableTablesCount: ITableBookingCountDetails;
    bookedTablesCount: ITableBookingCountDetails;
}


async function POST(request: NextRequest) {
    try {
        const body: IViewDiningCartByCartIdSuccessApiResponse = await request.json();
        const eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse = body;

        const tableBookingDate: Date = eachDiningBookingInfo.cartInfo.tableBookingDate;
        const diningRestaurantTitle: DiningRestaurantTitle = eachDiningBookingInfo.cartInfo.diningRestaurantTitle;
        const mealType: MealType = eachDiningBookingInfo.cartInfo.mealType;
        const tableBookingTime: string = eachDiningBookingInfo.cartInfo.tableBookingTime;
        const tableBookingCountDetails: ITableBookingCountDetails = eachDiningBookingInfo.cartInfo.tableBookingCountDetails;
        const tableCountTwoPerson: number = tableBookingCountDetails.tableCountTwoPerson;
        const tableCountFourPerson: number = tableBookingCountDetails.tableCountFourPerson;
        const tableCountSixPerson: number = tableBookingCountDetails.tableCountSixPerson;

        const tableBookingDateString: string = getDateText(new Date(tableBookingDate));

        await unlockExpiredDiningLocks();

        // Check existing booking info
        const hotelDiningTableBookingInformation: IHotelDiningTableBookingInfo[] = 
            await HotelDiningTableBookingInfo.find({
                tableBookingDate,
                diningRestaurantTitle,
                mealType,
                tableBookingTime
            });

        if(hotelDiningTableBookingInformation.length > 0) {
            //If booking existing for particular dining on that date with paticular meal and booking time
            const availableTableCountTwoPerson: number = 
                hotelDiningTableBookingInformation[0].availableTablesCount.tableCountTwoPerson;
            const availableTableCountFourPerson: number = 
                hotelDiningTableBookingInformation[0].availableTablesCount.tableCountFourPerson;
            const availableTableCountSixPerson: number = 
                hotelDiningTableBookingInformation[0].availableTablesCount.tableCountSixPerson;

            if(availableTableCountTwoPerson >= tableCountTwoPerson && 
                availableTableCountFourPerson >= tableCountFourPerson && 
                availableTableCountSixPerson >= tableCountSixPerson
            ){
                // Update isBookingLocked to true and set lockedAt time
                const unlockDiningResult: UpdateWriteOpResult = await HotelDiningTableBookingInfo.updateOne(
                    {
                        tableBookingDate,
                        diningRestaurantTitle,
                        mealType,
                        tableBookingTime,
                        isBookingLocked: false
                    },
                    {
                        $set: { isBookingLocked: true, lockedAt: new Date() }
                    }
                );

                if(unlockDiningResult.modifiedCount === 0){
                    const errorMessage: string = 
                        `${diningRestaurantTitle} ${BOOKING_UNAVAILABLE_LOCKED.DINING_TABLE_LOCKED} for ${tableBookingDateString} for ${mealType}(${tableBookingTime}). ${BOOKING_UNAVAILABLE_LOCKED.PLEASE_TRY_AGAIN_LATER}`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }
                else {
                    return NextResponse.json(
                        { message: DINING_BOOKING_LOCKED_SUCCESSFULLY },
                        { status: 200 }
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
            //If no booking existing for particular dining on that date with paticular meal and booking time
            // No booking exists, fetch dining info and create new booking with lock
            const diningWithDateInformation: DiningWithDate | undefined = await fetchDiningEachDayData(diningRestaurantTitle);
            
            if(!diningWithDateInformation){
                throw new Error("diningWithDateInformation is missing");
            }
            
            const dateDetailsOfDining: DateDetails[] = diningWithDateInformation.dateDetails;
            
            const particularDateDetails: DateDetails | undefined = 
                dateDetailsOfDining.find(function(eachDateDetails: DateDetails){
                    return tableBookingDate === eachDateDetails.date;
                });
            
            if(!particularDateDetails){
                throw new Error("particularDateDetails is missing");
            }
            
            const particularMealTypeDetails: FoodCategoryDetails | undefined = 
                particularDateDetails.foodCategoryDetails.find(function(eachFoodCategory: FoodCategoryDetails){
                    return mealType === eachFoodCategory.currentFoodCategory;
                });
            
            if(!particularMealTypeDetails){
                throw new Error("particularMealTypeDetails is missing");
            }
            
            const totalTables: TotalTables = particularMealTypeDetails.totalTables;
            const totalTablesForTwoGuest: number = totalTables.totalTablesForTwoGuest;
            const totalTablesForFourGuest: number = totalTables.totalTablesForFourGuest;
            const totalTablesForSixGuest: number = totalTables.totalTablesForSixGuest;

            if(tableCountTwoPerson <= totalTablesForTwoGuest &&
                tableCountFourPerson <= totalTablesForFourGuest &&
                tableCountSixPerson <= totalTablesForSixGuest
            ){
                const bookingPayload: IHotelDiningTableBookingInfoInput = {
                    diningRestaurantTitle,
                    tableBookingDate,
                    mealType,
                    tableBookingTime,
                    totalNoOfGuest: 0,
                    isBookingLocked: true,
                    lockedAt: new Date(),
                    totalTablesCount: {
                        tableCountTwoPerson: totalTablesForTwoGuest,
                        tableCountFourPerson: totalTablesForFourGuest,
                        tableCountSixPerson: totalTablesForSixGuest
                    },
                    availableTablesCount: {
                        tableCountTwoPerson: totalTablesForTwoGuest,
                        tableCountFourPerson: totalTablesForFourGuest,
                        tableCountSixPerson: totalTablesForSixGuest
                    },
                    bookedTablesCount: {
                        tableCountTwoPerson: 0,
                        tableCountFourPerson: 0,
                        tableCountSixPerson: 0
                    },
                }

                await HotelDiningTableBookingInfo.create(bookingPayload);

                return NextResponse.json(
                    { message: DINING_BOOKING_LOCKED_SUCCESSFULLY },
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
    } 
    catch (error) {
        console.log('src/app/api/hotel-add-booking/dining/lock-checking/route' + error)
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}



async function fetchDiningEachDayData(diningTitle: string): Promise<DiningWithDate | undefined> {
    try {
        const response: Response = 
            await fetch(`${process.env.URL}/api/hotel-booking-information/dining-information/each-day-information/`);
        
        const data: DiningEachDayInfoRespone = await response.json();
        const allDiningWithDate: DiningWithDate[] = data.diningWithDate;
        
        const particularDiningEachDayInfo: DiningWithDate | undefined = 
            allDiningWithDate.find(function(eachDiningWithDate: DiningWithDate){
                return eachDiningWithDate.diningTitle == diningTitle;
            });
        
        if(!particularDiningEachDayInfo){
            throw new Error("particularDiningEachDayInfo is missing");
        }
        
        return particularDiningEachDayInfo;
    } catch (error) {
        console.log(error);
    }
}


export { POST };