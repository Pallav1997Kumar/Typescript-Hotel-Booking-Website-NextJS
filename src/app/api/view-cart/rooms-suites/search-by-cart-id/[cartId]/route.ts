import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import RoomsSuitesCartInfo from "@/database models/booking models/room suites models/roomsSuitesCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    CART_ID_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";


import { IContextCartId } from "@/interface/contextInterface";
import { IRoomsSuitesCartInfo } from '@/interface/Rooms and Suites Interface/roomsSuitesDbModelsInterface';


Connection();


async function GET(request: NextRequest, context: IContextCartId): Promise<NextResponse> {
    try{
        const params = context.params;
        const cartId: string = params.cartId;

        const roomsSuitesCartInfo: IRoomsSuitesCartInfo | null = 
            await RoomsSuitesCartInfo.findById(cartId);

        if(roomsSuitesCartInfo){
            return NextResponse.json(
                { cartInfo: roomsSuitesCartInfo }, 
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