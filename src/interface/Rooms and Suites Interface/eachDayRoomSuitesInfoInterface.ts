import { RoomsSuitesTitle } from "./roomsSuitesConstantInterface";

interface DateDetail {
    date: Date | string;
    price: number;
    totalRoom: number;
}

interface RoomWithDateDetails {
    roomTitle: RoomsSuitesTitle;
    dateDetails: DateDetail[];
}


interface RoomSuitesEachDayInfoRespone{
    roomsWithDate: RoomWithDateDetails[];
}

export type { DateDetail, RoomWithDateDetails, RoomSuitesEachDayInfoRespone };