import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";


import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";

import { 
    INVALID_BOOKING_PAYLOAD,
    INTERNAL_SERVER_ERROR,  
} from "@/constant string files/apiErrorMessageConstants";

import { 
    INFORMATION_ADD_TO_DINING_BOOKING_SUCCESSFUL, 
    INFORMATION_ADD_TO_ROOMS_SUITES_BOOKING_SUCCESSFUL,
    INFORMATION_ADD_TO_SINGLE_DATE_EVENT_MEETING_ROOM_SUCCESSFUL,
    INFORMATION_ADD_TO_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL,
    INFORMATION_ADD_TO_NON_CONTINOUS_MULTIPLE_DATES_EVENT_MEETING_ROOM_SUCCESSFUL,
    SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_TRANSACTION, 
    SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT, 
    ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_BOOKING_PROCESS_SUCCESSFUL, 
    DINING_BOOKING_LOCKED_SUCCESSFULLY,
    ROOM_SUITE_BOOKING_LOCKED_SUCCESSFULLY,
    EVENT_MEETING_BOOKING_LOCKED_SUCCESSFULLY,
    ITEM_SUCCESSFULLY_DELETED_FROM_CART,
    EVENT_MEETING_BOOKING_UNLOCKED_SUCCESSFULLY,
    DINING_BOOKING_UNLOCKED_SUCCESSFULLY,
    ROOM_SUITE_BOOKING_UNLOCKED_SUCCESSFULLY
} from "@/constant string files/apiSuccessMessageConstants";


import { IViewDiningCartByCartIdSuccessApiResponse } from "@/interface/Dining Interface/diningCartApiResponse";
import { IViewRoomsSuitesCartByCartIdSuccessApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";

import { 
    IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, 
    IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, 
    IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
} from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";

import { 
    DiningBookingAddBookingApiResponse, 
    DiningBookingDeleteCartApiResponse, 
    DiningBookingLockCheckingApiResponse, 
    DiningBookingUnlockAddBookingApiResponse 
} from "@/interface/Dining Interface/diningBookingBulkActivitiesApiResponse";

import { 
    RoomsSuitesBookingAddBookingApiResponse, 
    RoomsSuitesBookingDeleteCartApiResponse, 
    RoomsSuitesBookingLockCheckingApiResponse, 
    RoomsSuitesBookingUnlockAddBookingApiResponse 
} from "@/interface/Rooms and Suites Interface/roomSuiteBookingBulkActivitiesApiResponse";

import { 
    EventMeetingBookingAddBookingApiResponse, 
    EventMeetingBookingDeleteCartApiResponse, 
    EventMeetingBookingLockCheckingApiResponse, 
    EventMeetingBookingUnlockAddBookingApiResponse 
} from "@/interface/Event Meeting Interface/eventMeetingBookingBulkActivitiesApiResponse";



interface IAllComponentBookingInfo {
    allDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[];
    allEventMeetingBookingInfo: (
        IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | 
        IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | 
        IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse)[];
    allRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[];
}

interface ITransactionInfo {
    customerId: Types.ObjectId | null;
    deductionAmount: number;
}

interface IDiningBookingPayload {
    diningBookingInfoDetail: IViewDiningCartByCartIdSuccessApiResponse;
    transactionId: string;
}

interface IRoomsSuitesBookingPayload {
    roomSuiteBookingInfoDetail: IViewRoomsSuitesCartByCartIdSuccessApiResponse;
    transactionId: string;
}

interface IEventMeetingRoomBookingPayload {
    eventMeetingRoomBookingInfoDetail: 
        | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
        | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
        | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse;
    transactionId: string;
}



interface IDiningRoomsSuitesMeetingEventingBookingTransactionCreationSuccessApiResponse {
    message: string;
    transactionId: string;
}

interface IDiningRoomsSuitesMeetingEventingBookingTransactionCreationErrorApiResponse {
    errorMessage: string;
}

type DiningRoomsSuitesMeetingEventingBookingTransactionCreationApiResponse = 
    | IDiningRoomsSuitesMeetingEventingBookingTransactionCreationSuccessApiResponse
    | IDiningRoomsSuitesMeetingEventingBookingTransactionCreationErrorApiResponse;


interface IDiningRoomsSuitesMeetingEventingBookingDeductMoneyFromWalletSuccessApiResponse {
    message: string;
}

interface IDiningRoomsSuitesMeetingEventingBookingDeductMoneyFromWalletErrorApiResponse {
    errorMessage: string;
}

type DiningRoomsSuitesMeetingEventingBookingDeductMoneyFromWalletApiResponse = 
    | IDiningRoomsSuitesMeetingEventingBookingDeductMoneyFromWalletSuccessApiResponse
    | IDiningRoomsSuitesMeetingEventingBookingDeductMoneyFromWalletErrorApiResponse;



async function POST(request: NextRequest) {
    try{
        const body: IAllComponentBookingInfo = await request.json();

        const allDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[] = 
            body.allDiningBookingInfo;

        const allEventMeetingBookingInfo: (
            | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse
            | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse  
            | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
        )[] = body.allEventMeetingBookingInfo; 

        const allRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[] = 
            body.allRoomSuiteBookingInfo;

        const allBookingInfo: (
            | IViewRoomsSuitesCartByCartIdSuccessApiResponse 
            | IViewDiningCartByCartIdSuccessApiResponse 
            | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
            | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
            | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
        )[] = [
            ...allDiningBookingInfo,
            ...allEventMeetingBookingInfo,
            ...allRoomSuiteBookingInfo
        ]

        const isEmpty: boolean = 
            (!Array.isArray(allDiningBookingInfo) || allDiningBookingInfo.length === 0) &&
            (!Array.isArray(allRoomSuiteBookingInfo) || allRoomSuiteBookingInfo.length === 0) &&
            (!Array.isArray(allEventMeetingBookingInfo) || allEventMeetingBookingInfo.length === 0);

        if(isEmpty){
            return NextResponse.json(
                { errorMessage: INVALID_BOOKING_PAYLOAD },
                { status: 400 }
            );
        }

        let diningBookingAmount: number = 0;
        let eventMeetingBookingAmount: number = 0;
        let roomsSuitesBookingAmount: number = 0;

        if(allDiningBookingInfo.length > 0){
            diningBookingAmount = allDiningBookingInfo.reduce(
                function(
                    total: number, 
                    eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse
                ) {
                    return total + eachDiningBookingInfo.cartInfo.priceForBooking;
                }, 
                0
            );
        }
        if(allEventMeetingBookingInfo.length > 0){
            eventMeetingBookingAmount = allEventMeetingBookingInfo.reduce(
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
        }
        if(allRoomSuiteBookingInfo.length > 0){
            roomsSuitesBookingAmount = allRoomSuiteBookingInfo.reduce(
                function(
                    total: number, 
                    eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse
                ){
                    return total + eachRoomSuiteBookingInfo.cartInfo.totalPriceOfAllRooms;
                },
                0
            );
        }

        const allComponentTotalBookingAmount: number = 
            diningBookingAmount + eventMeetingBookingAmount + roomsSuitesBookingAmount;

        let customerId: null | Types.ObjectId = null;

        if(allDiningBookingInfo.length > 0){
            customerId = allDiningBookingInfo[0].cartInfo.customerId;
        }
        else if(allEventMeetingBookingInfo.length > 0){
            customerId = allEventMeetingBookingInfo[0].cartInfo.customerId;
        }
        else if(allRoomSuiteBookingInfo.length > 0){
            customerId = allRoomSuiteBookingInfo[0].cartInfo.customerId;
        }

        if(!customerId){
            throw new Error("customerId is missing");
        }

        const transactionInfo: ITransactionInfo = {
            customerId: customerId,
            deductionAmount: allComponentTotalBookingAmount
        };


        // Step 1: Lock all bookings starts

        // For Dining Starts
        if(allDiningBookingInfo.length > 0) {
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
                    await rollbackDiningLocks(allDiningBookingInfo);
                    if('errorMessage' in dataDiningLockChecking){
                        return NextResponse.json(
                            { errorMessage: dataDiningLockChecking.errorMessage }, 
                            { status: responseDiningLockChecking[i].status }
                        );
                    }
                }
            }
        }
        // For Dining Ends


        // For Room Suite Starts
        if(allRoomSuiteBookingInfo.length > 0) {
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
                    await rollbackRoomsSuitesLocks(allRoomSuiteBookingInfo);
                    if('errorMessage' in dataRoomSuiteLockChecking){
                        return NextResponse.json(
                            { errorMessage: dataRoomSuiteLockChecking.errorMessage }, 
                            { status: responseRoomSuiteLockChecking[i].status }
                        );
                    }
                }
            }
        }
        // For Room Suite Ends


        // For Event Meeting Starts
        if(allEventMeetingBookingInfo.length > 0) {
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
                const dataEventMeetingLockChecking: EventMeetingBookingLockCheckingApiResponse = await responseLockChecking.json();        
                if(responseLockChecking.status !== 200 ||
                    ('message' in dataEventMeetingLockChecking && 
                    dataEventMeetingLockChecking.message !== EVENT_MEETING_BOOKING_LOCKED_SUCCESSFULLY)
                ){
                    await rollbackEventMeetingLocks(allEventMeetingBookingInfo);
                    if('errorMessage' in dataEventMeetingLockChecking){
                        return NextResponse.json(
                            { errorMessage: dataEventMeetingLockChecking.errorMessage }, 
                            { status: responseLockChecking.status }
                        );
                    }
                }
            }     
        }
        // For Event Meeting Ends


        // Step 1: Lock all bookings ends
        
        // await wait(100000);



        // Step 2: Create transaction record starts
        const responseAllComponentTransaction: Response = await fetch(
            `${process.env.URL}/api/account-balance-user/add-transaction-amount-deduct-account/all-types-transaction`, 
            {
                method: 'POST',
                body: JSON.stringify(transactionInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }
        );
        const dataAllComponentTransaction: DiningRoomsSuitesMeetingEventingBookingTransactionCreationApiResponse = 
            await responseAllComponentTransaction.json();

        if (responseAllComponentTransaction.status !== 200 || 
            ('message' in dataAllComponentTransaction && 
            dataAllComponentTransaction.message !== SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_TRANSACTION)
        ) {
            await rollbackDiningLocks(allDiningBookingInfo);
            await rollbackRoomsSuitesLocks(allRoomSuiteBookingInfo);
            await rollbackEventMeetingLocks(allEventMeetingBookingInfo);
            if('errorMessage' in dataAllComponentTransaction){
                return NextResponse.json(
                    { errorMessage: dataAllComponentTransaction.errorMessage }, 
                    { status: responseAllComponentTransaction.status }
                );
            }
        }


        let transactionId: undefined | string;
        if('transactionId' in dataAllComponentTransaction){
            transactionId = dataAllComponentTransaction.transactionId;
        }

        if(!transactionId){
            throw new Error("transactionId is missing");
        }


        // Step 2: Create transaction record ends



        // Step 3: Deduct money from wallet first starts
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
        const dataDeductMoneyFromAccount: DiningRoomsSuitesMeetingEventingBookingDeductMoneyFromWalletApiResponse = 
            await responseDeductMoneyFromAccount.json();
        
        if (responseDeductMoneyFromAccount.status !== 200 || 
            ('message' in dataDeductMoneyFromAccount && 
            dataDeductMoneyFromAccount.message !== SUCCESSFUL_AMOUNT_DEDUCTED_FROM_ACCOUNT)
        ) {   
            await rollbackTransaction(transactionId);         
            await rollbackDiningLocks(allDiningBookingInfo);
            await rollbackRoomsSuitesLocks(allRoomSuiteBookingInfo);
            await rollbackEventMeetingLocks(allEventMeetingBookingInfo);
            if('errorMessage' in dataDeductMoneyFromAccount){
                return NextResponse.json(
                    { errorMessage: dataDeductMoneyFromAccount.errorMessage }, 
                    { status: responseDeductMoneyFromAccount.status }
                );
            }
        }
        // Step 3: Deduct money from wallet first ends


        

        // Step 4: Unlock and Add to Hotel Booking starts

        //For Dining starts
        if(allDiningBookingInfo.length > 0){
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
                    await rollbackPayment(customerId, allComponentTotalBookingAmount);
                    await rollbackTransaction(transactionId);
                    await rollbackDiningLocks(allDiningBookingInfo);
                    await rollbackRoomsSuitesLocks(allRoomSuiteBookingInfo);
                    await rollbackEventMeetingLocks(allEventMeetingBookingInfo);
                    if('errorMessage' in dataDiningUnlockAddBooking){
                        return NextResponse.json(
                            { errorMessage: dataDiningUnlockAddBooking.errorMessage }, 
                            { status: responseDiningUnlockAddBooking[i].status }
                        );
                    }
                }
            }
        }
        //For Dining ends


        //For Rooms Suites starts
        if(allRoomSuiteBookingInfo.length > 0) {
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
                    await rollbackPayment(customerId, allComponentTotalBookingAmount);
                    await rollbackTransaction(transactionId);
                    await rollbackDiningLocks(allDiningBookingInfo);
                    await rollbackRoomsSuitesLocks(allRoomSuiteBookingInfo);
                    await rollbackEventMeetingLocks(allEventMeetingBookingInfo);
                    if('errorMessage' in dataRoomSuiteUnlockAddBooking){
                        return NextResponse.json(
                            { errorMessage: dataRoomSuiteUnlockAddBooking.errorMessage }, 
                            { status: responseRoomSuiteUnlockAddBooking[i].status }
                        );
                    }
                }
            }
            
        }
        //For Rooms Suites ends


        //For Event Meeting Room starts
        if(allEventMeetingBookingInfo.length > 0){
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
                    await rollbackPayment(customerId, allComponentTotalBookingAmount);
                    await rollbackTransaction(transactionId);
                    await rollbackDiningLocks(allDiningBookingInfo);
                    await rollbackRoomsSuitesLocks(allRoomSuiteBookingInfo);
                    await rollbackEventMeetingLocks(allEventMeetingBookingInfo);
                    if('errorMessage' in dataUnlockEventMeetingAddBooking){
                        return NextResponse.json(
                            { errorMessage: dataUnlockEventMeetingAddBooking.errorMessage }, 
                            { status: responseUnlockAddBooking.status }
                        );
                    }
                }
            }

        }
        //For Event Meeting Room ends

        // Step 4: Unlock and Add to Hotel Booking ends

        

        // Step 5: Add to Customer Booking starts

        //For Dining starts
        if(allDiningBookingInfo.length > 0){
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
                    await rollbackPayment(customerId, allComponentTotalBookingAmount);
                    await rollbackTransaction(transactionId);
                    await deleteDiningBookingTransaction(transactionId);
                    await deleteRoomsSuitesBookingTransaction(transactionId);
                    await deleteSingleDateEventMeetingBookingTransaction(transactionId);
                    await deleteMultipleDatesContinousEventMeetingBookingTransaction(transactionId);
                    await deleteMultipleDatesNonContinousEventMeetingBookingTransaction(transactionId);
                    if('errorMessage' in dataDiningBooking){
                        return NextResponse.json(
                            { errorMessage: dataDiningBooking.errorMessage }, 
                            { status: responseDiningBooking[i].status }
                        );
                    }
                }
            }

        }
        //For Dining ends


        //For Room Suites starts
        if(allRoomSuiteBookingInfo.length > 0){
            const responseRoomSuiteBooking: Response[] = await Promise.all(
                allRoomSuiteBookingInfo.map(function (
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
                    await rollbackPayment(customerId, allComponentTotalBookingAmount);
                    await rollbackTransaction(transactionId);
                    await deleteDiningBookingTransaction(transactionId);
                    await deleteRoomsSuitesBookingTransaction(transactionId);
                    await deleteSingleDateEventMeetingBookingTransaction(transactionId);
                    await deleteMultipleDatesContinousEventMeetingBookingTransaction(transactionId);
                    await deleteMultipleDatesNonContinousEventMeetingBookingTransaction(transactionId);
                    if('errorMessage' in dataRoomSuiteBooking){   
                        return NextResponse.json(
                            { errorMessage: dataRoomSuiteBooking.errorMessage }, 
                            { status: responseRoomSuiteBooking[i].status }
                        );
                    }
                }
            }
        }
        //For Room Suites ends


        //For Event Meeting Room starts
        if(allEventMeetingBookingInfo.length > 0){
            const responseEventMeetingRoomBooking: (Response | undefined)[] = await Promise.all(
                allEventMeetingBookingInfo.map(function (
                    eachEventMeetingBookingInfo: 
                        | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
                        | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
                        | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
                ) {
                    const eventMeetingRoomBookingInfo: IEventMeetingRoomBookingPayload = {
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
                    await rollbackPayment(customerId, allComponentTotalBookingAmount);
                    await rollbackTransaction(transactionId);
                    await deleteDiningBookingTransaction(transactionId);
                    await deleteRoomsSuitesBookingTransaction(transactionId);
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
        }
        //For Event Meeting Room ends

        // Step 5: Add to Customer Booking ends

        

        // Step 6: Delete From Cart starts

        //For Dining starts
        if(allDiningBookingInfo.length > 0){
            const responseDiningDeleteCart: Response[] = await Promise.all(
                allDiningBookingInfo.map(function (
                    eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse
                ) {
                    const cartId: string = eachDiningBookingInfo.cartInfo._id;
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
        }
        //For Dining ends


        // For Rooms Suites Starts
        if(allRoomSuiteBookingInfo.length > 0){
            const responseRoomSuiteDeleteCart: Response[] = await Promise.all(
                allRoomSuiteBookingInfo.map(function (
                    eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse
                ) {
                    const cartId: string = eachRoomSuiteBookingInfo.cartInfo._id;
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
        }
        // For Rooms Suites ends


        //For Event Meeting Room starts
        if(allEventMeetingBookingInfo.length > 0){
            const responseDeleteEventMeetingRoomCartInfo: (Response | undefined)[] = await Promise.all(
                allEventMeetingBookingInfo.map(function (
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
        }
        //For Event Meeting Room ends
        // Step 6: Delete From Cart ends
        
        

        return NextResponse.json(
            { message: ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_BOOKING_PROCESS_SUCCESSFUL },
            { status: 200 }
        );

    }
    catch (error) {
        console.error('src/app/api/booking-bulk-activities/all-types-booking-activities/route', error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


async function rollbackPayment(customerId: Types.ObjectId, amount: number) {
    await fetch(
        `${process.env.URL}/api/account-balance-user/update-account-balance/add-money-in-account/${customerId}`, 
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amountToBeAdded: amount })
        }
    );
}


async function rollbackEventMeetingLocks(allEventMeetingBookingInfo: (
    IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | 
    IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | 
    IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse)[]
) {
    if(allEventMeetingBookingInfo.length > 0){
        await Promise.all(
            allEventMeetingBookingInfo.map(function (
                eachEventMeetingBookingInfo: 
                    | IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse 
                    | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
            ){
                return fetch(
                    `${process.env.URL}/api/hotel-add-booking/event-meeting/unlock-only`, 
                    {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json; charset=UTF-8", 
                        },
                        body: JSON.stringify(eachEventMeetingBookingInfo)
                    }
                );
            })
        );
    }
}


async function rollbackRoomsSuitesLocks(allRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[]) {
    if(allRoomSuiteBookingInfo.length > 0){
        await Promise.all(
            allRoomSuiteBookingInfo.map(
                function (
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
}


async function rollbackDiningLocks(allDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[]) {
    if(allDiningBookingInfo.length > 0){
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
    await fetch(
        `${process.env.URL}/api/delete-booking-txnid/dining/${transactionId}`, 
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