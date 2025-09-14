import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import NonContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesCartInfo";

import { 
    INTERNAL_SERVER_ERROR, 
    CART_ID_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { IContextCartId } from "@/interface/contextInterface";
import { INonContinousMultipleDatesCartInfo } from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";


Connection();


async function GET(request: NextRequest, context: IContextCartId): Promise<NextResponse> {
    try{
        const params = context.params;
        const cartId: string = params.cartId;

        const eventMeetingNonContinousMultipleDatesCartInfo: INonContinousMultipleDatesCartInfo | null = 
            await NonContinousMultipleDatesCartInfo.findById(cartId);

        if(eventMeetingNonContinousMultipleDatesCartInfo){
            return NextResponse.json(
                { cartInfo: eventMeetingNonContinousMultipleDatesCartInfo }, 
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: CART_ID_NOT_FOUND }, 
                { status: 404 }
            );
        }
    }
    catch (error){
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { GET };