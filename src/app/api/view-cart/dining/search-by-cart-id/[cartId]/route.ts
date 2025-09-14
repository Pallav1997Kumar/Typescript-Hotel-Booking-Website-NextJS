import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import DiningCartInfo from "@/database models/booking models/dining models/diningCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    CART_ID_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";


import { IContextCartId } from "@/interface/contextInterface";
import { IDiningCartInfo } from "@/interface/Dining Interface/diningDatabaseModelsInterface";


Connection();


async function GET(request: NextRequest, context: IContextCartId): Promise<NextResponse> {
    try{
        const params = context.params;
        const cartId: string = params.cartId;

        const diningCartInfo: IDiningCartInfo | null = await DiningCartInfo.findById(cartId);

        if(diningCartInfo){
            return NextResponse.json(
                { cartInfo: diningCartInfo }, 
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