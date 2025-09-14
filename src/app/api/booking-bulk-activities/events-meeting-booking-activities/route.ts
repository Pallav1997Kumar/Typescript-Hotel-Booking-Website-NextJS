import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";


import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";

import { 
    INTERNAL_SERVER_ERROR, 
    INVALID_BOOKING_PAYLOAD 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_SINGLE_DATE_EVENT_MEETING_ROOM_SUCCESSFUL,
    INFORMATION_ADD_TO_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL,
    INFORMATION_ADD_TO_NON_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL, 
    SUCCESSFUL_AMOUNT_DEDUCT_EVENT_MEETING_ROOM_TRANSACTION, 
    SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT, 
    EVENT_AND_MEETING_ROOMS_BOOKING_PROCESS_SUCCESSFUL, 
    EVENT_MEETING_BOOKING_LOCKED_SUCCESSFULLY,
    EVENT_MEETING_BOOKING_UNLOCKED_SUCCESSFULLY,
    ITEM_SUCCESSFULLY_DELETED_FROM_CART
} from "@/constant string files/apiSuccessMessageConstants";


import { 
    IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, 
    IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, 
    IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
} from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";

import { 
    EventMeetingBookingAddBookingApiResponse, 
    EventMeetingBookingDeductMoneyFromWalletApiResponse, 
    EventMeetingBookingDeleteCartApiResponse, 
    EventMeetingBookingLockCheckingApiResponse, 
    EventMeetingBookingTransactionCreationApiResponse, 
    EventMeetingBookingUnlockAddBookingApiResponse 
} from "@/interface/Event Meeting Interface/eventMeetingBookingBulkActivitiesApiResponse";


interface ITransactionInfo {
    customerId: Types.ObjectId;
    deductionAmount: number;
}


interface IEventMeetingRoomBookingInfo {
    eventMeetingRoomBookingInfoDetail: 
        | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
        | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
        | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse;
    transactionId: string;
}


Connection();


async function POST(request: NextRequest) {
    try {
        const body: (
            IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | 
            IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | 
            IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
        )[] = await request.json();

        const allEventMeetingBookingInfo: (
            IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | 
            IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | 
            IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
        )[] = body;

        if (!Array.isArray(allEventMeetingBookingInfo) || allEventMeetingBookingInfo.length === 0) {
            return NextResponse.json(
                { errorMessage: INVALID_BOOKING_PAYLOAD }, 
                { status: 400 }
            );
        }

        const eventMeetingBookingAmount: number = allEventMeetingBookingInfo.reduce(
            function (
                total: number, 
                eachEventMeetingBookingInfo: 
                    | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
            ) {
                let price: number = 0;
                if ('totalPriceEventMeetingRoom' in eachEventMeetingBookingInfo.cartInfo) {
                    price = eachEventMeetingBookingInfo.cartInfo.totalPriceEventMeetingRoom || 0;
                } else if ('totalPriceOfAllDates' in eachEventMeetingBookingInfo.cartInfo) {
                    price = eachEventMeetingBookingInfo.cartInfo.totalPriceOfAllDates || 0;
                }
                return total + price;
            }, 
            0
        );
        
        const customerId: Types.ObjectId = allEventMeetingBookingInfo[0].cartInfo.customerId;

        const transactionInfo: ITransactionInfo = {
            customerId: customerId,
            deductionAmount: eventMeetingBookingAmount
        };



        // Step 1: Lock all bookings in parallel starts

        const responseEventMeetingLockChecking: (Response | undefined)[] = await Promise.all(
            allEventMeetingBookingInfo.map(function (
                eachEventMeetingBookingInfo: 
                    | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
            ) {

                if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) {
                    //SINGLE_DATE Lock Checking
                    return fetch(`${process.env.URL}/api/hotel-add-booking/event-meeting/single-date/lock-checking`, {
                        method: 'POST',
                        body: JSON.stringify(eachEventMeetingBookingInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }

                else if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) {
                    //MULTIPLE_DATES_CONTINOUS Lock Checking
                    return fetch(`${process.env.URL}/api/hotel-add-booking/event-meeting/multiple-dates-continous/lock-checking`, {
                        method: 'POST',
                        body: JSON.stringify(eachEventMeetingBookingInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }

                else if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) {
                    //MULTIPLE_DATES_NON_CONTINOUS Lock Checking
                    return fetch(`${process.env.URL}/api/hotel-add-booking/event-meeting/multiple-dates-non-continous/lock-checking`, {
                        method: 'POST',
                        body: JSON.stringify(eachEventMeetingBookingInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }                

            })
        );


        for(let i = 0; i < responseEventMeetingLockChecking.length; i++){
            const responseLockChecking = responseEventMeetingLockChecking[i];
            if(!responseLockChecking){
                throw new Error("responseLockChecking is undefined");
            }
            const dataEventMeetingLockChecking: EventMeetingBookingLockCheckingApiResponse = 
                await responseLockChecking.json();        
            if(responseLockChecking.status !== 200 ||
                ('message' in dataEventMeetingLockChecking && 
                dataEventMeetingLockChecking.message !== EVENT_MEETING_BOOKING_LOCKED_SUCCESSFULLY)
            ){
                await rollbackLocks(allEventMeetingBookingInfo);
                if('errorMessage' in dataEventMeetingLockChecking){
                    return NextResponse.json(
                        { errorMessage: dataEventMeetingLockChecking.errorMessage }, 
                        { status: responseLockChecking.status }
                    );
                }
            }
        }

        // Step 1: Lock all bookings in parallel ends


        // await wait(100000);


        // Step 2: Create transaction record starts

        const responseEventMeetingRoomTransaction: Response = await fetch(
            `${process.env.URL}/api/account-balance-user/add-transaction-amount-deduct-account/event-meeting-room-transaction`, 
            {
                method: 'POST',
                body: JSON.stringify(transactionInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }
        );
        const dataEventMeetingRoomTransaction: EventMeetingBookingTransactionCreationApiResponse = 
            await responseEventMeetingRoomTransaction.json();
        
        if (responseEventMeetingRoomTransaction.status !== 200 || 
            ('message' in dataEventMeetingRoomTransaction && 
            dataEventMeetingRoomTransaction.message !== SUCCESSFUL_AMOUNT_DEDUCT_EVENT_MEETING_ROOM_TRANSACTION)
        ) {
            await rollbackLocks(allEventMeetingBookingInfo);
            if('errorMessage' in dataEventMeetingRoomTransaction){
                return NextResponse.json(
                    { errorMessage: dataEventMeetingRoomTransaction.errorMessage }, 
                    { status: responseEventMeetingRoomTransaction.status }
                );
            }
        }

        let transactionId: undefined | string;
        if('transactionId' in dataEventMeetingRoomTransaction){
            transactionId = dataEventMeetingRoomTransaction.transactionId;
        }

        if(!transactionId){
            throw new Error("transactionId is missing");
        }

        // Step 2: Create transaction record ends



        // Step 3: Deduct money from wallet starts

        const responseDeductMoneyFromAccount: Response = await fetch(
            `${process.env.URL}/api/account-balance-user/update-account-balance/deduct-money-from-account/${customerId}`, 
            {
                method: 'PATCH',
                body: JSON.stringify(transactionInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }
        );
        const dataDeductMoneyFromAccount: EventMeetingBookingDeductMoneyFromWalletApiResponse = 
            await responseDeductMoneyFromAccount.json();
        
        if (responseDeductMoneyFromAccount.status !== 200 || 
            ('message' in dataDeductMoneyFromAccount && 
            dataDeductMoneyFromAccount.message !== SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT)
        ) {            
            await rollbackLocks(allEventMeetingBookingInfo);
            await rollbackTransaction(transactionId);
            if('errorMessage' in dataDeductMoneyFromAccount){
                return NextResponse.json(
                    { errorMessage: dataDeductMoneyFromAccount.errorMessage }, 
                    { status: responseDeductMoneyFromAccount.status }
                );
            }
        }

        // Step 3: Deduct money from wallet ends



        // Step 4: Unclock Event Meeting and Add to Hotel Booking starts

        const responseUnlockEventMeetingAddBooking: (Response | undefined)[] = await Promise.all(
            allEventMeetingBookingInfo.map(function (
                eachEventMeetingBookingInfo: 
                    | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
            ) {

                if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) {
                    // SINGLE_DATE Unlock Add Booking
                    return fetch(`${process.env.URL}/api/hotel-add-booking/event-meeting/single-date/unlock-add-booking`, {
                        method: 'POST',
                        body: JSON.stringify(eachEventMeetingBookingInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }

                else if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) {
                    // MULTIPLE_DATES_CONTINOUS Unlock Add Booking
                    return fetch(`${process.env.URL}/api/hotel-add-booking/event-meeting/multiple-dates-continous/unlock-add-booking`, {
                        method: 'POST',
                        body: JSON.stringify(eachEventMeetingBookingInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }  
                
                else if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) {
                    // MULTIPLE_DATES_NON_CONTINOUS Unlock Add Booking
                    return fetch(`${process.env.URL}/api/hotel-add-booking/event-meeting/multiple-dates-non-continous/unlock-add-booking`, {
                        method: 'POST',
                        body: JSON.stringify(eachEventMeetingBookingInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }

            })
        );


        for(let i = 0; i < responseUnlockEventMeetingAddBooking.length; i++){
            const responseUnlockAddBooking: Response | undefined = responseUnlockEventMeetingAddBooking[i];
            if(!responseUnlockAddBooking){
                throw new Error("responseUnlockAddBooking is undefined");
            }
            const dataUnlockEventMeetingAddBooking: EventMeetingBookingUnlockAddBookingApiResponse = 
                await responseUnlockAddBooking.json();
            if(responseUnlockAddBooking.status !== 200 ||
                ('message' in dataUnlockEventMeetingAddBooking && 
                dataUnlockEventMeetingAddBooking.message !== EVENT_MEETING_BOOKING_UNLOCKED_SUCCESSFULLY)
            ){
                await rollbackPayment(customerId, eventMeetingBookingAmount);
                await rollbackTransaction(transactionId);
                await rollbackLocks(allEventMeetingBookingInfo);
                if('errorMessage' in dataUnlockEventMeetingAddBooking){
                    return NextResponse.json(
                        { errorMessage: dataUnlockEventMeetingAddBooking.errorMessage }, 
                        { status: responseUnlockAddBooking.status }
                    );
                }
            }
        }

        // Step 4: Unclock Event Meeting and Add to Hotel Booking ends



        // Step 5: Add to Customer Booking starts

        const responseEventMeetingRoomBooking: (Response | undefined)[] = await Promise.all(
            allEventMeetingBookingInfo.map(function(
                eachEventMeetingBookingInfo: 
                    | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
            ) {

                const eventMeetingRoomBookingInfo: IEventMeetingRoomBookingInfo = {
                    eventMeetingRoomBookingInfoDetail: eachEventMeetingBookingInfo,
                    transactionId: transactionId
                };

                if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) {
                    //SINGLE_DATE Add Booking
                    return fetch(`${process.env.URL}/api/add-booking/meeting-events/single-date/${customerId}`, {
                        method: 'POST',
                        body: JSON.stringify(eventMeetingRoomBookingInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }

                else if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) {
                    //MULTIPLE_DATES_CONTINOUS Add Booking
                    return fetch(`${process.env.URL}/api/add-booking/meeting-events/multiple-dates-continous/${customerId}`, {
                        method: 'POST',
                        body: JSON.stringify(eventMeetingRoomBookingInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }

                else if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) {
                    //MULTIPLE_DATES_NON_CONTINOUS Add Booking
                    return fetch(`${process.env.URL}/api/add-booking/meeting-events/multiple-dates-non-continous/${customerId}`, {
                        method: 'POST',
                        body: JSON.stringify(eventMeetingRoomBookingInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }

            })
        );


        for(let i = 0; i < responseEventMeetingRoomBooking.length; i++){
            const responseRoomBooking: Response | undefined = responseEventMeetingRoomBooking[i];
            if(!responseRoomBooking){
                throw new Error("responseRoomBooking is missing");
            }
            const dataEventMeetingRoomBooking: EventMeetingBookingAddBookingApiResponse = 
                await responseRoomBooking.json();
            const eventMeetingRoomBookingSuccessMessage: string[] = [
                INFORMATION_ADD_TO_SINGLE_DATE_EVENT_MEETING_ROOM_SUCCESSFUL,
                INFORMATION_ADD_TO_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL,
                INFORMATION_ADD_TO_NON_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL,
            ];
            if (responseRoomBooking.status !== 200 || 
                ('message' in dataEventMeetingRoomBooking && 
                !eventMeetingRoomBookingSuccessMessage.includes(dataEventMeetingRoomBooking.message))
            ) {
                await rollbackPayment(customerId, eventMeetingBookingAmount);
                await rollbackTransaction(transactionId);
                await deleteSingleDateEventMeetingBookingTransaction(transactionId);
                await deleteMultipleDatesContinousEventMeetingBookingTransaction(transactionId);
                await deleteMultipleDatesNonContinousEventMeetingBookingTransaction(transactionId);
                if('errorMessage' in dataEventMeetingRoomBooking){
                    return NextResponse.json(
                        { errorMessage: dataEventMeetingRoomBooking.errorMessage }, 
                        { status: responseRoomBooking.status }
                    );
                }
            }
        }

        // Step 5: Add to Customer Booking ends



        // Step 6: Delete From Cart starts

        const responseDeleteEventMeetingRoomCartInfo: (Response | undefined)[] = await Promise.all(
            allEventMeetingBookingInfo.map(function(
                eachEventMeetingBookingInfo: 
                    | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
            ) {
                const cartId: string = eachEventMeetingBookingInfo.cartInfo._id;

                if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) {
                    //SINGLE_DATE Delete From Cart
                    return fetch(`${process.env.URL}/api/delete-cart/meeting-events/single-date/${cartId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }

                else if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) {
                    //MULTIPLE_DATES_CONTINOUS Delete From Cart
                    return fetch(`${process.env.URL}/api/delete-cart/meeting-events/multiple-dates-continous/${cartId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }

                else if(eachEventMeetingBookingInfo.cartInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) {
                    //MULTIPLE_DATES_NON_CONTINOUS Delete From Cart
                    return fetch(`${process.env.URL}/api/delete-cart/meeting-events/multiple-dates-non-continous/${cartId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                }

            })
        );


        for(let i = 0; i < responseDeleteEventMeetingRoomCartInfo.length; i++){
            const responseDeleteCartInfo: Response | undefined = responseDeleteEventMeetingRoomCartInfo[i];
            if(!responseDeleteCartInfo){
                throw new Error("responseDeleteCartInfo is missing");
            }
            const dataDeleteEventMeetingRoomCartInfo: EventMeetingBookingDeleteCartApiResponse = 
                await responseDeleteCartInfo.json();
            if (responseDeleteCartInfo.status !== 200 || 
                ('message' in dataDeleteEventMeetingRoomCartInfo && 
                dataDeleteEventMeetingRoomCartInfo.message !== ITEM_SUCCESSFULLY_DELETED_FROM_CART)
            ) {
                if('errorMessage' in dataDeleteEventMeetingRoomCartInfo){
                    return NextResponse.json(
                        { errorMessage: dataDeleteEventMeetingRoomCartInfo.errorMessage }, 
                        { status: responseDeleteCartInfo.status }
                    );
                }
            }
        }

        // Step 6: Delete From Cart ends


        return NextResponse.json(
            { message: EVENT_AND_MEETING_ROOMS_BOOKING_PROCESS_SUCCESSFUL },
            { status: 200 }
        );

    } catch (error) {
        console.error('src/app/api/booking-bulk-activities/events-meeting-booking-activities/route', error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


async function rollbackLocks(
    allEventMeetingBookingInfo: (
        IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | 
        IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | 
        IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
    )[]
) {
    for (const eachEventMeetingBookingInfo of allEventMeetingBookingInfo) {
        await fetch(`${process.env.URL}/api/hotel-add-booking/event-meeting/unlock-only`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json; charset=UTF-8", 
            },
            body: JSON.stringify(eachEventMeetingBookingInfo)
        });
    }
}


async function rollbackPayment(customerId: Types.ObjectId, amount: number) {
    await fetch(
        `${process.env.URL}/api/account-balance-user/update-account-balance/add-money-in-account/${customerId}`, 
        {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json; charset=UTF-8", 
            },
            body: JSON.stringify({ amountToBeAdded: amount })
        }
    );
}


async function rollbackTransaction(transactionId: string){
    await fetch(
        `${process.env.URL}/api/account-balance-user/delete-transaction/${transactionId}`, 
        {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
    );
}


async function deleteSingleDateEventMeetingBookingTransaction(transactionId: string){
    await fetch(
        `${process.env.URL}/api/delete-booking-txnid/meeting-events/single-date/${transactionId}`, 
        {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
    );
}


async function deleteMultipleDatesContinousEventMeetingBookingTransaction(transactionId: string){
    await fetch(
        `${process.env.URL}/api/delete-booking-txnid/meeting-events/multiple-dates-continous/${transactionId}`, 
        {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
    );
}


async function deleteMultipleDatesNonContinousEventMeetingBookingTransaction(transactionId: string){
    await fetch(
        `${process.env.URL}/api/delete-booking-txnid/meeting-events/multiple-dates-non-continous/${transactionId}`, 
        {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
    );
}


function wait(ms: number) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}


export { POST };