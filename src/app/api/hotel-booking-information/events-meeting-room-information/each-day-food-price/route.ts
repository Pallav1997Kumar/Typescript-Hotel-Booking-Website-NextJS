import { NextRequest, NextResponse } from "next/server";

import eventMeetingFoodServicePrice from "@/json objects/booking rates/eventMeetingFoodServicePrice";
import { noOfDaysFoodServicePriceAvailableAfterToday } from "@/json objects/booking rates/eventMeetingFoodServicePrice";
import { getOnlyDay } from "@/functions/date";


import { 
    MeetingEventFoodServiceTimingList, 
    EventMeetingFoodServicePrice 
} from "@/interface/Event Meeting Interface/eventMeetingRoomInterface";

import { 
    EventTimingDetailsForFoodPrice, 
    DateDetailsForFoodPrice 
} from "@/interface/Event Meeting Interface/eachDayEventMeetingInfoInterface"; 


// GET Function for API Route
function GET() {
    const meetingEventFoodPriceWithDate: DateDetailsForFoodPrice[] = 
        getDateDetailsWithFoodServicePriceForRooms(eventMeetingFoodServicePrice);

    return NextResponse.json(
        { meetingEventFoodPriceWithDate }
    );
}

// Function to Get Date Details with Food Service Prices
function getDateDetailsWithFoodServicePriceForRooms(
    eventMeetingRoomDayList: EventMeetingFoodServicePrice[]
): DateDetailsForFoodPrice[] {
    const dateDetails: DateDetailsForFoodPrice[] = [];
    const todayDate: Date = new Date();
    let currentDate: Date = new Date(todayDate.toISOString().split("T")[0]); // Format YYYY-MM-DD

    for (let i = 0; i <= noOfDaysFoodServicePriceAvailableAfterToday; i++) {
        const currentDay: Date = new Date(currentDate);
        const dayOfWeek: string = getOnlyDay(currentDay);

        // Find details for the current day
        const meetingEventRoomDetails: EventMeetingFoodServicePrice | undefined = 
            eventMeetingRoomDayList.find(function (eachDayList: EventMeetingFoodServicePrice) {
                return eachDayList.day === dayOfWeek;
            });

        if (!meetingEventRoomDetails) {
            // Skip this date if no matching event details are found
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }

        // Map event timings to details
        const eventTimingDetails: EventTimingDetailsForFoodPrice[] = 
            meetingEventRoomDetails.meetingEventTimingList.map(function (
                eachMeetingEventTiming: MeetingEventFoodServiceTimingList
            ) {
                return {
                    meetingEventCurrentTiming: eachMeetingEventTiming.bookingTime,
                    meetingEventCurrentTimingFoodPrice: eachMeetingEventTiming.foodServicePricePerGuest, // Use full array
                };
            });

        dateDetails.push({
            date: currentDay.toISOString().split("T")[0], // Store as YYYY-MM-DD
            eventTimingDetails,
        });

        // Increment the date for the next iteration
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateDetails;
}

export { GET };
