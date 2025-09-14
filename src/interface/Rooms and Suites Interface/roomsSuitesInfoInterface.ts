import { RoomsSuitesTitle } from "./roomsSuitesConstantInterface";

//Interface for Room Info
interface Amenities {
    room: string[];
    technology: string[];
    bathroom: string[];
}
  
interface Room {
    path: string;
    title: RoomsSuitesTitle;
    intro: string;
    description: string;
    bedType: string;
    totalRoomSize: string;
    amenities: Amenities;
    photos: string[];
}

export type { Amenities, Room };


//Interface for Room Price
interface PriceList {
    day: string;
    price: number;
}
  
interface RoomBookingPrice {
    title: RoomsSuitesTitle;
    totalNoOfRooms: number;
    priceList: PriceList[];
}

export type { PriceList, RoomBookingPrice};


interface RoomSuitesInfoResponse {
    rooms: Room[];
}

export type { RoomSuitesInfoResponse };