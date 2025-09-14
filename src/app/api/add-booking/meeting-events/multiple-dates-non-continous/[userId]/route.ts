import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import NonContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesBookingInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_NON_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";

import { 
    IDateBooking, 
    INonContinousMultipleDatesBookingInfo 
} from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";

import { 
    MeetingEventsRoomTitle 
} from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


Connection();


interface INonContinousMultipleDatesBookingInfoRequestBody {
    eventMeetingRoomBookingInfoDetail: {
        cartInfo: {
            roomBookingDateType: 'Multiple Dates Non Continuous';
            meetingEventsInfoTitle: MeetingEventsRoomTitle;
            totalPriceOfAllDates: number;
            allDatesBookingInformation: IDateBooking[];
        };
    };
    transactionId: string;
}


async function POST(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        const loginUserId: string = params.userId;
        const customerId: string = loginUserId;
        const body: INonContinousMultipleDatesBookingInfoRequestBody = await request.json();

        
        const roomBookingDateType: "Multiple Dates Non Continuous" = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.roomBookingDateType;

        const meetingEventsInfoTitle: MeetingEventsRoomTitle = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventsInfoTitle;

        const totalPriceOfAllDates: number = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.totalPriceOfAllDates;

        const allDatesBookingInformation: IDateBooking[] = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.allDatesBookingInformation;

        const transactionId: string = body.transactionId;


        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const newNonContinousMultipleDatesEventMeetingBookingInfo: INonContinousMultipleDatesBookingInfo = 
                new NonContinousMultipleDatesBookingInfo({
                    customerId: new Types.ObjectId(customerId),
                    transactionId: new Types.ObjectId(transactionId),
                    roomBookingDateType,
                    meetingEventsInfoTitle,
                    totalPriceOfAllDates,
                    allDatesBookingInformation
                });

            await newNonContinousMultipleDatesEventMeetingBookingInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_NON_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL },
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    }
    catch(error){

        console.log('src/app/api/add-booking/meeting-events/multiple-dates-non-continous/[userId]/route.ts');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
        
    }
}

export { POST }