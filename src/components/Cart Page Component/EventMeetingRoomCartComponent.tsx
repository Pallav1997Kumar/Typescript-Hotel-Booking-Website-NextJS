'use client'
import React, { useState } from "react";
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants";
import { deleteParticularBookingFromEventMeetingCart } from "@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice";

import EventMeetingRoomBookingCartComponent from "@/components/Carts Component/EventMeetingRoomBookingCartComponent";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { 
    MultipleContinuousDatesBookingDetailsWithPriceInterface, 
    NonContinuousMultipleDatesBookingDetailsInterface, 
    SingleDateEventBookingDetailsWithPriceInterface 
} from "@/interface/Event Meeting Interface/eventMeetingBookingInterface";
import { AddEventMeetingRoomCartApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";


function EventMeetingRoomCartComponent(){
    return (
        <ErrorBoundary>
            <EventMeetingRoomCartComponentFunctionalComponent />
        </ErrorBoundary>
    );
}

function EventMeetingRoomCartComponentFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const allEventMeetingBookingCart: (NonContinuousMultipleDatesBookingDetailsInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface | SingleDateEventBookingDetailsWithPriceInterface)[] = useAppSelector((reduxStore) => reduxStore.eventMeetingCartSlice.eventMeetingCart);

    const loginUserIdDetails: LoginUserDetails | null = useAppSelector((reduxStore) => reduxStore.userSlice.loginUserDetails);
    
    let loginUserId: null | string = null;
    if(loginUserIdDetails != null){
        loginUserId = loginUserIdDetails.userId;
    }

    const [informationAddingToUserCart, setInformationAddingToUserCart] = useState<boolean>(false);

    function loginButtonClickHandler(){
        const loginPageCalledFrom = 'Event Meeting Room Cart Component';
        const loginRedirectPage = '/cart/events-meeting-room-cart';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }

    async function addAccountCart(){
        try {
            setInformationAddingToUserCart(true);
            if(allEventMeetingBookingCart.length > 0){

                allEventMeetingBookingCart.forEach(async function(eachEventMeeting: NonContinuousMultipleDatesBookingDetailsInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface | SingleDateEventBookingDetailsWithPriceInterface){

                    if(eachEventMeeting.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE){
                        try {
                            const response: Response = await fetch(`/api/add-cart/meeting-events/single-date/${loginUserId}`, {
                                method: 'POST',
                                body: JSON.stringify(eachEventMeeting),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            });
                            const data: AddEventMeetingRoomCartApiResponse = await response.json();
                            if(response.status === 200){
                                if('message' in data){
                                    if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                                        dispatch(deleteParticularBookingFromEventMeetingCart(eachEventMeeting.eventCartId));
                                    }
                                }
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    if(eachEventMeeting.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS){
                        try {
                            const response: Response = await fetch(`/api/add-cart/meeting-events/multiple-dates-continous/${loginUserId}`, {
                                method: 'POST',
                                body: JSON.stringify(eachEventMeeting),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            });
                            const data: AddEventMeetingRoomCartApiResponse = await response.json();
                            if(response.status === 200){
                                if('message' in data){
                                    if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                                        dispatch(deleteParticularBookingFromEventMeetingCart(eachEventMeeting.eventCartId));
                                    }
                                }
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    if(eachEventMeeting.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS){
                        try {
                            const response: Response = await fetch(`/api/add-cart/meeting-events/multiple-dates-non-continous/${loginUserId}`, {
                                method: 'POST',
                                body: JSON.stringify(eachEventMeeting),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            });
                            const data: AddEventMeetingRoomCartApiResponse = await response.json();
                            if(response.status === 200){
                                if('message' in data){
                                    if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                                        dispatch(deleteParticularBookingFromEventMeetingCart(eachEventMeeting.eventCartId));
                                    }
                                }
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }

                });

            }
            
        } 
        catch (errorAccountAdd) {
            console.log(errorAccountAdd);
        }
        finally{
            setInformationAddingToUserCart(false);
        }
    }

    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            {/* Breadcrumb Navigation */}
            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            HOME 
                        </span>
                    </Link> 
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/cart"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            MY CARTS 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/cart/events-meeting-room-cart"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            MY EVENT AND MEETING ROOMS CARTS 
                        </span>
                    </Link>
                </p>
            </div>

            <EventMeetingRoomBookingCartComponent />

            {(allEventMeetingBookingCart.length > 0 && loginUserId === null) && 
                <div className="flex items-center justify-center mt-6 mb-6">
                    <Button onClick={loginButtonClickHandler} variant="contained"> 
                        Please Login For Booking 
                    </Button>
                </div>
            }

            {(allEventMeetingBookingCart.length > 0 && loginUserId !== null) &&
                <div className="flex items-center justify-center mt-6 mb-6"> 
                    {!informationAddingToUserCart && 
                        <Button onClick={addAccountCart} variant="contained"> 
                            Add to Account Cart 
                        </Button>
                    }

                    {informationAddingToUserCart &&
                        <Button disabled variant="contained">
                            Please Wait...
                        </Button>
                    }
                </div>
            }

        </div>
    );
}

export default EventMeetingRoomCartComponent;