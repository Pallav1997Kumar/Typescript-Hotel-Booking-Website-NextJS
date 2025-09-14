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
    SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_TRANSACTION 
} from "@/constant string files/apiSuccessMessageConstants";


import { 
    IHotelCustomersUser, 
    IHotelCustomerTransaction 
} from "@/interface/hotelCustomersInterface";


Connection();

interface ITransactionInfo {
    customerId: string;
    deductionAmount: number;
}


async function POST(request: NextRequest): Promise<NextResponse> {
    try{
        const body = await request.json();
        const transactionInfo: ITransactionInfo = body;

        const customerId: string = transactionInfo.customerId;
        const roomSuiteBookingAmount: number = transactionInfo.deductionAmount;

        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findById(customerId);

        if(hotelUser){
            const transactionAmount: number = roomSuiteBookingAmount; 
            const transactionType: string = 'Money Deducted From Account';
            const transactionDescription: string = 'Money Deducted From Account By Rooms and Suites Booking';
            const transactionDateTime: Date = new Date();
            const beforeAccountBalance: number = hotelUser.accountBalance;
            const updatedAccountBalance: number = Number(beforeAccountBalance) - Number(roomSuiteBookingAmount);

            const newTransactionAmountDeduct: IHotelCustomerTransaction = 
            new HotelCustomersTransaction({
                customerId: new Types.ObjectId(customerId),
                transactionAmount,
                transactionType,
                transactionDescription,
                transactionDateTime,
                updatedAccountBalance
            });
            await newTransactionAmountDeduct.save();
            const transactionId = newTransactionAmountDeduct._id;
            return NextResponse.json(
                { 
                    message: SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_TRANSACTION, 
                    transactionId 
                },
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

        console.log('src/app/api/account-balance-user/add-transaction-amount-deduct-account/rooms-suites-transaction/route');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
        
    }
}

export { POST }