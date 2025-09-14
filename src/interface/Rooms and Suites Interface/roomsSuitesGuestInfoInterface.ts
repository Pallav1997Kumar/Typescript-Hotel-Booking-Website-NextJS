import { RoomsSuitesTitle } from "./roomsSuitesConstantInterface";

interface GuestCount {
    guestTitle: string;
    maximumGuest: number;
}
  
interface Room {
    title: RoomsSuitesTitle;
    guestCount: GuestCount[];
}

interface RoomGuestInfoResponse {
    roomsGuestInfo: Room[];
}

export type { GuestCount, Room, RoomGuestInfoResponse };