import { NextRequest, NextResponse } from 'next/server';

import Connection from "@/database config/config";

import DiningBookingInfo from '@/database models/booking models/dining models/diningBookingInfo';


import { 
    INTERNAL_SERVER_ERROR, 
    TRANSACTION_ID_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { TRANSACTION_SUCCESSFULLY_DELETED } from "@/constant string files/apiSuccessMessageConstants";


import { IContextTransactionId } from '@/interface/contextInterface';
import { IDiningBookingInfo } from '@/interface/Dining Interface/diningDatabaseModelsInterface';


Connection();

async function DELETE(request: NextRequest, context: IContextTransactionId) {
    try {
        const params = context.params;
        const transactionId: string = params.transactionId;

        const transactionInformation: IDiningBookingInfo[] = await DiningBookingInfo.find({
            transactionId: transactionId
        });
        
        if(transactionInformation && transactionInformation.length > 0){
            await DiningBookingInfo.deleteMany({
                transactionId: transactionId
            });
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
    } 
    catch (error) {
        console.log('src/app/api/delete-booking-txnid/dining/[transactionId]/route.js');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { DELETE }