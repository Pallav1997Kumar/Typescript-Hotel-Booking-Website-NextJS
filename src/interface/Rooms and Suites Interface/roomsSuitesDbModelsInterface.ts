import  { Document, Types } from "mongoose";

import { RoomsSuitesTitle } from "./roomsSuitesConstantInterface";


interface IGuestRoomDetails {
    roomNo: number;
    noOfAdult: number;
    noOfChildren: number;
    total: number;
}

interface IRoomsSuitesCartInfo extends Document {
    customerId: Types.ObjectId;
    customerCartID: number;
    bookingRoomTitle: RoomsSuitesTitle;
    bookingCheckinDate: Date;
    bookingCheckoutDate: Date;
    totalRooms: number
    totalGuest: number;
    guestRoomsDetails: IGuestRoomDetails[];
    totalPriceOfAllRooms: number;
}

interface IRoomsSuitesBookingInfo extends Document {
    customerId: Types.ObjectId;
    transactionId: Types.ObjectId;
    bookingRoomTitle: RoomsSuitesTitle;
    bookingCheckinDate: Date;
    bookingCheckoutDate: Date;
    totalRooms: number
    totalGuest: number;
    guestRoomsDetails: IGuestRoomDetails;
    totalPriceOfAllRooms: number;
}


export type { IGuestRoomDetails, IRoomsSuitesCartInfo, IRoomsSuitesBookingInfo };
