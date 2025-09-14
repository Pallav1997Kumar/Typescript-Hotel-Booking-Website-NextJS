import { DiningRestaurantTitle, MealType } from "./hotelDiningConstantInterface";


interface TableBookingCountDetails {
    tableCountTwoPerson: number;
    tableCountFourPerson: number;
    tableCountSixPerson: number;
}

interface DiningBookingDetails {
    diningRestaurantTitle: DiningRestaurantTitle;
    tableBookingDate: Date | string;
    noOfGuests: number;
    mealType: MealType;
    tableBookingTime: string;
    tableBookingCountDetails: TableBookingCountDetails;
}

interface DiningDetailsForCart extends DiningBookingDetails {
    diningCartId: number;
    priceForBooking: number;
}


export type { 
    TableBookingCountDetails, 
    DiningBookingDetails, 
    DiningDetailsForCart 
};