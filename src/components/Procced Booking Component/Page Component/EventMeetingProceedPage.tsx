'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import { resetEventMeetingBookingInfo } from "@/redux store/features/Booking Information/eventMeetingBookingInfoSlice";

import { convertToINR } from "@/functions/currency";
import { EVENT_AND_MEETING_ROOMS_BOOKING_PROCESS_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants";

import EventMeetingBookingInfo from "@/components/Procced Booking Component/Booking Information Component/Event Meeting Booking/EventMeetingBookingInfo";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { ILoginUserDetails, LoginUserApiResponse } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";
import { EventMeetingBookingApiResponse, IEventMeetingBookingErrorApiResponse, IEventMeetingBookingSuccessApiResponse } from "@/interface/Event Meeting Interface/eventMeetingBookingApiResponse";


function EventMeetingProceedPage() {
    return (
        <ErrorBoundary>
            <EventMeetingProceedPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function EventMeetingProceedPageFunctionalComponent(){
    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    
    if(loginUserDetails === null){
        throw new Error("loginUserDetails is null");
    }
    
    const loginUserId: string = loginUserDetails.userId;

    const allEventMeetingBookingInfo: (IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse)[] = useAppSelector((reduxStore) => reduxStore.eventMeetingBookingInfoSlice.eventMeetingBookingInfo);

    useEffect(()=>{
        fetchLoginUsersDetailsDb(loginUserId);
    }, []);

    const [loginCustomerInfo, setLoginCustomerInfo] = useState<ILoginUserDetails | null>(null);
    const [showPaymentContainer, setShowPaymentContainer] = useState<boolean>(false);
    const [performingPayment, setPerformingPayment] = useState<boolean>(false);
    const [bookingErrorMessage, setBookingErrorMessage] = useState<string>('');

    let customerAccountBalance: number = 0;
    if(loginCustomerInfo !== null){
        customerAccountBalance = loginCustomerInfo.accountBalance
    }

    // const eventMeetingBookingAmount = allEventMeetingBookingInfo.reduce(function(total, eachEventMeetingBookingInfo){
    //     return total + (eachEventMeetingBookingInfo.cartInfo.totalPriceEventMeetingRoom || eachEventMeetingBookingInfo.cartInfo.totalPriceOfAllDates || 0);
    // }, 0);

    const eventMeetingBookingAmount: number = allEventMeetingBookingInfo.reduce(function (total: number, eachEventMeetingBookingInfo: IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse) {
        let price: number = 0;
        if ('totalPriceEventMeetingRoom' in eachEventMeetingBookingInfo.cartInfo) {
            price = eachEventMeetingBookingInfo.cartInfo.totalPriceEventMeetingRoom || 0;
        } else if ('totalPriceOfAllDates' in eachEventMeetingBookingInfo.cartInfo) {
            price = eachEventMeetingBookingInfo.cartInfo.totalPriceOfAllDates || 0;
        }
        return total + price;
    }, 0);



    
    async function fetchLoginUsersDetailsDb(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/users-authentication/customers-authenticatication/login-user-information/${loginUserId}`);
            const data: LoginUserApiResponse = await response.json();
            if(response.status == 200){
                if('loginUserDetails' in data){
                    const loginUserInformation: ILoginUserDetails = data.loginUserDetails;
                    setLoginCustomerInfo(loginUserInformation);  
                } 
            }
        } 
        catch (error) {
            console.log(error); 
        }
        finally{
            
        }
    }


    function isSuccessResponse(data: EventMeetingBookingApiResponse): data is IEventMeetingBookingSuccessApiResponse {
        return 'message' in data;
    }

    function isErrorResponse(data: EventMeetingBookingApiResponse): data is IEventMeetingBookingErrorApiResponse {
        return 'errorMessage' in data;
    }

    async function payEventMeetingBookingAmount(){
        setBookingErrorMessage('');
        try{
            setPerformingPayment(true);
            const response: Response = await fetch('/api/booking-bulk-activities/events-meeting-booking-activities/', {
                method: 'POST',
                body: JSON.stringify(allEventMeetingBookingInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data: EventMeetingBookingApiResponse = await response.json();
            if(response.status === 200 && isSuccessResponse(data)){
                if('message' in data){
                    if(data.message === EVENT_AND_MEETING_ROOMS_BOOKING_PROCESS_SUCCESSFUL){
                        dispatch(resetEventMeetingBookingInfo());
                        router.push(`/profile-home-page/view-current-bookings/${loginUserId}`);
                    }
                }
            }
            if(response.status !== 200 && isErrorResponse(data) && data.errorMessage){
                setBookingErrorMessage(data.errorMessage);
            }
        }
        catch (error) {
            console.log(error); 
        }
        finally{
            setPerformingPayment(false);
        }
    }


    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            <div className="my-6 mx-10">
                <EventMeetingBookingInfo allEventMeetingBookingInfo={allEventMeetingBookingInfo} />
            </div>

            <div className="flex items-center justify-center mb-8">
                {(allEventMeetingBookingInfo.length > 0 && loginCustomerInfo !== null) &&
                    <Button onClick={()=>setShowPaymentContainer(true)} variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {(allEventMeetingBookingInfo.length == 0 || loginCustomerInfo == null) &&
                    <Button disabled variant="contained">
                        Proceed For Booking
                    </Button>
                }
            </div>

            {bookingErrorMessage !== '' &&
                <div className="flex items-center justify-center">
                    <p className="text-red-600 font-extrabold bg-red-200 px-2 py-1 mb-4">
                        {bookingErrorMessage}
                    </p>
                </div>
            }

            {showPaymentContainer && 
            <div className="flex flex-col items-center justify-center bg-amber-200/80 mx-10 mb-8 p-4">
                <p className="font-bold pb-4">
                    Please Pay {convertToINR(eventMeetingBookingAmount)} for Event/ Meeting Rooms Booking
                </p>
                
                {(eventMeetingBookingAmount <= customerAccountBalance) && 
                    <div className="flex flex-col items-center justify-center w-full">
                        <p className="bg-green-400/70 p-2 text-center w-3/4 mb-4">
                            Your Account has Balance {convertToINR(customerAccountBalance)}
                        </p>
                        {!performingPayment &&
                            <Button onClick={payEventMeetingBookingAmount} variant="contained">
                                Pay {convertToINR(eventMeetingBookingAmount)}
                            </Button>
                        }
                        {performingPayment &&
                            <Button disabled variant="contained">
                                Please Wait
                            </Button>
                        }
                    </div>    
                }
                {(eventMeetingBookingAmount > customerAccountBalance) && 
                    <div className="flex flex-col items-center justify-center w-full">
                        <p className="bg-yellow-300 p-2 text-center w-11/12 mb-4">
                            <FontAwesomeIcon icon={faCircleExclamation} />
                            Warning: Your Account has Insufficient Balance. Current Balance in Account is {convertToINR(customerAccountBalance)}. 
                            Please add {convertToINR(eventMeetingBookingAmount - customerAccountBalance)} to your Account.
                        </p>
                        <Button disabled variant="contained">
                            Pay {convertToINR(eventMeetingBookingAmount)}
                        </Button>
                    </div>
                }
            </div>
            }
            
        </div>
    );
}

export default EventMeetingProceedPage;