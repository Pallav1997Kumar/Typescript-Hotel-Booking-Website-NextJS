import { IHotelCustomersDetailsFrontend, ITransactionDetailsFrontend } from "@/interface/hotelCustomersInterface";
import { RoomsSuitesTitle } from "./roomsSuitesConstantInterface";


interface IGuestRoomDetails {
    roomNo: number;
    noOfAdult: number;
    noOfChildren: number;
    total: number;
    _id: string;

}

export type { IGuestRoomDetails };



//Interfaces For Customer Starts
interface IRoomsSuitesBookingInfoForCustomer {
    _id: string;
    customerId: string;
    transactionId: string;
    bookingRoomTitle: RoomsSuitesTitle;
    bookingCheckinDate: Date;
    bookingCheckoutDate: Date;
    totalRooms: number;
    totalGuest: number;
    guestRoomsDetails: IGuestRoomDetails[];
    totalPriceOfAllRooms: number;
    __v: number;
    transactionDetails: ITransactionDetailsFrontend;
}

interface IRoomsSuitesBookingInfoForArrayForCustomer {
    _id: string,
    bookingInfo: IRoomsSuitesBookingInfoForCustomer;
}

export type { IRoomsSuitesBookingInfoForCustomer, IRoomsSuitesBookingInfoForArrayForCustomer };


interface IViewRoomsSuitesBookingSuccessResponseForCustomer {
    message: string;
    roomSuitesBookingInfo?: IRoomsSuitesBookingInfoForArrayForCustomer[];
}

interface IViewRoomsSuitesBookingErrorResponseForCustomer {
    errorMessage: string;
}

type ViewRoomsSuitesBookingResponseForCustomer = 
    | IViewRoomsSuitesBookingSuccessResponseForCustomer
    | IViewRoomsSuitesBookingErrorResponseForCustomer;

export type { ViewRoomsSuitesBookingResponseForCustomer };

//Interfaces For Customer Ends



//Interfaces For Admin Starts

interface IRoomsSuitesBookingInfoForAdmin {
    _id: string;
    customerId: string;
    transactionId: string;
    bookingRoomTitle: RoomsSuitesTitle;
    bookingCheckinDate: Date;
    bookingCheckoutDate: Date;
    totalRooms: number;
    totalGuest: number;
    guestRoomsDetails: IGuestRoomDetails[];
    totalPriceOfAllRooms: number;
    transactionDetails: ITransactionDetailsFrontend;
    customerDetails: IHotelCustomersDetailsFrontend;
}

interface IRoomsSuitesBookingInfoForArrayForAdmin {
    _id: string,
    bookingInfo: IRoomsSuitesBookingInfoForAdmin;
}

export type{ IRoomsSuitesBookingInfoForAdmin, IRoomsSuitesBookingInfoForArrayForAdmin }


interface IViewCurrentRoomsSuitesBookingSuccessResponseForAdmin {
    message: string;
    roomSuitesBookingInfo?: IRoomsSuitesBookingInfoForArrayForAdmin[];
    pagination?: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    }
}

interface IViewCurrentRoomsSuitesBookingErrorResponseForAdmin {
    errorMessage: string;
}

type ViewCurrentRoomsSuitesBookingResponseForAdmin = 
    | IViewCurrentRoomsSuitesBookingSuccessResponseForAdmin
    | IViewCurrentRoomsSuitesBookingErrorResponseForAdmin;

export type { ViewCurrentRoomsSuitesBookingResponseForAdmin };


interface IViewPastRoomsSuitesBookingSuccessResponseForAdmin {
    message: string;
    roomSuitesBookingInfo?: IRoomsSuitesBookingInfoForArrayForAdmin[];
    pagination?: {
        currentPage: number;
        hasMore: boolean;
        totalCount: number;
    }
}

interface IViewPatRoomsSuitesBookingErrorResponseForAdmin {
    errorMessage: string;
}

type ViewPastRoomsSuitesBookingResponseForAdmin = 
    | IViewPastRoomsSuitesBookingSuccessResponseForAdmin
    | IViewPatRoomsSuitesBookingErrorResponseForAdmin;

export type { ViewPastRoomsSuitesBookingResponseForAdmin };

//Interfaces For Admin Ends