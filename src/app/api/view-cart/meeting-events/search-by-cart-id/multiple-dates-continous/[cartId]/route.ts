import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import ContinousMultipleDatesCartInfo from "@/database models/booking models/events meetings models/continousMultipleDatesCartInfo";

import { 
    INTERNAL_SERVER_ERROR, 
    CART_ID_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { IContextCartId } from "@/interface/contextInterface";
import { IContinousMultipleDatesCartInfo } from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";


Connection();



async function GET(request: NextRequest, context: IContextCartId): Promise<NextResponse> {
    try{
        const params = context.params;
        const cartId: string = params.cartId;

        const eventMeetingContinousMultipleDatesCartInfo: IContinousMultipleDatesCartInfo | null = 
            await ContinousMultipleDatesCartInfo.findById(cartId);

        if(eventMeetingContinousMultipleDatesCartInfo){
            return NextResponse.json(
                { cartInfo: eventMeetingContinousMultipleDatesCartInfo }, 
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