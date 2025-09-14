import { NextRequest, NextResponse } from 'next/server';

import Connection from "@/database config/config";

import HotelRoomSuiteBookingInfo from '@/database models/booking models/room suites models/hotelRoomSuiteBookingInfo';


import { 
    INTERNAL_SERVER_ERROR, 
    TRANSACTION_ID_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { TRANSACTION_SUCCESSFULLY_DELETED } from "@/constant string files/apiSuccessMessageConstants";


import { IContextTransactionId } from '@/interface/contextInterface';
import { IHotelRoomSuiteBookingInfo } from '@/interface/Rooms and Suites Interface/hotelRoomsSuitesBookingInterface';


Connection();

async function DELETE(request: NextRequest, context: IContextTransactionId) {
    try {
        const params = context.params;
        const transactionId: string = params.transactionId;

        const transactionInformation: IHotelRoomSuiteBookingInfo[] = await HotelRoomSuiteBookingInfo.find({
            transactionId: transactionId
        });
        
        if(transactionInformation && transactionInformation.length > 0){
            await HotelRoomSuiteBookingInfo.deleteMany({
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
        console.log('src/app/api/delete-booking-txnid/rooms-suites/[transactionId]/route.js');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { DELETE }