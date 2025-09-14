import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import RoomsSuitesCartInfo from "@/database models/booking models/room suites models/roomsSuitesCartInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    ROOMS_SUITES_PRESENT_IN_CART, 
    ROOMS_SUITES_CART_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IRoomsSuitesCartInfo } from '@/interface/Rooms and Suites Interface/roomsSuitesDbModelsInterface';
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";


Connection();


async function GET(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try {
        const params = context.params;
        const loginUserId: string = params.userId;

        const hotelUser: IHotelCustomersUser | null = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const cartRoomSuiteUser: IRoomsSuitesCartInfo[] = 
                await RoomsSuitesCartInfo.find( { customerId: loginUserId } );

            if(cartRoomSuiteUser){
                
                if(cartRoomSuiteUser.length > 0){
                    return NextResponse.json(
                        { 
                            message: ROOMS_SUITES_PRESENT_IN_CART, 
                            roomSuiteCartInfo: cartRoomSuiteUser 
                        },
                        { status: 200 }
                    );
                }

                else{
                    return NextResponse.json(
                        { message: ROOMS_SUITES_CART_IS_EMPTY },
                        { status: 200 }
                    );
                }
            }
            else{
                return NextResponse.json(
                    { message: ROOMS_SUITES_CART_IS_EMPTY },
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
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET };