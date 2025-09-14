import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

    import { 
    SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";


Connection();


interface IUpdateInfo{
    accountBalance: number;
}

interface ITransactionInfo {
    deductionAmount: number;
}


async function PATCH(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        const loginUserId: string = params.userId;

        const body = await request.json();
        const transactionInfo: ITransactionInfo = body;

        const deductionAmount: number = transactionInfo.deductionAmount;

        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const beforeAccountBalance: number = hotelUser.accountBalance;
            const updatedAccountBalance: number = 
                Number(beforeAccountBalance) - Number(deductionAmount);
            
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
                    { message: SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT },
                    { status: 200 }
                );
            }
            else{
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

        console.log('src/app/api/account-balance-user/update-account-balance/deduct-money-from-account/[userId]/route')
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );

    }
}

export { PATCH }