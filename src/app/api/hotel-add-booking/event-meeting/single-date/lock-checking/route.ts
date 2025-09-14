import { NextRequest, NextResponse } from "next/server";
import { UpdateWriteOpResult } from "mongoose";

import Connection from "@/database config/config";
import unlockExpiredEventMeetingLocks from "@/functions/utils/unlockExpiredEventMeetingLocks";

import HotelEventMeetingRoomBookingInfo from "@/database models/booking models/events meetings models/hotelEventMeetingRoomBookingInfo";


import { EVENT_MEETING_BOOKING_LOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";
import { getDateText } from "@/functions/date";

import { 
    BOOKING_UNAVAILABLE_LOCKED, 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";


import { IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";

import { 
    DateDetailsBasicPrice, 
    EventMeetingEachDayResponse, 
    EventTimingDetailsBasicPrice, 
    MeetingEventDetails 
} from "@/interface/Event Meeting Interface/eachDayEventMeetingInfoInterface";

import { 
    IHotelEventMeetingRoomBookingInfo, 
    IHotelEventMeetingRoomBookingInfoInput 
} from "@/interface/Event Meeting Interface/hotelEventMeetingBookingInterface";

import { 
    MeetingEventBookingTime,
    MeetingEventsRoomTitle
} from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


Connection();


async function POST(request: NextRequest) {
    try {
        const body: IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse = await request.json();
        const eachEventMeetingBookingInfo: IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse = body;

        const meetingEventsInfoTitle: MeetingEventsRoomTitle = eachEventMeetingBookingInfo.cartInfo.meetingEventsInfoTitle;
        const meetingEventBookingDate: Date = eachEventMeetingBookingInfo.cartInfo.meetingEventBookingDate;
        const meetingEventBookingTime: MeetingEventBookingTime[] = eachEventMeetingBookingInfo.cartInfo.meetingEventBookingTime;

        const meetingEventBookingDateString: string = getDateText(new Date(meetingEventBookingDate));

        const eventMeetingWithDateDetails: MeetingEventDetails | undefined = 
            await fetchEventMeetingEachDayData(meetingEventsInfoTitle);

        if(!eventMeetingWithDateDetails){
            throw new Error("eventMeetingWithDateDetails is missing");
        }
        const eventMeetingDateDetails: DateDetailsBasicPrice[] = eventMeetingWithDateDetails.dateDetails;

        const particularDateEventMeetingDateDetails: DateDetailsBasicPrice | undefined = 
            eventMeetingDateDetails.find(function(
                eachEventMeetingDateDetails: DateDetailsBasicPrice
            ){
                return new Date(eachEventMeetingDateDetails.date).getTime() === new Date(meetingEventBookingDate).getTime();
            });

        if (!particularDateEventMeetingDateDetails) {
            const errorMessage: string = 
                `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} for ${meetingEventBookingDateString}.`;
            
            return NextResponse.json(
                { errorMessage: errorMessage }, 
                { status: 400 }
            );
        }
        const eventTimingDetails: EventTimingDetailsBasicPrice[] = particularDateEventMeetingDateDetails.eventTimingDetails;

        const lockedTimes: MeetingEventBookingTime[] = [];
        
        await unlockExpiredEventMeetingLocks();

        for (const eachMeetingEventBookingTime of meetingEventBookingTime){
            const specificTimeDetails: EventTimingDetailsBasicPrice | undefined = 
                eventTimingDetails.find(function(eachEventTimingDetails: EventTimingDetailsBasicPrice){
                    return eachMeetingEventBookingTime === eachEventTimingDetails.currentMeetingEventTiming;
                });

            if (!specificTimeDetails) {
                await rollbackLockedTimes(meetingEventsInfoTitle, meetingEventBookingDate, lockedTimes);
                const errorMessage: string = 
                    `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} at ${eachMeetingEventBookingTime} on ${meetingEventBookingDateString}.`;
                
                return NextResponse.json(
                    { errorMessage: errorMessage }, 
                    { status: 400 }
                );
            }
            const totalNoOfRooms: number = specificTimeDetails.totalNoOfRooms;

            // Check existing booking info
            const hotelEventMeetingBookingInformation: IHotelEventMeetingRoomBookingInfo[] = 
                await HotelEventMeetingRoomBookingInfo.find({
                    meetingEventBookingDate,
                    meetingEventsInfoTitle,
                    meetingEventBookingTime: eachMeetingEventBookingTime
                });

            if(hotelEventMeetingBookingInformation.length > 0){
                if(hotelEventMeetingBookingInformation[0].availableNumbersOfRoom > 0){
                    const unlockEventMeetingResult: UpdateWriteOpResult = await HotelEventMeetingRoomBookingInfo.updateOne(
                        {
                            meetingEventBookingDate,
                            meetingEventsInfoTitle,
                            meetingEventBookingTime: eachMeetingEventBookingTime,
                            isBookingLocked: false
                        },
                        {
                            $set: { isBookingLocked: true, lockedAt: new Date() }
                        }
                    );

                    if(unlockEventMeetingResult.modifiedCount === 0){
                        await rollbackLockedTimes(meetingEventsInfoTitle, meetingEventBookingDate, lockedTimes);

                        const errorMessage: string = 
                            `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_LOCKED} for ${meetingEventBookingDateString} ${eachMeetingEventBookingTime}. ${BOOKING_UNAVAILABLE_LOCKED.PLEASE_TRY_AGAIN_LATER}`;
                        
                        return NextResponse.json(
                            { errorMessage: errorMessage }, 
                            { status: 400 }
                        );
                    }
                    lockedTimes.push(eachMeetingEventBookingTime);

                }
                else {
                    await rollbackLockedTimes(meetingEventsInfoTitle, meetingEventBookingDate, lockedTimes);
                    
                    const errorMessage: string = 
                        `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} for ${meetingEventBookingDateString} ${eachMeetingEventBookingTime}.`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }

            }
            else {
                const bookingPayload: IHotelEventMeetingRoomBookingInfoInput = {
                    meetingEventsInfoTitle,
                    meetingEventBookingDate,
                    meetingEventBookingTime: eachMeetingEventBookingTime,
                    totalGuestCount: 0,
                    totalNumbersOfRoom: totalNoOfRooms,
                    availableNumbersOfRoom: totalNoOfRooms,
                    bookedNumbersOfRoom: 0,
                    isBookingLocked: true,
                    lockedAt: new Date()
                }

                await HotelEventMeetingRoomBookingInfo.create(bookingPayload);
                lockedTimes.push(eachMeetingEventBookingTime);
            }
        }

        return NextResponse.json(
            { message: EVENT_MEETING_BOOKING_LOCKED_SUCCESSFULLY }, 
            { status: 200 }
        );
        
        
    } 
    catch (error) {
        console.error(error)
        console.log('src/app/api/hotel-add-booking/event-meeting/single-date/lock-checking/route' + error)
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


async function fetchEventMeetingEachDayData(meetingEventTitle: string): Promise<MeetingEventDetails | undefined>{
    try {
        const response: Response = await fetch(
            `${process.env.URL}/api/hotel-booking-information/events-meeting-room-information/each-day-information`
        );

        const data: EventMeetingEachDayResponse = await response.json();
        const allMeetingEventDetailsWithDate: MeetingEventDetails[] = data.meetingEventDetailsWithDate;

        const particularMeetingEventEachDayInfo: MeetingEventDetails | undefined = 
            allMeetingEventDetailsWithDate.find(function(eachMeetingEventDetailsWithDate: MeetingEventDetails){
                return eachMeetingEventDetailsWithDate.meetingEventTitle == meetingEventTitle;
            });

        if(!particularMeetingEventEachDayInfo){
            throw new Error("particularMeetingEventEachDayInfo is missing");
        }
        
        return particularMeetingEventEachDayInfo;
    } catch (error) {
        console.log(error);
    }
}


async function rollbackLockedTimes(meetingEventsInfoTitle: string, meetingEventBookingDate: Date, lockedTimes: string[]) {
    for (const time of lockedTimes) {
        await HotelEventMeetingRoomBookingInfo.updateOne(
            {
                meetingEventsInfoTitle,
                meetingEventBookingDate,
                meetingEventBookingTime: time
            },
            {
                $set: {
                    isBookingLocked: false,
                    lockedAt: null
                }
            }
        );
    }
}


export { POST };