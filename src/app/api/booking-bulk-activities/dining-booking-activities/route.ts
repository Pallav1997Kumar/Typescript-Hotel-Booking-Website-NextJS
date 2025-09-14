import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import Connection from "@/database config/config";


import { 
    INTERNAL_SERVER_ERROR, 
    INVALID_BOOKING_PAYLOAD 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_DINING_BOOKING_SUCCESSFUL, 
    SUCCESSFUL_AMOUNT_DEDUCT_DINING_TRANSACTION, 
    SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT, 
    DINING_BOOKING_PROCESS_SUCCESSFUL, 
    DINING_BOOKING_LOCKED_SUCCESSFULLY,
    DINING_BOOKING_UNLOCKED_SUCCESSFULLY,
    ITEM_SUCCESSFULLY_DELETED_FROM_CART
} from "@/constant string files/apiSuccessMessageConstants";


import { IViewDiningCartByCartIdSuccessApiResponse } from "@/interface/Dining Interface/diningCartApiResponse";

import { 
    DiningBookingAddBookingApiResponse, 
    DiningBookingDeductMoneyFromWalletApiResponse, 
    DiningBookingDeleteCartApiResponse, 
    DiningBookingLockCheckingApiResponse, 
    DiningBookingTransactionCreationApiResponse, 
    DiningBookingUnlockAddBookingApiResponse 
} from "@/interface/Dining Interface/diningBookingBulkActivitiesApiResponse";


Connection();


interface ITransactionInfo {
    customerId: Types.ObjectId;
    deductionAmount: number;
}

interface IDiningBookingPayload {
    diningBookingInfoDetail: IViewDiningCartByCartIdSuccessApiResponse;
    transactionId: string;
}


async function POST(request: NextRequest) {
    try {
        const body: IViewDiningCartByCartIdSuccessApiResponse[] = await request.json();
        const allDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[] = body;

        if (!Array.isArray(allDiningBookingInfo) || allDiningBookingInfo.length === 0) {
            return NextResponse.json(
                { errorMessage: INVALID_BOOKING_PAYLOAD }, 
                { status: 400 }
            );
        }

        const diningBookingAmount: number = allDiningBookingInfo.reduce(
            function(
                total: number, 
                eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse
            ) {
                return total + eachDiningBookingInfo.cartInfo.priceForBooking;
            }, 
            0
        );
        
        const customerId: Types.ObjectId = allDiningBookingInfo[0].cartInfo.customerId;

        const transactionInfo: ITransactionInfo = {
            customerId: customerId,
            deductionAmount: diningBookingAmount
        };


        // Step 1: Lock all bookings in parallel
        const responseDiningLockChecking: Response[] = await Promise.all(
            allDiningBookingInfo.map(function (
                eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse
            ) {
                return fetch(`${process.env.URL}/api/hotel-add-booking/dining/lock-checking`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8', 
                    },
                    body: JSON.stringify(eachDiningBookingInfo),
                });
            })
        );

        for (let i = 0; i < responseDiningLockChecking.length; i++) {
            const dataDiningLockChecking: DiningBookingLockCheckingApiResponse = 
                await responseDiningLockChecking[i].json();
            if (responseDiningLockChecking[i].status !== 200 || 
                ('message' in dataDiningLockChecking && 
                dataDiningLockChecking.message !== DINING_BOOKING_LOCKED_SUCCESSFULLY)
            ) {
                await rollbackLocks(allDiningBookingInfo);
                if ('errorMessage' in dataDiningLockChecking){
                    return NextResponse.json(
                        { errorMessage: dataDiningLockChecking.errorMessage }, 
                        { status: responseDiningLockChecking[i].status }
                    );
                }
            }
        }

        //await wait(100000);


        // Step 2: Create transaction record
        const responseDiningTransaction: Response = await fetch(
            `${process.env.URL}/api/account-balance-user/add-transaction-amount-deduct-account/dining-transaction`, 
            {
                method: 'POST',
                body: JSON.stringify(transactionInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }
        );
        const dataDiningTransaction: DiningBookingTransactionCreationApiResponse = 
            await responseDiningTransaction.json();
        
        if (responseDiningTransaction.status !== 200 || 
            ('message' in dataDiningTransaction && 
            dataDiningTransaction.message !== SUCCESSFUL_AMOUNT_DEDUCT_DINING_TRANSACTION)
        ) {
            await rollbackLocks(allDiningBookingInfo);
            if('errorMessage' in dataDiningTransaction){
                return NextResponse.json(
                    { errorMessage: dataDiningTransaction.errorMessage }, 
                    { status: responseDiningTransaction.status }
                );
            }
        }

        let transactionId: undefined | string;
        if('transactionId' in dataDiningTransaction){
            transactionId = dataDiningTransaction.transactionId;
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
        const dataDeductMoneyFromAccount: DiningBookingDeductMoneyFromWalletApiResponse = 
            await responseDeductMoneyFromAccount.json();
        
        if (responseDeductMoneyFromAccount.status !== 200 || 
            ('message' in dataDeductMoneyFromAccount && 
            dataDeductMoneyFromAccount.message !== SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT)
        ) {            
            await rollbackLocks(allDiningBookingInfo);
            await rollbackTransaction(transactionId);
            if('errorMessage' in dataDeductMoneyFromAccount){
                return NextResponse.json(
                    { errorMessage: dataDeductMoneyFromAccount.errorMessage }, 
                    { status: responseDeductMoneyFromAccount.status }
                );
            }
        }


        // Step 4: Unlock Dining and Add to Hotel Booking
        const responseDiningUnlockAddBooking: Response[] = await Promise.all(
            allDiningBookingInfo.map(function (
                eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse
            ){
                return fetch(`${process.env.URL}/api/hotel-add-booking/dining/unlock-add-booking`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8', 
                    },
                    body: JSON.stringify(eachDiningBookingInfo),
                })
            })
        );

        for (let i = 0; i < responseDiningUnlockAddBooking.length; i++) {
            const dataDiningUnlockAddBooking: DiningBookingUnlockAddBookingApiResponse = 
                await responseDiningUnlockAddBooking[i].json();

            if (responseDiningUnlockAddBooking[i].status !== 200 || 
                ('message' in dataDiningUnlockAddBooking && 
                dataDiningUnlockAddBooking.message !== DINING_BOOKING_UNLOCKED_SUCCESSFULLY)
            ) {
                await rollbackPayment(customerId, diningBookingAmount);
                await rollbackTransaction(transactionId);
                await rollbackLocks(allDiningBookingInfo);
                
                if('errorMessage' in dataDiningUnlockAddBooking){
                    return NextResponse.json(
                        { errorMessage: dataDiningUnlockAddBooking.errorMessage }, 
                        { status: responseDiningUnlockAddBooking[i].status }
                    );
                }
            }
        }


        // Step 5: Add to Customer Booking
        const responseDiningBooking: Response[] = await Promise.all(
            allDiningBookingInfo.map(function (
                eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse
            ) {
                const bookingPayload: IDiningBookingPayload = {
                    diningBookingInfoDetail: eachDiningBookingInfo,
                    transactionId: transactionId,
                };
                return fetch(`${process.env.URL}/api/add-booking/dining/${customerId}`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8', 
                    },
                    body: JSON.stringify(bookingPayload),
                });
            })
        );

        for (let i = 0; i < responseDiningBooking.length; i++) {
            const dataDiningBooking: DiningBookingAddBookingApiResponse = 
                await responseDiningBooking[i].json();

            if (responseDiningBooking[i].status !== 200 || 
                ('message' in dataDiningBooking && 
                dataDiningBooking.message !== INFORMATION_ADD_TO_DINING_BOOKING_SUCCESSFUL)
            ) {
                await rollbackPayment(customerId, diningBookingAmount);
                await rollbackTransaction(transactionId);
                await deleteDiningBookingTransaction(transactionId);
                if('errorMessage' in dataDiningBooking){
                    return NextResponse.json(
                        { errorMessage: dataDiningBooking.errorMessage }, 
                        { status: responseDiningBooking[i].status }
                    );
                }
            }
        }


        // Step 6: Delete From Cart
        const responseDiningDeleteCart: Response[] = await Promise.all(
            allDiningBookingInfo.map(function (
                eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse
            ) {
                const cartId = eachDiningBookingInfo.cartInfo._id;
                return fetch(`${process.env.URL}/api/delete-cart/dining/${cartId}`, {
                    method: 'DELETE',
                    headers: { 
                        'Content-Type': 'application/json; charset=UTF-8', 
                    },
                });
            })
        );

        for(let i = 0; i < responseDiningDeleteCart.length; i++){
            const dataDiningDeleteCart: DiningBookingDeleteCartApiResponse = 
                await responseDiningDeleteCart[i].json();
            if(responseDiningDeleteCart[i].status !== 200 || 
                ('message' in dataDiningDeleteCart && 
                dataDiningDeleteCart.message !== ITEM_SUCCESSFULLY_DELETED_FROM_CART)
            ){
                if('errorMessage' in dataDiningDeleteCart){
                    return NextResponse.json(
                        { errorMessage: dataDiningDeleteCart.errorMessage }, 
                        { status: responseDiningDeleteCart[i].status }
                    );
                }
            }
        }

        
        return NextResponse.json(
            { message: DINING_BOOKING_PROCESS_SUCCESSFUL },
            { status: 200 }
        );
        
    } 
    catch (error) {
        console.error('src/app/api/booking-bulk-activities/dining-booking-activities/route', error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


// Rollback locked bookings
async function rollbackLocks(allDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[]) {
    await Promise.all(
        allDiningBookingInfo.map(function (
            eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse
        ) {
        return fetch(`${process.env.URL}/api/hotel-add-booking/dining/unlock-only`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8', 
            },
            body: JSON.stringify(eachDiningBookingInfo),
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


async function deleteDiningBookingTransaction(transactionId: string){
    await fetch(`${process.env.URL}/api/delete-booking-txnid/dining/${transactionId}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
}


function wait(ms: number) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}



export { POST };