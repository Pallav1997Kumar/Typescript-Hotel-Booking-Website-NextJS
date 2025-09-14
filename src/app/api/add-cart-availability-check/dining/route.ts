import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";
import unlockExpiredDiningLocks from "@/functions/utils/unlockExpiredDiningLocks";

import HotelDiningTableBookingInfo from "@/database models/booking models/dining models/hotelDiningTableBookingInfo";


import { getNextMidnightUTC } from "@/functions/date";
import { DINING_AVAILABLE } from "@/constant string files/apiSuccessMessageConstants";

import { 
    BOOKING_UNAVAILABLE_LOCKED, 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";


import { TotalTables } from "@/interface/Dining Interface/hotelDiningInterface";
import { IHotelDiningTableBookingInfo } from "@/interface/Dining Interface/hotelDiningBookingInterface";

import { 
    DiningBookingDetails, 
    TableBookingCountDetails 
} from "@/interface/Dining Interface/diningBookingInterface";

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


async function POST(request: NextRequest) {
    try {
        const body: DiningBookingDetails = await request.json();
        const bookingDetails: DiningBookingDetails = body;

        const diningRestaurantTitle: DiningRestaurantTitle = bookingDetails.diningRestaurantTitle;
        const tableBookingDate: string | Date = bookingDetails.tableBookingDate;
        const mealType: MealType = bookingDetails.mealType;
        const tableBookingTime: string = bookingDetails.tableBookingTime;
        const tableBookingCountDetails: TableBookingCountDetails = bookingDetails.tableBookingCountDetails;
        const tableCountTwoPerson: number = tableBookingCountDetails.tableCountTwoPerson;
        const tableCountFourPerson: number = tableBookingCountDetails.tableCountFourPerson;
        const tableCountSixPerson: number = tableBookingCountDetails.tableCountSixPerson;

        const utcTableBookingDate: string = getNextMidnightUTC(tableBookingDate);

        await unlockExpiredDiningLocks();

        const hotelDiningTableBookingInformation: IHotelDiningTableBookingInfo[] = 
            await HotelDiningTableBookingInfo.find({
                tableBookingDate: utcTableBookingDate,
                diningRestaurantTitle,
                mealType,
                tableBookingTime
            });


        if(hotelDiningTableBookingInformation.length > 0) {

            const isBookingLocked: boolean = hotelDiningTableBookingInformation[0].isBookingLocked;

            if(isBookingLocked){
                const errorMessage: string = 
                    `${BOOKING_UNAVAILABLE_LOCKED.DINING_TABLE_LOCKED}. ${BOOKING_UNAVAILABLE_LOCKED.PLEASE_TRY_AGAIN_LATER}`;
                
                return NextResponse.json(
                    { errorMessage: errorMessage }, 
                    { status: 400 }
                );
            }
            else{
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
                    return NextResponse.json(
                        { message: DINING_AVAILABLE },
                        { status: 200 }
                    );
                }
                else{
                    const errorMessage: string = `${BOOKING_UNAVAILABLE_LOCKED.DINING_TABLE_UNAVAILABLE}.`;
                    return NextResponse.json(
                        { 
                            errorMessage: errorMessage, 
                            availableTableCountTwoPerson,
                            availableTableCountFourPerson,
                            availableTableCountSixPerson
                        }, 
                        { status: 400 }
                    );
                }
            }
            
        }
        else{
            const diningWithDateInformation: DiningWithDate | undefined = await fetchDiningEachDayData(diningRestaurantTitle);
            if(!diningWithDateInformation){
                throw new Error("diningWithDateInformation is missing");
            }

            const dateDetailsOfDining: DateDetails[] = diningWithDateInformation.dateDetails;

            const particularDateDetails: DateDetails | undefined = dateDetailsOfDining.find(
                function(eachDateDetails: DateDetails){
                    return new Date(utcTableBookingDate).getTime() === new Date(eachDateDetails.date).getTime();
                }
            );
            if(!particularDateDetails){
                throw new Error("particularDateDetails is missing")
            }
            
            const particularMealTypeDetails: FoodCategoryDetails | undefined = 
                particularDateDetails.foodCategoryDetails.find(function(eachFoodCategory){
                    return mealType === eachFoodCategory.currentFoodCategory;
                });

            if(!particularMealTypeDetails){
                throw new Error("particularMealTypeDetails is missing")
            }

            const totalTables: TotalTables = particularMealTypeDetails.totalTables;
            const totalTablesForTwoGuest: number = totalTables.totalTablesForTwoGuest;
            const totalTablesForFourGuest: number = totalTables.totalTablesForFourGuest;
            const totalTablesForSixGuest: number = totalTables.totalTablesForSixGuest;

            if(totalTablesForTwoGuest >= tableCountTwoPerson &&
                totalTablesForFourGuest >= tableCountFourPerson &&
                totalTablesForSixGuest >= tableCountSixPerson
            ){
                return NextResponse.json(
                    { message: DINING_AVAILABLE },
                    { status: 200 }
                );
            }
            else{
                const errorMessage: string = `${BOOKING_UNAVAILABLE_LOCKED.DINING_TABLE_UNAVAILABLE}.`
                return NextResponse.json(
                    { 
                        errorMessage: errorMessage,
                        availableTableCountTwoPerson: totalTablesForTwoGuest,
                        availableTableCountFourPerson: totalTablesForFourGuest,
                        availableTableCountSixPerson: totalTablesForSixGuest
                    }, 
                    { status: 400 }
                );
            }
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