'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import { resetDiningBookingInfo } from "@/redux store/features/Booking Information/diningBookingInfoSlice";

import { convertToINR } from "@/functions/currency";
import { DINING_BOOKING_PROCESS_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants";

import DiningBookingInfo from "@/components/Procced Booking Component/Booking Information Component/Dining Booking/DiningBookingInfo"
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { ILoginUserDetails, LoginUserApiResponse } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { IViewDiningCartByCartIdSuccessApiResponse } from "@/interface/Dining Interface/diningCartApiResponse";
import { DiningBookingApiResponse, IDiningBookingErrorApiResponse, IDiningBookingSuccessApiResponse } from "@/interface/Dining Interface/diningBookingApiResponse";


function DiningProceedPage() {
    return (
        <ErrorBoundary>
            <DiningProceedPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function DiningProceedPageFunctionalComponent(){
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    if(loginUserDetails === null){
        throw new Error("loginUserDetails is null");
    }

    const loginUserId: string = loginUserDetails.userId;

    const allDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[] = useAppSelector((reduxStore) => reduxStore.diningBookingInfoSlice.diningBookingInfo);

    console.log(allDiningBookingInfo);
    

    useEffect(()=>{
        fetchLoginUsersDetailsDb(loginUserId);
    }, []);

    const [loginCustomerInfo, setLoginCustomerInfo] = useState<ILoginUserDetails | null>(null);
    const [showPaymentContainer, setShowPaymentContainer] = useState<boolean>(false);
    const [performingPayment, setPerformingPayment] = useState<boolean>(false);
    const [bookingErrorMessage, setBookingErrorMessage] = useState<string>('');

    const diningBookingAmount: number = allDiningBookingInfo.reduce(function(total: number, eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse) {
        return total + eachDiningBookingInfo.cartInfo.priceForBooking;
    }, 0);

    // const diningBookingAmount: number = allDiningBookingInfo.reduce(function(total: number, eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse) {
    //     const cartTotal: number = eachDiningBookingInfo.cartInfo.reduce(function(subTotal: number, cartItem: IDiningCartInformation) {
    //         return subTotal + cartItem.priceForBooking;
    //     }, 0);
    //     return total + cartTotal;
    // }, 0);

    let customerAccountBalance: number = 0;
    if(loginCustomerInfo !== null){
        customerAccountBalance = loginCustomerInfo.accountBalance
    }

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


    function isSuccessResponse(data: DiningBookingApiResponse): data is IDiningBookingSuccessApiResponse {
        return 'message' in data;
    }

    function isErrorResponse(data: DiningBookingApiResponse): data is IDiningBookingErrorApiResponse {
        return 'errorMessage' in data;
    }

    async function payDiningBookingAmount(){
        try{
            setBookingErrorMessage('');
            setPerformingPayment(true);
            const response: Response = await fetch('/api/booking-bulk-activities/dining-booking-activities/', {
                method: 'POST',
                body: JSON.stringify(allDiningBookingInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data: DiningBookingApiResponse = await response.json();
            if(response.status === 200 && isSuccessResponse(data)){
                if('message' in data){
                    if(data.message === DINING_BOOKING_PROCESS_SUCCESSFUL){
                        dispatch(resetDiningBookingInfo());
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
                <DiningBookingInfo allDiningBookingInfo={allDiningBookingInfo} />
            </div>

            <div className="flex items-center justify-center mb-8">
                {(allDiningBookingInfo.length > 0 && loginCustomerInfo !== null) &&
                    <Button onClick={()=>setShowPaymentContainer(true)} variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {(allDiningBookingInfo.length == 0 || loginCustomerInfo == null) &&
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
                    Please Pay {convertToINR(diningBookingAmount)} for Dining Booking
                </p>

                {(diningBookingAmount <= customerAccountBalance) && 
                    <div className="flex flex-col items-center justify-center w-full">
                        <p className="bg-green-400/70 p-2 text-center w-3/4 mb-4">
                            Your Account has Balance {convertToINR(customerAccountBalance)}
                        </p>
                        {!performingPayment &&
                            <Button onClick={payDiningBookingAmount} variant="contained">
                                Pay {convertToINR(diningBookingAmount)}
                            </Button>
                        }
                        {performingPayment &&
                            <Button disabled variant="contained">
                                Please Wait
                            </Button>
                        }
                    </div>    
                }
                {(diningBookingAmount > customerAccountBalance) && 
                    <div className="flex flex-col items-center justify-center w-full">
                        <p className="bg-yellow-300 p-2 text-center w-11/12 mb-4">
                            <FontAwesomeIcon icon={faCircleExclamation} />
                            Warning: Your Account has Insufficient Balance. Current Balance in Account is {convertToINR(customerAccountBalance)}. 
                            Please add {convertToINR(diningBookingAmount - customerAccountBalance)} to your Account.
                        </p>
                        <Button disabled variant="contained">
                            Pay {convertToINR(diningBookingAmount)}
                        </Button>
                    </div>
                }
            </div>
            }
            
        </div>
    );
}

export default DiningProceedPage;