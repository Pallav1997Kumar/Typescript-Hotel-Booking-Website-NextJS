import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import SingleDateCartInfo from "@/database models/booking models/events meetings models/singleDateCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_CART_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { ISingleDateCartInfo } from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";
import { 
    MeetingEventBookingTime,
    MeetingEventSeatingArrangement,
    MeetingEventsRoomTitle
} from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


Connection();


interface ISingleDateBookingInfoRequestBody {
    eventCartId: number;
    roomBookingDateType: 'Single Date';
    meetingEventsInfoTitle: MeetingEventsRoomTitle;
    meetingEventBookingDate: Date;
    meetingEventBookingTime: MeetingEventBookingTime[];
    meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
    maximumGuestAttending: number;
    wantFoodServices: "Yes" | "No";
    selectedMealsOnBookingDate: Map<string, string[]>;
    totalPriceEventMeetingRoom: number;
}


async function POST(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        const loginUserId: string = params.userId;
        const customerId: string = loginUserId;
        const body: ISingleDateBookingInfoRequestBody = await request.json();
        
        const eventCartId: number = body.eventCartId;
        const roomBookingDateType: "Single Date" = body.roomBookingDateType;
        const meetingEventsInfoTitle: MeetingEventsRoomTitle = body.meetingEventsInfoTitle;
        const meetingEventBookingDate: Date = body.meetingEventBookingDate;
        const meetingEventBookingTime: MeetingEventBookingTime[] = body.meetingEventBookingTime;
        const meetingEventSeatingArrangement: MeetingEventSeatingArrangement = body.meetingEventSeatingArrangement;
        const maximumGuestAttending: number = body.maximumGuestAttending;
        const wantFoodServices: "Yes" | "No" = body.wantFoodServices;
        const selectedMealsOnBookingDate: Map<string, string[]> = body.selectedMealsOnBookingDate;
        const totalPriceEventMeetingRoom: number = body.totalPriceEventMeetingRoom;

        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const newSingleDateEventMeetingCartInfo: ISingleDateCartInfo = new SingleDateCartInfo({
                customerId: new Types.ObjectId(customerId),
                eventCartId,
                roomBookingDateType,
                meetingEventsInfoTitle,
                meetingEventBookingDate,
                meetingEventBookingTime,
                meetingEventSeatingArrangement,
                maximumGuestAttending,
                wantFoodServices,
                selectedMealsOnBookingDate,
                totalPriceEventMeetingRoom
            });

            await newSingleDateEventMeetingCartInfo.save();
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

export { POST };