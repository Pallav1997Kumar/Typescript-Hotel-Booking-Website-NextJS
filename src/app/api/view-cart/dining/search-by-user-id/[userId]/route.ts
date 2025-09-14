import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import DiningCartInfo from "@/database models/booking models/dining models/diningCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    DINING_PRESENT_IN_CART, 
    DINING_CART_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";
import { IDiningCartInfo } from "@/interface/Dining Interface/diningDatabaseModelsInterface"; 


Connection();


async function GET(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try {
        const params = context.params;
        const loginUserId: string = params.userId;

        const hotelUser: IHotelCustomersUser | null = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const cartDiningUser: IDiningCartInfo[] = 
                await DiningCartInfo.find( { customerId: loginUserId } );

            if(cartDiningUser){
                if(cartDiningUser.length > 0){
                    return NextResponse.json(
                        { 
                            message: DINING_PRESENT_IN_CART, 
                            diningCartInfo: cartDiningUser 
                        },
                        { status: 200 }
                    );
                }
                else{
                    return NextResponse.json(
                        { message: DINING_CART_IS_EMPTY },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: DINING_CART_IS_EMPTY },
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