import { DiningRestaurantTitle, MealType } from "./hotelDiningConstantInterface";


//Interface for Dining 
interface DiningTiming {
    foodCategory: MealType;
    foodTiming: string;
    foodSlotTime: string[];
}
  
interface Dining {
    diningAreaTitle: DiningRestaurantTitle;
    diningPath: string;
    contactNo: string;
    shortDescription: string;
    diningDescription: string;
    cuisine: string[];
    timing: DiningTiming[];
    photo: string;
}

export type { DiningTiming, Dining };


//Interface for Dining Price
interface PriceList{
    priceEachTableForTwoPerson: number;
    priceEachTableForFourPerson: number;
    priceEachTableForSixPerson: number;
}

interface FoodCategoryList{
    foodCategory: MealType;
    priceList: PriceList;
}

interface DayList {
    day: string;
    foodCategoryList: FoodCategoryList[];
}

interface TotalTables{
    totalTablesForTwoGuest: number;
    totalTablesForFourGuest: number;
    totalTablesForSixGuest: number;
}

interface DiningBookingPrice{
    diningAreaTitle: DiningRestaurantTitle;
    totalTables: TotalTables;
    dayList: DayList[];
}

export type { 
    PriceList, 
    FoodCategoryList, 
    DayList, 
    TotalTables, 
    DiningBookingPrice 
};


interface DiningInfoResponse {
    dining: Dining[];
}

export type { DiningInfoResponse };