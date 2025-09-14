import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import HotelCustomersTransaction from "@/database models/hotelCustomersTransaction";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    SUCCESSFUL_AMOUNT_ADD_TRANSACTION 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { 
    IHotelCustomerTransaction, 
    IHotelCustomersUser 
} from "@/interface/hotelCustomersInterface";


// Ensure that the connection is established
Connection();

// Define the types for the body structure
interface IRequestBody {
    amountToBeAdded: number;
}


async function POST(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        const loginUserId: string = params.userId;
        const body: IRequestBody = await request.json();
        const amountToBeAdded: number = body.amountToBeAdded;

        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const customerId: Types.ObjectId = new Types.ObjectId(loginUserId);;
            const transactionAmount: number = amountToBeAdded; 
            const transactionType: string = 'Money Credited To Account';
            const transactionDescription: string = 'Money Added To Account By Add Money To Account Option';
            const transactionDateTime: Date = new Date();
            const beforeAccountBalance: number = hotelUser.accountBalance;
            const updatedAccountBalance: number = Number(beforeAccountBalance) + Number(amountToBeAdded);

            const newTransactionAmountAdd: IHotelCustomerTransaction = 
            new HotelCustomersTransaction({
                customerId,
                transactionAmount,
                transactionType,
                transactionDescription,
                transactionDateTime,
                updatedAccountBalance
            });

            await newTransactionAmountAdd.save();

            return NextResponse.json(
                { message: SUCCESSFUL_AMOUNT_ADD_TRANSACTION },
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
    catch(error){
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST }