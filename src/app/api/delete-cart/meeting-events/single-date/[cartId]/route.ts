import { NextRequest, NextResponse } from 'next/server';

import Connection from "@/database config/config";

import SingleDateCartInfo from "@/database models/booking models/events meetings models/singleDateCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    CART_ID_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { ITEM_SUCCESSFULLY_DELETED_FROM_CART } from "@/constant string files/apiSuccessMessageConstants";


import { IContextCartId } from '@/interface/contextInterface';
import { ISingleDateCartInfo } from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";


Connection();


async function DELETE(request: NextRequest, context: IContextCartId): Promise<NextResponse> {
    try {
        const params = context.params;
        const cartId: string = params.cartId;

        const cartInformation: ISingleDateCartInfo | null = 
            await SingleDateCartInfo.findById(cartId);

        if(cartInformation){
            await SingleDateCartInfo.findByIdAndDelete(cartId);
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
        console.log('src/app/api/delete-cart/meeting-events/single-date/[userId]/route.ts');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { DELETE }