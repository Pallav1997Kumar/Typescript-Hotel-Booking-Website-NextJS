import { NextRequest, NextResponse } from "next/server";
import { UpdateWriteOpResult } from "mongoose";

import Connection from "@/database config/config";
import unlockExpiredEventMeetingLocks from "@/functions/utils/unlockExpiredEventMeetingLocks";

import HotelEventMeetingRoomBookingInfo from "@/database models/booking models/events meetings models/hotelEventMeetingRoomBookingInfo";


import { getDatesInRangeInclusiveBothDate, getDateText } from "@/functions/date";
import { EVENT_MEETING_BOOKING_LOCKED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";

import { 
    BOOKING_UNAVAILABLE_LOCKED, 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";


import { IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";

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


interface ILockedDates {
    date: Date;
    time: MeetingEventBookingTime;
}


async function POST(request: NextRequest) {
    try {
        const body: IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse = await request.json();
        const eachEventMeetingBookingInfo: IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse = body;

        const meetingEventsInfoTitle: MeetingEventsRoomTitle = eachEventMeetingBookingInfo.cartInfo.meetingEventsInfoTitle;
        const meetingEventStartBookingDate: Date = new Date(eachEventMeetingBookingInfo.cartInfo.meetingEventStartBookingDate);
        const meetingEventEndBookingDate: Date = new Date(eachEventMeetingBookingInfo.cartInfo.meetingEventEndBookingDate);
        const meetingEventBookingTime: MeetingEventBookingTime[] = eachEventMeetingBookingInfo.cartInfo.meetingEventBookingTime;

        const meetingEventStartBookingDateString: string = getDateText(meetingEventStartBookingDate);
        const meetingEventEndBookingDateString: string =  getDateText(meetingEventEndBookingDate);

        const datesList: Date[] = getDatesInRangeInclusiveBothDate(meetingEventStartBookingDate, meetingEventEndBookingDate);

        await unlockExpiredEventMeetingLocks();

        const lockedDates: ILockedDates[] = [];

        const eventMeetingWithDateDetails: MeetingEventDetails | undefined = 
            await fetchEventMeetingEachDayData(meetingEventsInfoTitle);

        if(!eventMeetingWithDateDetails){
            throw new Error("eventMeetingWithDateDetails is missing");
        }
        const eventMeetingDateDetails: DateDetailsBasicPrice[] = eventMeetingWithDateDetails.dateDetails;

        for (const eachDate of datesList){

            const particularDateEventMeetingDateDetails: DateDetailsBasicPrice | undefined = 
                eventMeetingDateDetails.find(function(eachEventMeetingDateDetails: DateDetailsBasicPrice){
                    return new Date(eachEventMeetingDateDetails.date).getTime() === new Date(eachDate).getTime();
                });

            if (!particularDateEventMeetingDateDetails) {
                await rollbackLockedEventMeetingDates(meetingEventsInfoTitle, lockedDates);
                
                const errorMessage: string = 
                    `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} on ${eachDate}.`;
                
                return NextResponse.json(
                    { errorMessage: errorMessage }, 
                    { status: 400 }
                );
            }
            const eventTimingDetails: EventTimingDetailsBasicPrice[] = particularDateEventMeetingDateDetails.eventTimingDetails;

            for (const eachMeetingEventBookingTime of meetingEventBookingTime){

                const specificTimeDetails: EventTimingDetailsBasicPrice | undefined = 
                    eventTimingDetails.find(function(eachEventTimingDetails: EventTimingDetailsBasicPrice){
                        return eachMeetingEventBookingTime === eachEventTimingDetails.currentMeetingEventTiming;
                    });

                if (!specificTimeDetails) {
                    await rollbackLockedEventMeetingDates(meetingEventsInfoTitle, lockedDates);
                    
                    const errorMessage: string = 
                        `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} at ${eachMeetingEventBookingTime} on ${eachDate}.`;
                    
                    return NextResponse.json(
                        { errorMessage: errorMessage }, 
                        { status: 400 }
                    );
                }
                const totalNoOfRooms: number = specificTimeDetails.totalNoOfRooms;

                // Check existing booking info
                const hotelEventMeetingBookingInformation: IHotelEventMeetingRoomBookingInfo[] = 
                    await HotelEventMeetingRoomBookingInfo.find({
                        meetingEventBookingDate: eachDate,
                        meetingEventsInfoTitle,
                        meetingEventBookingTime: eachMeetingEventBookingTime
                    });

                if(hotelEventMeetingBookingInformation.length > 0){
                    if(hotelEventMeetingBookingInformation[0].availableNumbersOfRoom > 0){
                        const unlockEventMeetingResult: UpdateWriteOpResult = await HotelEventMeetingRoomBookingInfo.updateOne(
                            {
                                meetingEventBookingDate: eachDate,
                                meetingEventsInfoTitle,
                                meetingEventBookingTime: eachMeetingEventBookingTime,
                                isBookingLocked: false
                            },
                            {
                                $set: { isBookingLocked: true, lockedAt: new Date() }
                            }
                        );

                        if(unlockEventMeetingResult.modifiedCount === 0){
                            await rollbackLockedEventMeetingDates(meetingEventsInfoTitle, lockedDates);
                            
                            const errorMessage: string = 
                                `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_LOCKED} from ${meetingEventStartBookingDateString} to ${meetingEventEndBookingDateString} ${eachMeetingEventBookingTime}. ${BOOKING_UNAVAILABLE_LOCKED.PLEASE_TRY_AGAIN_LATER}`;
                            
                            return NextResponse.json(
                                { errorMessage: errorMessage }, 
                                { status: 400 }
                            );
                        }
                        lockedDates.push({ date: eachDate, time: eachMeetingEventBookingTime });

                    }
                    else {
                        await rollbackLockedEventMeetingDates(meetingEventsInfoTitle, lockedDates);
                        
                        const errorMessage: string = 
                            `${meetingEventsInfoTitle} ${BOOKING_UNAVAILABLE_LOCKED.EVENT_MEETING_ROOM_UNAVAILABLE} from ${meetingEventStartBookingDateString} to ${meetingEventEndBookingDateString} ${eachMeetingEventBookingTime}.`;
                        
                        return NextResponse.json(
                            { errorMessage: errorMessage }, 
                            { status: 400 }
                        );
                    }

                }
                else {
                    const bookingPayload: IHotelEventMeetingRoomBookingInfoInput = {
                        meetingEventsInfoTitle,
                        meetingEventBookingDate: eachDate,
                        meetingEventBookingTime: eachMeetingEventBookingTime,
                        totalGuestCount: 0,
                        totalNumbersOfRoom: totalNoOfRooms,
                        availableNumbersOfRoom: totalNoOfRooms,
                        bookedNumbersOfRoom: 0,
                        isBookingLocked: true,
                        lockedAt: new Date()
                    }

                    await HotelEventMeetingRoomBookingInfo.create(bookingPayload);
                    lockedDates.push({ date: eachDate, time: eachMeetingEventBookingTime });
                }
            }

        }

        return NextResponse.json(
            { message: EVENT_MEETING_BOOKING_LOCKED_SUCCESSFULLY }, 
            { status: 200 }
        );
        
        
    } 
    catch (error) {
        console.error(error)
        console.log('src/app/api/hotel-add-booking/event-meeting/multiple-dates-continous/lock-checking/route' + error)
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


async function fetchEventMeetingEachDayData(meetingEventTitle: string): Promise<MeetingEventDetails | undefined> {
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


async function rollbackLockedEventMeetingDates(
    meetingEventsInfoTitle: string, 
    lockedDates: ILockedDates[]
) {
    for (const eachLock of lockedDates) {
        await HotelEventMeetingRoomBookingInfo.updateOne(
            {
                meetingEventsInfoTitle,
                meetingEventBookingDate: eachLock.date,
                meetingEventBookingTime: eachLock.time
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



export { POST }