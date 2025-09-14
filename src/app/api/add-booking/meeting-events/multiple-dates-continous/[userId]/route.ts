import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import ContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/continousMultipleDatesBookingInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";
import { IContinousMultipleDatesBookingInfo } from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";
import { 
    MeetingEventBookingTime,
    MeetingEventSeatingArrangement,
    MeetingEventsRoomTitle
} from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


Connection();


interface IContinousMultipleDatesBookingInfoRequestBody {
    eventMeetingRoomBookingInfoDetail: {
        cartInfo: {
            roomBookingDateType: 'Multiple Dates Continuous';
            meetingEventsInfoTitle: MeetingEventsRoomTitle;
            meetingEventStartBookingDate: string; // Can be Date in DB, but is passed as string
            meetingEventEndBookingDate: string; // Can be Date in DB, but is passed as string
            meetingEventBookingTime: MeetingEventBookingTime[];
            meetingEventSeatingArrangement: MeetingEventSeatingArrangement;
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
        const body: IContinousMultipleDatesBookingInfoRequestBody = await request.json();
        

        const roomBookingDateType: "Multiple Dates Continuous" = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.roomBookingDateType;

        const meetingEventsInfoTitle: MeetingEventsRoomTitle = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventsInfoTitle;

        const meetingEventStartBookingDate: string = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventStartBookingDate;

        const meetingEventEndBookingDate: string = 
            body.eventMeetingRoomBookingInfoDetail.cartInfo.meetingEventEndBookingDate;

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
            const newContinousMultipleDatesEventMeetingBookingInfo: IContinousMultipleDatesBookingInfo = 
                new ContinousMultipleDatesBookingInfo({
                    customerId: new Types.ObjectId(customerId),
                    transactionId: new Types.ObjectId(transactionId),
                    roomBookingDateType,
                    meetingEventsInfoTitle,
                    meetingEventStartBookingDate: new Date(meetingEventStartBookingDate),
                    meetingEventEndBookingDate: new Date(meetingEventEndBookingDate),
                    meetingEventBookingTime,
                    meetingEventSeatingArrangement,
                    maximumGuestAttending,
                    wantFoodServices,
                    selectedMealsOnBookingDate,
                    totalPriceEventMeetingRoom
                });

            await newContinousMultipleDatesEventMeetingBookingInfo.save();
            return NextResponse.json(
                { message: INFORMATION_ADD_TO_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL },
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

        console.log('src/app/api/add-booking/meeting-events/multiple-dates-continous/[userId]/route.ts');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );

    }
}

export { POST }