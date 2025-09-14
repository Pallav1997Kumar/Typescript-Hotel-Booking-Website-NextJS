import {  Document, Types } from "mongoose";

import { DiningRestaurantTitle, MealType } from "./hotelDiningConstantInterface";


interface ITableBookingCountDetails {
    tableCountTwoPerson: number;
    tableCountFourPerson: number;
    tableCountSixPerson: number;
}

interface IDiningCartInfo extends Document {
    customerId: Types.ObjectId;
    diningCartId: number;
    diningRestaurantTitle: DiningRestaurantTitle;
    tableBookingDate: Date;
    noOfGuests: number;
    mealType: MealType;
    tableBookingTime: string;
    tableBookingCountDetails: ITableBookingCountDetails;
    priceForBooking: number;
}

interface IDiningBookingInfo extends Document {
    customerId: Types.ObjectId;
    transactionId: Types.ObjectId;
    diningRestaurantTitle: DiningRestaurantTitle;
    tableBookingDate: Date;
    noOfGuests: number;
    mealType: MealType;
    tableBookingTime: string;
    tableBookingCountDetails: ITableBookingCountDetails;
    priceForBooking: number;
}


export type { ITableBookingCountDetails, IDiningCartInfo, IDiningBookingInfo }; 