import { NextRequest, NextResponse } from 'next/server';

import Connection from "@/database config/config";

import HotelCustomersTransaction from '@/database models/hotelCustomersTransaction';


import { 
    INTERNAL_SERVER_ERROR, 
    TRANSACTION_ID_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    TRANSACTION_SUCCESSFULLY_DELETED 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextTransactionId } from '@/interface/contextInterface';
import { IHotelCustomerTransaction } from '@/interface/hotelCustomersInterface';


Connection();


async function DELETE(request: NextRequest, context: IContextTransactionId) {
    try {
        const params = context.params;
        const transactionId: string = params.transactionId;

        const hotelCustomersTransactionInformation: IHotelCustomerTransaction | null = 
            await HotelCustomersTransaction.findById(transactionId);

        if(hotelCustomersTransactionInformation){
            await HotelCustomersTransaction.findByIdAndDelete(transactionId);
            return NextResponse.json(
                { message: TRANSACTION_SUCCESSFULLY_DELETED }, 
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: TRANSACTION_ID_NOT_FOUND }, 
                { status: 404 }
            );
        }

    } catch (error) {
        console.log('src/app/api/account-balance-user/delete-transaction/[transactionId]/route');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { DELETE }