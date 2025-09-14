import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import SingleDateCartInfo from "@/database models/booking models/events meetings models/singleDateCartInfo";
import NonContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesCartInfo";
import ContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/continousMultipleDatesCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    EVENT_MEETING_ROOM_PRESENT_IN_CART, 
    EVENT_MEETING_ROOM_CART_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";

import { 
    ISingleDateCartInfo, 
    IContinousMultipleDatesCartInfo, 
    INonContinousMultipleDatesCartInfo 
} from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";


Connection();


async function GET(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try {
        const params = context.params;
        const loginUserId: string = params.userId;

        const hotelUser: IHotelCustomersUser | null = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const cartEventMeetingSingleDateUser: ISingleDateCartInfo[] = 
                await SingleDateCartInfo.find( { customerId: loginUserId } );
            const cartEventMeetingMultipleContinousDatesUser: IContinousMultipleDatesCartInfo[] = 
                await ContinousMultipleDatesCartInfo.find( { customerId: loginUserId } );
            const cartEventMeetingMultipleNonContinousDatesUser: INonContinousMultipleDatesCartInfo[] = 
                await NonContinousMultipleDatesCartInfo.find( { customerId: loginUserId } );

            if(cartEventMeetingSingleDateUser
                || cartEventMeetingMultipleContinousDatesUser
                || cartEventMeetingMultipleNonContinousDatesUser){

                if(cartEventMeetingSingleDateUser.length > 0 
                    || cartEventMeetingMultipleContinousDatesUser.length > 0 
                    || cartEventMeetingMultipleNonContinousDatesUser.length > 0){

                        const eventMeetingCartInfo = [
                            ...cartEventMeetingSingleDateUser,
                            ...cartEventMeetingMultipleContinousDatesUser,
                            ...cartEventMeetingMultipleNonContinousDatesUser
                        ]

                    return NextResponse.json(
                        { 
                            message: EVENT_MEETING_ROOM_PRESENT_IN_CART, 
                            eventMeetingCartInfo 
                        },
                        { status: 200 }
                    );
                }
                else{
                    return NextResponse.json(
                        { message: EVENT_MEETING_ROOM_CART_IS_EMPTY },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: EVENT_MEETING_ROOM_CART_IS_EMPTY },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET }