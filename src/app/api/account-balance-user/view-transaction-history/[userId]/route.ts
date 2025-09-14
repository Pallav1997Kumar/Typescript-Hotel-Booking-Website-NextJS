import { NextRequest, NextResponse } from 'next/server';
import { Types } from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersTransaction from "@/database models/hotelCustomersTransaction";


import { 
    INTERNAL_SERVER_ERROR 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    TRANSACTION_HISTORY_FOUND, 
    NO_TRANSACTION_HISTORY_FOUND 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from '@/interface/contextInterface';
import { IHotelCustomerTransaction } from "@/interface/hotelCustomersInterface";


Connection();


async function GET(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        const loginUserId: string = params.userId;

        const userTransactionHistory: IHotelCustomerTransaction[] = 
            await HotelCustomersTransaction.find({ 
                customerId: new Types.ObjectId(loginUserId) 
            });
        
        if(userTransactionHistory){
            if(userTransactionHistory.length > 0){
                return NextResponse.json(
                    { 
                        message: TRANSACTION_HISTORY_FOUND, 
                        transactionHistory: userTransactionHistory
                    },
                    { status: 200 }
                );
            }
            else{
                return NextResponse.json(
                    { message: NO_TRANSACTION_HISTORY_FOUND },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { message: NO_TRANSACTION_HISTORY_FOUND },
                { status: 200 }
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

export { GET }