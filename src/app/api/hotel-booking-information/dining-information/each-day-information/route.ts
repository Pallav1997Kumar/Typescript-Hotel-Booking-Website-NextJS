import { NextRequest, NextResponse } from "next/server";

import diningBookingPrice from "@/json objects/booking rates/diningBookingPrice";
import { noOfDaysBookingPriceAvailableAfterToday } from "@/json objects/booking rates/diningBookingPrice";
import { getOnlyDay } from "@/functions/date";


import { 
    DiningRestaurantTitle, 
    MealType 
} from "@/interface/Dining Interface/hotelDiningConstantInterface";

import { 
    DiningBookingPrice, 
    DayList, 
    TotalTables, 
    FoodCategoryList, 
    PriceList 
} from "@/interface/Dining Interface/hotelDiningInterface"; 

import { 
    DiningWithDate,  
    DateDetails, 
    FoodCategoryDetails 
} from "@/interface/Dining Interface/eachDayDiningInfoInterface";


function GET() {
    const diningWithDate: DiningWithDate[] = 
        diningBookingPrice.map(function(eachDiningRestaurant: DiningBookingPrice) {
            const diningAreaTitle: DiningRestaurantTitle = eachDiningRestaurant.diningAreaTitle;
            const dayList: DayList[] = eachDiningRestaurant.dayList;
            const totalTables: TotalTables = eachDiningRestaurant.totalTables;
            const currentDiningRestaurantDetailsObject: DiningWithDate = {
                diningTitle: diningAreaTitle,
                dateDetails: getDateDetailsForCurrentDiningRestaurant(dayList,totalTables)
            };

            return currentDiningRestaurantDetailsObject;
        });

    return NextResponse.json({ diningWithDate });
}


function getDateDetailsForCurrentDiningRestaurant(
    currentRestaurantDayList: DayList[], 
    totalTables: TotalTables
): DateDetails[] {
    const dateDetails: DateDetails[] = [];
    const todayDate: string = new Date().toISOString().split("T")[0];
    let currentDate: Date = new Date(todayDate);
    const dateToday: Date = new Date(currentDate);
    const dayOfWeekToday: string = getOnlyDay(dateToday);

    const foodCategoryDetailsToday: DayList | undefined = 
        currentRestaurantDayList.find(function(eachDayList: DayList) {
            return dayOfWeekToday === eachDayList.day;
        });

    if (!foodCategoryDetailsToday) {
        return []; 
    }

    const todayFoodCategoryArray: FoodCategoryList[] = foodCategoryDetailsToday.foodCategoryList;
    
    const todayFoodListArray: FoodCategoryDetails[] = 
        todayFoodCategoryArray.map(function(eachFoodCategory: FoodCategoryList) {
            const currentFoodCategory: MealType = eachFoodCategory.foodCategory;
            const currentFoodCategoryPriceList: PriceList = eachFoodCategory.priceList;

            const currentFoodCategoryObject: FoodCategoryDetails = {
                currentFoodCategory,
                currentFoodCategoryPriceList,
                totalTables,
            };

            return currentFoodCategoryObject;
        });

    const todayDateDetails: DateDetails = {
        date: dateToday,
        foodCategoryDetails: todayFoodListArray,
    };

    dateDetails.push(todayDateDetails);

    for (let i = 0; i < noOfDaysBookingPriceAvailableAfterToday; i++) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dateAfterToday: Date = new Date(currentDate);
        const dayOfWeekAfterToday: string = getOnlyDay(dateAfterToday);

        const foodCategoryDetailsAfterToday: DayList | undefined = 
            currentRestaurantDayList.find(function(eachDayList: DayList) {
                return dayOfWeekAfterToday === eachDayList.day;
            });

        if (!foodCategoryDetailsAfterToday) {
            continue; // Skip to next day if no matching day is found
        }

        const currentDayFoodCategoryArrayAfterToday: FoodCategoryList[] = 
            foodCategoryDetailsAfterToday.foodCategoryList;

        const currentDayFoodListArrayAfterToday: FoodCategoryDetails[] = 
            currentDayFoodCategoryArrayAfterToday.map(function(eachFoodCategory: FoodCategoryList) {
                const currentFoodCategory: MealType = eachFoodCategory.foodCategory;
                const currentFoodCategoryPriceList: PriceList = eachFoodCategory.priceList;

                const currentFoodCategoryObject: FoodCategoryDetails = {
                    currentFoodCategory,
                    currentFoodCategoryPriceList,
                    totalTables,
                };

                return currentFoodCategoryObject;
            });

        const currentdaydateDetailsAfterToday: DateDetails = {
            date: dateAfterToday,
            foodCategoryDetails: currentDayFoodListArrayAfterToday,
        };

        dateDetails.push(currentdaydateDetailsAfterToday);
    }

    return dateDetails;
}

export { GET };
