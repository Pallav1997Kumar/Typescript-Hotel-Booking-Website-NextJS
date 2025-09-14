import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";


import { 
    INTERNAL_SERVER_ERROR, 
    INVALID_BOOKING_PAYLOAD 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_ROOMS_SUITES_BOOKING_SUCCESSFUL, 
    SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_TRANSACTION, 
    SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT, 
    ROOMS_SUITES_BOOKING_PROCESS_SUCCESSFUL, 
    ROOM_SUITE_BOOKING_LOCKED_SUCCESSFULLY,
    ROOM_SUITE_BOOKING_UNLOCKED_SUCCESSFULLY,
    ITEM_SUCCESSFULLY_DELETED_FROM_CART
} from "@/constant string files/apiSuccessMessageConstants";


import { IViewRoomsSuitesCartByCartIdSuccessApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";

import { 
    RoomsSuitesBookingAddBookingApiResponse, 
    RoomsSuitesBookingDeductMoneyFromWalletApiResponse, 
    RoomsSuitesBookingDeleteCartApiResponse, 
    RoomsSuitesBookingLockCheckingApiResponse, 
    RoomsSuitesBookingTransactionCreationApiResponse, 
    RoomsSuitesBookingUnlockAddBookingApiResponse 
} from "@/interface/Rooms and Suites Interface/roomSuiteBookingBulkActivitiesApiResponse";


Connection();


interface ITransactionInfo {
    customerId: Types.ObjectId;
    deductionAmount: number;
}

interface IRoomsSuitesBookingPayload {
    roomSuiteBookingInfoDetail: IViewRoomsSuitesCartByCartIdSuccessApiResponse;
    transactionId: string;
}


async function POST(request: NextRequest) {
    try {
        const body: IViewRoomsSuitesCartByCartIdSuccessApiResponse[] = await request.json();
        const allRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[] = body;

        if (!Array.isArray(allRoomSuiteBookingInfo) || allRoomSuiteBookingInfo.length === 0) {
            return NextResponse.json(
                { errorMessage: INVALID_BOOKING_PAYLOAD }, 
                { status: 400 }
            );
        }

        const roomsSuitesBookingAmount: number = allRoomSuiteBookingInfo.reduce(
            function(
                total: number, 
                eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse
            ) {
                return total + eachRoomSuiteBookingInfo.cartInfo.totalPriceOfAllRooms;
            }, 
            0
        );
        
        const customerId: Types.ObjectId = allRoomSuiteBookingInfo[0].cartInfo.customerId;

        const transactionInfo: ITransactionInfo = {
            customerId: customerId,
            deductionAmount: roomsSuitesBookingAmount
        };


        // Step 1: Lock all bookings in parallel
        const responseRoomSuiteLockChecking: Response[] = await Promise.all(
            allRoomSuiteBookingInfo.map(function (
                eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse
            ) {
                return fetch(`${process.env.URL}/api/hotel-add-booking/rooms-suites/lock-checking`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8', 
                    },
                    body: JSON.stringify(eachRoomSuiteBookingInfo),
                });
            })
        )

        for (let i = 0; i < responseRoomSuiteLockChecking.length; i++) {
            const dataRoomSuiteLockChecking: RoomsSuitesBookingLockCheckingApiResponse = 
                await responseRoomSuiteLockChecking[i].json();
            if (responseRoomSuiteLockChecking[i].status !== 200 || 
                ('message' in dataRoomSuiteLockChecking && 
                dataRoomSuiteLockChecking.message !== ROOM_SUITE_BOOKING_LOCKED_SUCCESSFULLY)
            ) {
                await rollbackLocks(allRoomSuiteBookingInfo);
                if('errorMessage' in dataRoomSuiteLockChecking){
                    return NextResponse.json(
                        { errorMessage: dataRoomSuiteLockChecking.errorMessage }, 
                        { status: responseRoomSuiteLockChecking[i].status }
                    );
                }
            }
        }

        //await wait(100000);


        // Step 2: Create transaction record
        const responseRoomSuiteTransaction: Response = await fetch(
            `${process.env.URL}/api/account-balance-user/add-transaction-amount-deduct-account/rooms-suites-transaction`, 
            {
                method: 'POST',
                body: JSON.stringify(transactionInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }
        );
        const dataRoomSuiteTransaction: RoomsSuitesBookingTransactionCreationApiResponse = 
            await responseRoomSuiteTransaction.json();
        
        if (responseRoomSuiteTransaction.status !== 200 || 
            ('message' in dataRoomSuiteTransaction && 
            dataRoomSuiteTransaction.message !== SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_TRANSACTION)
        ) {
            await rollbackLocks(allRoomSuiteBookingInfo);
            if('errorMessage' in dataRoomSuiteTransaction){
                return NextResponse.json(
                    { errorMessage: dataRoomSuiteTransaction.errorMessage }, 
                    { status: responseRoomSuiteTransaction.status }
                );
            }
        }

        let transactionId: undefined | string;
        if('transactionId' in dataRoomSuiteTransaction){
            transactionId = dataRoomSuiteTransaction.transactionId;
        }

        if(!transactionId){
            throw new Error("transactionId is missing");
        }


        // Step 3: Deduct money from wallet
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
        const dataDeductMoneyFromAccount: RoomsSuitesBookingDeductMoneyFromWalletApiResponse = 
            await responseDeductMoneyFromAccount.json();
        
        if (responseDeductMoneyFromAccount.status !== 200 || 
            ('message' in dataDeductMoneyFromAccount && 
            dataDeductMoneyFromAccount.message !== SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT)
        ) {           
            await rollbackTransaction(transactionId); 
            await rollbackLocks(allRoomSuiteBookingInfo);
            if('errorMessage' in dataDeductMoneyFromAccount){
                return NextResponse.json(
                    { errorMessage: dataDeductMoneyFromAccount.errorMessage }, 
                    { status: responseDeductMoneyFromAccount.status }
                );
            }
        }


        // Step 4: Unlock Dining and Add to Hotel Booking
        const responseRoomSuiteUnlockAddBooking: Response[] = await Promise.all(
            allRoomSuiteBookingInfo.map(function (
                eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse
            ) {
                return fetch(`${process.env.URL}/api/hotel-add-booking/rooms-suites/unlock-add-booking`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8', 
                    },
                    body: JSON.stringify(eachRoomSuiteBookingInfo),
                });
            })
        );

        for(let i = 0; i < responseRoomSuiteUnlockAddBooking.length; i++){
            const dataRoomSuiteUnlockAddBooking: RoomsSuitesBookingUnlockAddBookingApiResponse = 
                await responseRoomSuiteUnlockAddBooking[i].json();

            if(responseRoomSuiteUnlockAddBooking[i].status !== 200 ||
                ('message' in dataRoomSuiteUnlockAddBooking && 
                dataRoomSuiteUnlockAddBooking.message !== ROOM_SUITE_BOOKING_UNLOCKED_SUCCESSFULLY)
            ){
                await rollbackPayment(customerId, roomsSuitesBookingAmount);
                await rollbackTransaction(transactionId);
                await rollbackLocks(allRoomSuiteBookingInfo);
                if('errorMessage' in dataRoomSuiteUnlockAddBooking){
                    return NextResponse.json(
                        { errorMessage: dataRoomSuiteUnlockAddBooking.errorMessage }, 
                        { status: responseRoomSuiteUnlockAddBooking[i].status }
                    );
                }
            }
        }


        // Step 5: Add to Customer Booking
        const responseRoomSuiteBooking: Response[] = await Promise.all(
            allRoomSuiteBookingInfo.map(function(
                eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse
            ) {
                const bookingPayload: IRoomsSuitesBookingPayload = {
                    roomSuiteBookingInfoDetail: eachRoomSuiteBookingInfo,
                    transactionId: transactionId,
                };
                return fetch(`${process.env.URL}/api/add-booking/rooms-suites/${customerId}`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8', 
                    },
                    body: JSON.stringify(bookingPayload),
                });
            })
        );

        for (let i = 0; i < responseRoomSuiteBooking.length; i++) {
            const dataRoomSuiteBooking: RoomsSuitesBookingAddBookingApiResponse = 
                await responseRoomSuiteBooking[i].json();

            if (responseRoomSuiteBooking[i].status !== 200 || 
                ('message' in dataRoomSuiteBooking && 
                dataRoomSuiteBooking.message !== INFORMATION_ADD_TO_ROOMS_SUITES_BOOKING_SUCCESSFUL)
            ) {
                await rollbackPayment(customerId, roomsSuitesBookingAmount);
                await rollbackTransaction(transactionId); 
                await deleteRoomsSuitesBookingTransaction(transactionId);
                if('errorMessage' in dataRoomSuiteBooking){  
                    return NextResponse.json(
                        { errorMessage: dataRoomSuiteBooking.errorMessage }, 
                        { status: responseRoomSuiteBooking[i].status }
                    );
                }
            }
        }


        // Step 6: Delete From Cart
        const responseRoomSuiteDeleteCart: Response[] = await Promise.all(
            allRoomSuiteBookingInfo.map(function(
                eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse
            ) {
                const cartId = eachRoomSuiteBookingInfo.cartInfo._id;
                return fetch(`${process.env.URL}/api/delete-cart/rooms-suites/${cartId}`, {
                    method: 'DELETE',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8', 
                    },
                });
            })
        );

        for(let i = 0; i < responseRoomSuiteDeleteCart.length; i++){
            const dataRoomSuiteDeleteCart: RoomsSuitesBookingDeleteCartApiResponse = 
                await responseRoomSuiteDeleteCart[i].json();
            if(responseRoomSuiteDeleteCart[i].status !== 200 || 
                ('message' in dataRoomSuiteDeleteCart && 
                dataRoomSuiteDeleteCart.message !== ITEM_SUCCESSFULLY_DELETED_FROM_CART)
            ){
                if('errorMessage' in dataRoomSuiteDeleteCart){
                    return NextResponse.json(
                        { errorMessage: dataRoomSuiteDeleteCart.errorMessage }, 
                        { status: responseRoomSuiteDeleteCart[i].status }
                    );
                }
            }
        }
        
        
        return NextResponse.json(
            { message: ROOMS_SUITES_BOOKING_PROCESS_SUCCESSFUL },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('src/app/api/booking-bulk-activities/rooms-suites-booking-activities/route', error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


// Rollback locked bookings
async function rollbackLocks(allRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[]) {
    await Promise.all(
        allRoomSuiteBookingInfo.map(function (
            eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse
        ) {
            return fetch(`${process.env.URL}/api/hotel-add-booking/rooms-suites/unlock-only`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(eachRoomSuiteBookingInfo),
            });
        })
    );
}


// Refund money back to wallet
async function rollbackPayment(customerId: Types.ObjectId, amount: number) {
    await fetch(
        `${process.env.URL}/api/account-balance-user/update-account-balance/add-money-in-account/${customerId}`, 
        {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({ amountToBeAdded: amount }),
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


async function deleteRoomsSuitesBookingTransaction(transactionId: string){
    await fetch(
        `${process.env.URL}/api/delete-booking-txnid/rooms-suites/${transactionId}`, 
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