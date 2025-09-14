import { RoomsSuitesTitle } from "./roomsSuitesConstantInterface";


interface ParticularRoomInfoInterface {
    roomNo: number;
    noOfAdult: number;
    noOfChildren: number;
    total: number;
}

interface RoomsSuitesBookingDetailsInterface {
    roomTitle: RoomsSuitesTitle;
    checkinDate: Date | string;
    checkoutDate: Date | string;
    totalRooms: number;
    totalGuest: number;
    guestRoomsDetails: ParticularRoomInfoInterface[];
}

interface IRoomsDetailsForCart extends RoomsSuitesBookingDetailsInterface{
    roomCartId: number;
    totalPriceOfAllRooms: number;
}

interface DateInfoInterface {
    key: Date | string;
    dateInOrdinal: string;
    priceOnDate: number;
    noOfRooms: number;
    totalPriceOnDate: number;
}


export type { 
    ParticularRoomInfoInterface, 
    RoomsSuitesBookingDetailsInterface, 
    IRoomsDetailsForCart, 
    DateInfoInterface 
};