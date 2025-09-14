import { NextRequest, NextResponse } from "next/server";

import meetingEventsRoomBookingBasicPrice from "@/json objects/booking rates/meetingEventsRoomBookingBasicPrice";
import { noOfDaysBookingPriceAvailableAfterToday } from "@/json objects/booking rates/meetingEventsRoomBookingBasicPrice";
import { getOnlyDay } from "@/functions/date";


import { 
    MeetingEventTimingList, 
    DayList, 
    MeetingEventsRoomBookingBasicPrice 
} from "@/interface/Event Meeting Interface/eventMeetingRoomInterface";

import { 
    MeetingEventDetails, 
    EventTimingDetailsBasicPrice, 
    DateDetailsBasicPrice 
} from "@/interface/Event Meeting Interface/eachDayEventMeetingInfoInterface"; 


// Main GET function to handle API request
function GET() {
    const meetingEventDetailsWithDate: MeetingEventDetails[] = 
        meetingEventsRoomBookingBasicPrice.map(function (
            eachMeetingEventsRooms: MeetingEventsRoomBookingBasicPrice
        ) {
            return {
                meetingEventTitle: eachMeetingEventsRooms.meetingEventAreaTitle,
                dateDetails: getDateDetailsForCurrentMeetingEventsRoom(
                    eachMeetingEventsRooms.dayList,
                    eachMeetingEventsRooms.totalNoOfRoom
                ),
            };
        });

    return NextResponse.json(
        { meetingEventDetailsWithDate }
    );
}

// Helper function to get date details for a meeting event room
function getDateDetailsForCurrentMeetingEventsRoom(
    currentEventMeetingRoomDayList: DayList[], 
    totalNoOfRooms: number
): DateDetailsBasicPrice[] {
    const dateDetails: DateDetailsBasicPrice[] = [];
    const todayDate: Date = new Date();

    // Get today's date in YYYY-MM-DD format
    let currentDate: Date = new Date(todayDate.toISOString().split("T")[0]);

    for (let i = 0; i <= noOfDaysBookingPriceAvailableAfterToday; i++) {
        const currentDay: Date = new Date(currentDate);
        const dayOfWeek: string = getOnlyDay(currentDay);

        // Find the day's details
        const meetingEventRoomDetails: DayList | undefined = 
            currentEventMeetingRoomDayList.find(function (eachDayList: DayList) {
                return eachDayList.day === dayOfWeek;
            });

        if (!meetingEventRoomDetails) {
            // Skip this date if no matching event details are found
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }

        // Map event timings to details
        const eventTimingDetails: EventTimingDetailsBasicPrice[] = 
            meetingEventRoomDetails.meetingEventTimingList.map(function (
                eachMeetingEventTiming: MeetingEventTimingList
            ) {
                return {
                    currentMeetingEventTiming: eachMeetingEventTiming.bookingTime,
                    currentMeetingEventTimingBasicPrice: eachMeetingEventTiming.basicPrice,
                    totalNoOfRooms,
                };
            });

        dateDetails.push({
            date: currentDay.toISOString().split("T")[0], 
            eventTimingDetails,
        });

        // Increment the date for the next iteration
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateDetails;
}

export { GET };
