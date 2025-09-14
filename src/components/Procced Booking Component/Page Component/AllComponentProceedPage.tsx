'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import { resetDiningBookingInfo } from "@/redux store/features/Booking Information/diningBookingInfoSlice";
import { resetEventMeetingBookingInfo } from "@/redux store/features/Booking Information/eventMeetingBookingInfoSlice";
import { resetRoomSuiteBookingInfo } from "@/redux store/features/Booking Information/roomSuiteBookingInfoSlice";

import { convertToINR } from "@/functions/currency";
import { ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_BOOKING_PROCESS_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants";

import DiningBookingInfo from "@/components/Procced Booking Component/Booking Information Component/Dining Booking/DiningBookingInfo";
import RoomSuitesBookingInfo from "@/components/Procced Booking Component/Booking Information Component/Rooms Suites Booking/RoomSuitesBookingInfo";
import EventMeetingBookingInfo from "@/components/Procced Booking Component/Booking Information Component/Event Meeting Booking/EventMeetingBookingInfo";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { ILoginUserDetails, LoginUserApiResponse, LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { IViewDiningCartByCartIdSuccessApiResponse } from "@/interface/Dining Interface/diningCartApiResponse";
import { IViewRoomsSuitesCartByCartIdSuccessApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";
import { IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";
import { DiningRoomEventBookingApiResponse, IDiningRoomEventBookingErrorApiResponse, IDiningRoomEventBookingSuccessApiResponse } from "@/interface/diningRoomEventBookingApiResponse";


interface IAllComponentBookingInfo {
    allDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[];
    allEventMeetingBookingInfo: (IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse)[];
    allRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[];
}


function AllComponentProceedPage() {
    return (
        <ErrorBoundary>
            <AllComponentProceedPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function AllComponentProceedPageFunctionalComponent(){
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    
    if(loginUserDetails === null){
        throw new Error("loginUserDetails is null");
    }
    
    const loginUserId: string = loginUserDetails.userId;

    const allDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[] = useAppSelector((reduxStore) => reduxStore.diningBookingInfoSlice.diningBookingInfo);
    const allEventMeetingBookingInfo: (IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse)[] = useAppSelector((reduxStore) => reduxStore.eventMeetingBookingInfoSlice.eventMeetingBookingInfo);
    const allRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[] = useAppSelector((reduxStore) => reduxStore.roomSuiteBookingInfoSlice.roomSuiteBookingInfo);

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
    
    let diningBookingAmount: number = 0;
    let eventMeetingBookingAmount: number = 0;
    let roomsSuitesBookingAmount: number = 0;

    if(allDiningBookingInfo.length > 0){
        diningBookingAmount = allDiningBookingInfo.reduce(function(total: number, eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse) {
            return total + eachDiningBookingInfo.cartInfo.priceForBooking;
        }, 0);
    }
    if(allEventMeetingBookingInfo.length > 0){
        eventMeetingBookingAmount = allEventMeetingBookingInfo.reduce(function (total: number, eachEventMeetingBookingInfo: IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse) {
            let price: number = 0;
            if ('totalPriceEventMeetingRoom' in eachEventMeetingBookingInfo.cartInfo) {
                price = eachEventMeetingBookingInfo.cartInfo.totalPriceEventMeetingRoom || 0;
            } else if ('totalPriceOfAllDates' in eachEventMeetingBookingInfo.cartInfo) {
                price = eachEventMeetingBookingInfo.cartInfo.totalPriceOfAllDates || 0;
                }
            return total + price;
        }, 0);
    }
    if(allRoomSuiteBookingInfo.length > 0){
        roomsSuitesBookingAmount = allRoomSuiteBookingInfo.reduce(function(total: number, eachRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse){
            return total + eachRoomSuiteBookingInfo.cartInfo.totalPriceOfAllRooms;
        }, 0);
    }

    const allComponentTotalBookingAmount = diningBookingAmount + eventMeetingBookingAmount + roomsSuitesBookingAmount;


    async function fetchLoginUsersDetailsDb(loginUserId: string) {
        try {
            const response = await fetch(`/api/users-authentication/customers-authenticatication/login-user-information/${loginUserId}`);
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


    function isSuccessResponse(data: DiningRoomEventBookingApiResponse): data is IDiningRoomEventBookingSuccessApiResponse {
        return 'message' in data;
    }

    function isErrorResponse(data: DiningRoomEventBookingApiResponse): data is IDiningRoomEventBookingErrorApiResponse {
        return 'errorMessage' in data;
    }

    async function payAllComponentTotalBookingAmount(){
        try{
            setBookingErrorMessage('');
            const allComponentBookingInfo: IAllComponentBookingInfo = {
                allDiningBookingInfo,
                allEventMeetingBookingInfo,
                allRoomSuiteBookingInfo
            }
            setPerformingPayment(true);
            const response: Response = await fetch('/api/booking-bulk-activities/all-types-booking-activities/', {
                method: 'POST',
                body: JSON.stringify(allComponentBookingInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data: DiningRoomEventBookingApiResponse = await response.json();
            if(response.status === 200 && isSuccessResponse(data)){
                if('message' in data){
                    if(data.message === ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_BOOKING_PROCESS_SUCCESSFUL){
                        dispatch(resetDiningBookingInfo());
                        dispatch(resetEventMeetingBookingInfo());
                        dispatch(resetRoomSuiteBookingInfo());
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
                <RoomSuitesBookingInfo allRoomSuiteBookingInfo={allRoomSuiteBookingInfo} />
                <DiningBookingInfo allDiningBookingInfo={allDiningBookingInfo} />
                <EventMeetingBookingInfo allEventMeetingBookingInfo={allEventMeetingBookingInfo} />
            </div>

            <div className="flex items-center justify-center mb-8">
                {((allDiningBookingInfo.length > 0 || allRoomSuiteBookingInfo.length > 0 || allEventMeetingBookingInfo.length > 0) && loginCustomerInfo !== null) &&
                    <Button onClick={()=>setShowPaymentContainer(true)} variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {((allDiningBookingInfo.length == 0 && allRoomSuiteBookingInfo.length == 0 && allEventMeetingBookingInfo.length == 0) || loginCustomerInfo == null) &&
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
            <div className="flex flex-col items-center justify-center bg-orange-100 bg-opacity-70 mx-10 mb-8 p-4">
                <p className="font-bold pb-3">
                    Please Pay {convertToINR(allComponentTotalBookingAmount)} for All Types of Booking
                </p>

                {(allComponentTotalBookingAmount <= customerAccountBalance) && 
                    <div className="flex flex-col items-center justify-center w-full">
                        <p className="bg-green-400 bg-opacity-80 p-3 text-center w-[70%] mb-3">
                            Your Account has Balance {convertToINR(customerAccountBalance)}
                        </p>
                        {!performingPayment &&
                            <Button onClick={payAllComponentTotalBookingAmount} variant="contained">
                                Pay {convertToINR(allComponentTotalBookingAmount)}
                            </Button>
                        }
                        {performingPayment &&
                            <Button disabled variant="contained">
                                Please Wait
                            </Button>
                        }
                    </div>    
                }
                
                {(allComponentTotalBookingAmount > customerAccountBalance) && 
                    <div className="flex flex-col items-center justify-center w-full">
                        <p className="bg-yellow-300 p-2 text-center w-11/12 mb-4">
                            <FontAwesomeIcon icon={faCircleExclamation} />
                            Warning: Your Account has Insufficient Balance. Current Balance in Account is {convertToINR(customerAccountBalance)}. 
                            Please add {convertToINR(allComponentTotalBookingAmount - customerAccountBalance)} to your Account.
                        </p>
                        <Button disabled variant="contained">
                            Pay {convertToINR(allComponentTotalBookingAmount)}
                        </Button>
                    </div>
                }
            </div>
            }

        </div>
    );
}

export default AllComponentProceedPage;