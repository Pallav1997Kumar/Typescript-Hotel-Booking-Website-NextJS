import { Document } from "mongoose";

import { RoomsSuitesTitle } from "./roomsSuitesConstantInterface";


interface IHotelRoomSuiteBookingInfo extends Document {
    bookingRoomTitle: RoomsSuitesTitle;
    hotelBookingDate: Date;
    totalGuestCount: number;
    totalRoomsCount: number;
    bookedRoomsCount: number;
    availableRoomsCount: number;
    isBookingLocked: boolean;
    lockedAt?: Date | null;
}


export type { IHotelRoomSuiteBookingInfo };