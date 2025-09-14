import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import NonContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_CART_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";
import { 
    IDateBooking, 
    INonContinousMultipleDatesCartInfo 
} from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";
import { 
    MeetingEventsRoomTitle 
} from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


Connection();


interface INonContinousMultipleDatesCartInfoRequestBody {
    eventCartId: number;
    roomBookingDateType: 'Multiple Dates Non Continuous';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    totalPriceOfAllDates: number;
    allDatesBookingInformation: IDateBooking[];
}

async function POST(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        const loginUserId: string = params.userId;
        const customerId: string = loginUserId;
        const body: INonContinousMultipleDatesCartInfoRequestBody = await request.json();
        
        const eventCartId: number = body.eventCartId;
        const roomBookingDateType: "Multiple Dates Non Continuous" = body.roomBookingDateType;
        const meetingEventsInfoTitle: MeetingEventsRoomTitle = body.meetingEventsInfoTitle;
        const totalPriceOfAllDates: number = body.totalPriceOfAllDates;
        const allDatesBookingInformation: IDateBooking[] = body.allDatesBookingInformation;

        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const newNonContinousMultipleDatesEventMeetingCartInfo: INonContinousMultipleDatesCartInfo = 
                new NonContinousMultipleDatesCartInfo({
                    customerId: new Types.ObjectId(customerId),
                    eventCartId,
                    roomBookingDateType,
                    meetingEventsInfoTitle,
                    totalPriceOfAllDates,
                    allDatesBookingInformation
                });

            await newNonContinousMultipleDatesEventMeetingCartInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_CART_SUCCESSFUL },
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
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST }