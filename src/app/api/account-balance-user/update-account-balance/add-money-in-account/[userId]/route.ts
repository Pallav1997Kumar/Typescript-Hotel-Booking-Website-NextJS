import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    SUCCESSFUL_AMOUNT_ADD_TO_ACCOUNT 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";


Connection();


interface IRequestBody {
    amountToBeAdded: number;
}

// Define the interface for the data to update
interface IUpdateInfo {
    accountBalance: number;
}


async function PATCH(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        const loginUserId: string = params.userId;
        const body: IRequestBody = await request.json();
        const amountToBeAdded: number = body.amountToBeAdded;

        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const beforeAccountBalance: number = hotelUser.accountBalance;
            const updatedAccountBalance: number = 
                Number(beforeAccountBalance) + Number(amountToBeAdded);
            
            const updatedInfo: IUpdateInfo = {
                accountBalance: updatedAccountBalance
            }
            const updatedHotelUser: IHotelCustomersUser | null = 
                await HotelCustomersUsers.findByIdAndUpdate(
                    loginUserId, 
                    { $set: updatedInfo }
                );

            if(updatedHotelUser){
                return NextResponse.json(
                    { message: SUCCESSFUL_AMOUNT_ADD_TO_ACCOUNT },
                    { status: 200 }
                );
            }
            else {
                return NextResponse.json(
                    { errorMessage: USER_NOT_FOUND },
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
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { PATCH };