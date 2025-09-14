import { 
    IHotelCustomersDetailsFrontend, 
    ITransactionDetailsFrontend 
} from "@/interface/hotelCustomersInterface";

import { DiningRestaurantTitle, MealType } from "./hotelDiningConstantInterface";


interface ITableBookingCountDetails {
    tableCountTwoPerson: number;
    tableCountFourPerson: number;
    tableCountSixPerson: number;
    _id: string;
}

export type { ITableBookingCountDetails };


//Interfaces for Customer Starts

interface IDiningBookingInfoForCustomer {
    _id: string;
    customerId: string;
    transactionId: string;
    diningRestaurantTitle: DiningRestaurantTitle;
    tableBookingDate: Date;
    noOfGuests: number;
    mealType: MealType;
    tableBookingTime: string;
    tableBookingCountDetails: ITableBookingCountDetails;
    priceForBooking: number;
    __v: number;
    transactionDetails: ITransactionDetailsFrontend;
}


interface IDiningBookingInfoForArrayForCustomer {
    _id: string,
    bookingInfo: IDiningBookingInfoForCustomer;
}


export type { IDiningBookingInfoForArrayForCustomer, IDiningBookingInfoForCustomer };


interface IViewDiningBookingSuccessResponseForCustomer {
    message: string;
    diningBookingInfo?: IDiningBookingInfoForArrayForCustomer[];
}

interface IViewDiningBookingErrorResponseForCustomer {
    errorMessage: string;
}

type ViewDiningBookingResponseForCustomer = 
    | IViewDiningBookingSuccessResponseForCustomer
    | IViewDiningBookingErrorResponseForCustomer;

export type { ViewDiningBookingResponseForCustomer };

//Interfaces for Customer Ends



//Interfaces for Admin Starts

interface IDiningBookingInfoForAdmin {
    _id: string;
    customerId: string;
    transactionId: string;
    diningRestaurantTitle: DiningRestaurantTitle;
    tableBookingDate: Date;
    noOfGuests: number;
    mealType: MealType;
    tableBookingTime: string;
    tableBookingCountDetails: ITableBookingCountDetails;
    priceForBooking: number;
    transactionDetails: ITransactionDetailsFrontend;
    customerDetails: IHotelCustomersDetailsFrontend;
    __v: number;
}

interface IDiningBookingInfoForArrayForAdmin {
    _id: string,
    bookingInfo: IDiningBookingInfoForAdmin;
}


export type { IDiningBookingInfoForArrayForAdmin, IDiningBookingInfoForAdmin };


interface IViewCurrentDiningBookingSuccessResponseForAdmin {
    message: string;
    diningBookingInfo?: IDiningBookingInfoForArrayForAdmin[];
    pagination?: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    }
}

interface IViewCurrentDiningBookingErrorResponseForAdmin {
    errorMessage: string;
}

type ViewCurrentDiningBookingResponseForAdmin = 
    | IViewCurrentDiningBookingSuccessResponseForAdmin
    | IViewCurrentDiningBookingErrorResponseForAdmin;

export type { ViewCurrentDiningBookingResponseForAdmin };


interface IViewPastDiningBookingSuccessResponseForAdmin {
    message: string;
    diningBookingInfo?: IDiningBookingInfoForArrayForAdmin[];
    pagination?: {
        currentPage: number;
        hasMore: boolean;
        totalCount: number;
    }
}

interface IViewPastDiningBookingErrorResponseForAdmin {
    errorMessage: string;
}

type ViewPastDiningBookingResponseForAdmin = 
    | IViewPastDiningBookingSuccessResponseForAdmin
    | IViewPastDiningBookingErrorResponseForAdmin;

export type { ViewPastDiningBookingResponseForAdmin };

//Interfaces for Admin Ends