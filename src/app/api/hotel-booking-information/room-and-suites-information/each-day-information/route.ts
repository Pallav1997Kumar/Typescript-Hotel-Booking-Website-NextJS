import { NextRequest, NextResponse } from "next/server";

import roomBookingPrice from "@/json objects/booking rates/roomBookingPrice";
import { noOfDaysBookingPriceAvailableAfterToday } from "@/json objects/booking rates/roomBookingPrice";
import { getOnlyDay } from "@/functions/date";


import { RoomsSuitesTitle } from "@/interface/Rooms and Suites Interface/roomsSuitesConstantInterface";

import { 
    PriceList, 
    RoomBookingPrice 
} from "@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface";

import { 
    DateDetail, 
    RoomWithDateDetails 
} from "@/interface/Rooms and Suites Interface/eachDayRoomSuitesInfoInterface";



// The main GET function that handles the API request
function GET(): NextResponse {
    const roomsWithDate: RoomWithDateDetails[] = 
        roomBookingPrice.map(function (eachRoom: RoomBookingPrice) {
            const title: RoomsSuitesTitle = eachRoom.title;
            const totalNoOfRooms: number = eachRoom.totalNoOfRooms;
            const currentRoomDetailsObject: RoomWithDateDetails = {
                roomTitle: title,
                dateDetails: getDateDetailsForRoom(totalNoOfRooms, priceForSpecificRoom, title),
            };
        return currentRoomDetailsObject;
        });
  
    return NextResponse.json({ roomsWithDate });
}
  
  // Function to get the price for a specific room on a specific date
function priceForSpecificRoom(date: Date, currentRoomTitle: RoomsSuitesTitle): number {
    const currentRoomDetails: RoomBookingPrice | undefined = roomBookingPrice.find(function (eachRoom: RoomBookingPrice) {
            return eachRoom.title === currentRoomTitle;
        }
    );
    if (!currentRoomDetails) {
        throw new Error("Room not found");
    }
  
    const priceList: PriceList[] = currentRoomDetails.priceList;
    const dayOfWeek: string = getOnlyDay(date);
    const dayDetails: PriceList | undefined = priceList.find(function (eachList) {
        return eachList.day === dayOfWeek;
    });
  
    if (!dayDetails) {
        throw new Error(`No price available for ${dayOfWeek}`);
    }
  
    return dayDetails.price;
}
  
// Function to get the date details (price and total rooms available) for a specific room over a number of days
function getDateDetailsForRoom(
    totalRoomEachDay: number, 
    priceForSpecificRoom: (date: Date, currentRoomTitle: RoomsSuitesTitle) => number, 
    currentRoomTitle: RoomsSuitesTitle
): DateDetail[] {
    const dateDetails: DateDetail[] = [];
    const todayDate: string = new Date().toISOString().split("T")[0];
    let currentDate: Date = new Date(todayDate);
    const date = new Date(currentDate);
  
    // Get price for the current date
    const price: number = priceForSpecificRoom(currentDate, currentRoomTitle);
    const totalRoom: number = totalRoomEachDay;
    const currentDateDetailsObject: DateDetail = {
        date,
        price,
        totalRoom,
    };
    dateDetails.push(currentDateDetailsObject);
  
    // Get price for the next `noOfDaysBookingPriceAvailableAfterToday` days
    for (let i = 0; i < noOfDaysBookingPriceAvailableAfterToday; i++) {
        currentDate.setDate(currentDate.getDate() + 1);
        const date: Date = new Date(currentDate);
        const price: number = priceForSpecificRoom(date, currentRoomTitle);
        const totalRoom: number = totalRoomEachDay;
        const currentDateDetailsObject: DateDetail = {
            date,
            price,
            totalRoom,
        };
        dateDetails.push(currentDateDetailsObject);
    }
  
    return dateDetails;
}
  
export { GET };