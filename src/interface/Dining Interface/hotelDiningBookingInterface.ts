import {  Document, Types } from "mongoose";

import { DiningRestaurantTitle, MealType } from "./hotelDiningConstantInterface";


interface ITableBookingCountDetails {
    tableCountTwoPerson: number;
    tableCountFourPerson: number;
    tableCountSixPerson: number;
}


interface IHotelDiningTableBookingInfo extends Document {
    diningRestaurantTitle: DiningRestaurantTitle;
    tableBookingDate: Date;
    mealType: MealType;
    tableBookingTime: string;
    totalNoOfGuest: number;
    isBookingLocked: boolean;
    lockedAt?: Date | null;
    totalTablesCount: ITableBookingCountDetails;
    availableTablesCount: ITableBookingCountDetails;
    bookedTablesCount: ITableBookingCountDetails;
}


export type { ITableBookingCountDetails, IHotelDiningTableBookingInfo };