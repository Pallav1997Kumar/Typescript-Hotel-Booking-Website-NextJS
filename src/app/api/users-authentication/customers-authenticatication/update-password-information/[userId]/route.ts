import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";

import Connection from "@/database config/config";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND, 
    UPDATE_PASSWORD, 
    JWT_TOKEN_IS_MISSING 
} from "@/constant string files/apiErrorMessageConstants";

import { PASSWORD_UPDATED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";


Connection();


interface UpdateUserRequestBody {
    oldPassword: string;  
    newPassword: string;
}

interface UpdateUserInfo {
    password: string;
}

async function PATCH(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    const cookiesStore = await cookies();
    const jwtTokenObject = cookiesStore.get('jwt-token');

    if (!jwtTokenObject) {
        return NextResponse.json(
            { errorMessage: JWT_TOKEN_IS_MISSING },
            { status: 401 }
        );
    }

    const jwtToken = jwtTokenObject.value;

    try{
        const params = context.params;
        const loginUserId: string = params.userId;
        const body: UpdateUserRequestBody = await request.json();

        const oldPassword: string = body.oldPassword;
        const newPassword: string = body.newPassword;
        
        const hotelUser: IHotelCustomersUser | null = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const dbStoredPassword: string = hotelUser.password;

            if(oldPassword === dbStoredPassword){
                const updatedInfo: UpdateUserInfo = {
                    password: newPassword,
                }

                const updatedHotelUser: IHotelCustomersUser | null = await HotelCustomersUsers.findByIdAndUpdate(loginUserId, {
                    $set: updatedInfo
                });
                return NextResponse.json(
                    { message: PASSWORD_UPDATED_SUCCESSFULLY },
                    { status: 200 }
                );
            }
            else{
                return NextResponse.json(
                    { errorMessage: UPDATE_PASSWORD.INCORRECT_OLD_PASSWORD },
                    { status: 404 }
                );
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    }
    catch(error){
        return NextResponse.json(
            { error: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { PATCH };