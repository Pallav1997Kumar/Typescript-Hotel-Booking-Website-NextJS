import { DiningRestaurantTitle } from "./hotelDiningConstantInterface";
import { PriceList, TotalTables } from "./hotelDiningInterface";
  

export interface FoodCategoryDetails {
    currentFoodCategory: string;
    currentFoodCategoryPriceList: PriceList;
    totalTables: TotalTables;
}
  
export interface DateDetails {
    date: Date;
    foodCategoryDetails: FoodCategoryDetails[];
}
  
export interface DiningWithDate {
    diningTitle: DiningRestaurantTitle;
    dateDetails: DateDetails[];
}

export interface DiningEachDayInfoRespone { 
    diningWithDate: DiningWithDate[]; 
}