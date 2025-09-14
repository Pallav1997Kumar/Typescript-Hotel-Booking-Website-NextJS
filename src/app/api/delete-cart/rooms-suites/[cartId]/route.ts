import { NextRequest, NextResponse } from 'next/server';

import Connection from "@/database config/config";

import RoomsSuitesCartInfo from "@/database models/booking models/room suites models/roomsSuitesCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    CART_ID_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { ITEM_SUCCESSFULLY_DELETED_FROM_CART } from "@/constant string files/apiSuccessMessageConstants";

import { IContextCartId } from '@/interface/contextInterface';
import { IRoomsSuitesCartInfo } from '@/interface/Rooms and Suites Interface/roomsSuitesDbModelsInterface';


Connection();


async function DELETE(request: NextRequest, context: IContextCartId): Promise<NextResponse> {
    try {
        const params = context.params;
        const cartId: string = params.cartId;

        const cartInformation: IRoomsSuitesCartInfo | null = 
            await RoomsSuitesCartInfo.findById(cartId);

        if(cartInformation){
            await RoomsSuitesCartInfo.findByIdAndDelete(cartId);
            return NextResponse.json(
                { message: ITEM_SUCCESSFULLY_DELETED_FROM_CART }, 
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
    catch (error) {
        console.log('src/app/api/delete-cart/rooms-suites/[cartId]/route.ts');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { DELETE };