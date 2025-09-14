import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import SingleDateBookingInfo from "@/database models/booking models/events meetings models/singleDateBookingInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_SINGLE_DATE_EVENT_MEETING_ROOM_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { ISingleDateBookingInfo } from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";
import { 
    MeetingEventBookingTime,
    MeetingEventSeatingArrangement,
    MeetingEventsRoomTitle
} from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


Connection();


interface ISingleDateBookingInfoRequestBody {
    eventMeetingRoomBookingInfoDetail: {
        cartInfo: {
            roomBookingDateType: 'Single Date';
            meetingEventsInfoTitle: MeetingEventsRoomTitle;
            meetingEventBookingDate: string; // Can be Date in DB, but is passed as string
            meetingEventBookingTime: MeetingEventBookingTime[];
            meetingEventSeatingArrangement:MeetingEventSeatingArrangement;
            totalPriceOfAllRooms: number;
            maximumGuestAttending: number;
            wantFoodServices: "Yes" | "No";
            selectedMealsOnBookingDate: Map<string, string[]>;
            totalPriceEventMeetingRoom: number;
        };
    };
    transactionId: string;
}


async function POST(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        const loginUserId: string = params.userId;
        const customerId: string = loginUserId;
        const body: ISingleDateBookingInfoRequestBody = await request.json();
        

        const roomBookingDateType: "Single Date" = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.roomBookingDateType;

        const meetingEventsInfoTitle: MeetingEventsRoomTitle = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventsInfoTitle;

        const meetingEventBookingDate: string = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventBookingDate;

        const meetingEventBookingTime: MeetingEventBookingTime[] = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventBookingTime;

        const meetingEventSeatingArrangement: MeetingEventSeatingArrangement = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventSeatingArrangement;

        const maximumGuestAttending: number = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.maximumGuestAttending;

        const wantFoodServices: "Yes" | "No" = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.wantFoodServices;

        const selectedMealsOnBookingDate: Map<string, string[]> = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.selectedMealsOnBookingDate;

        const totalPriceEventMeetingRoom: number = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.totalPriceEventMeetingRoom;

        const transactionId: string = body.transactionId;


        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);


        if(hotelUser){
            const newSingleDateEventMeetingBookingInfo: ISingleDateBookingInfo = 
                new SingleDateBookingInfo({
                    customerId: new Types.ObjectId(customerId),
                    transactionId: new Types.ObjectId(transactionId),
                    roomBookingDateType,
                    meetingEventsInfoTitle,
                    meetingEventBookingDate: new Date(meetingEventBookingDate),
                    meetingEventBookingTime,
                    meetingEventSeatingArrangement,
                    maximumGuestAttending,
                    wantFoodServices,
                    selectedMealsOnBookingDate,
                    totalPriceEventMeetingRoom
                });

            await newSingleDateEventMeetingBookingInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_SINGLE_DATE_EVENT_MEETING_ROOM_SUCCESSFUL },
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

        console.log('src/app/api/add-booking/meeting-events/single-date/[userId]/route.ts');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );

    }
}

export { POST }