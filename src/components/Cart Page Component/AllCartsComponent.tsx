'use client'
import Image from 'next/image';
import React, { useState } from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { wrapper } from '@/redux store/storePersistance';

import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';
import { deleteParticularBookingFromRoomCart } from '@/redux store/features/Booking Features/roomBookingCartSlice';
import { deleteParticularBookingFromDiningCart } from '@/redux store/features/Booking Features/diningBookingCartSlice';
import { deleteParticularBookingFromEventMeetingCart } from '@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice';
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants";
import { useAppDispatch, useAppSelector } from '@/redux store/hooks';

import RoomsBookingCartComponent from "@/components/Carts Component/RoomsBookingCartComponent";
import DiningBookingCartComponent from "@/components/Carts Component/DiningBookingCartComponent";
import EventMeetingRoomBookingCartComponent from "@/components/Carts Component/EventMeetingRoomBookingCartComponent";
import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary';

import { IRoomsDetailsForCart } from '@/interface/Rooms and Suites Interface/roomsSuitesBookingInterface';
import { DiningDetailsForCart } from '@/interface/Dining Interface/diningBookingInterface';
import { MultipleContinuousDatesBookingDetailsWithPriceInterface, NonContinuousMultipleDatesBookingDetailsInterface, SingleDateEventBookingDetailsWithPriceInterface } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';
import { LoginUserDetails } from '@/redux store/features/Auth Features/loginUserDetailsSlice';
import { AddEventMeetingRoomCartApiResponse } from '@/interface/Event Meeting Interface/eventMeetingCartApiResponse';
import { AddDiningCartApiResponse } from '@/interface/Dining Interface/diningCartApiResponse';
import { AddRoomsSuitesToCartApiResponse } from '@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse';


function AllCartsComponent(){
    return (
        <ErrorBoundary>
            <AllCartsComponentFunctionalComponent />
        </ErrorBoundary>
    );
}



function AllCartsComponentFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const allRoomBookingCart: IRoomsDetailsForCart[] = useAppSelector((reduxStore) => reduxStore.roomCartSlice.roomCart);
    const allDiningBookingCart: DiningDetailsForCart[] = useAppSelector((reduxStore) => reduxStore.diningCartSlice.diningCart);
    const allEventMeetingBookingCart: (NonContinuousMultipleDatesBookingDetailsInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface | SingleDateEventBookingDetailsWithPriceInterface)[] = useAppSelector((reduxStore) => reduxStore.eventMeetingCartSlice.eventMeetingCart);

    const loginUserIdDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    
    let loginUserId: null | string = null;
    if(loginUserIdDetails != null){
        loginUserId = loginUserIdDetails.userId;
    }

    const [informationAddingToUserCart, setInformationAddingToUserCart] = useState<boolean>(false);


    function loginButtonClickHandler(){
        const loginPageCalledFrom = 'Cart Component';
        const loginRedirectPage = '/cart';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }

    async function addAccountCart() {
        try {
            setInformationAddingToUserCart(true);
            if(allRoomBookingCart.length > 0){
                allRoomBookingCart.forEach(async function(eachRoomCart){
                    try {
                        const response: Response = await fetch(`/api/add-cart/rooms-suites/${loginUserId}`, {
                            method: 'POST',
                            body: JSON.stringify(eachRoomCart),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            }
                        });
                        const data: AddRoomsSuitesToCartApiResponse = await response.json();
                        if(response.status === 200){
                            if('message' in data){
                                if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                                    dispatch(deleteParticularBookingFromRoomCart(eachRoomCart.roomCartId));
                                }
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
            }

            if(allDiningBookingCart.length > 0){
                allDiningBookingCart.forEach(async function(eachDiningCart){
                    try {
                        const response: Response = await fetch(`/api/add-cart/dining/${loginUserId}`, {
                            method: 'POST',
                            body: JSON.stringify(eachDiningCart),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            }
                        });
                        const data: AddDiningCartApiResponse = await response.json();
                        if(response.status === 200){
                            if('message' in data){
                                if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                                    dispatch(deleteParticularBookingFromDiningCart(eachDiningCart.diningCartId));
                                }
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
            }

            if(allEventMeetingBookingCart.length > 0){

                allEventMeetingBookingCart.forEach(async function(eachEventMeeting){

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
        finally {
            setInformationAddingToUserCart(false);
        }     
    }


    return(
        <React.Fragment>
            <div>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
            </div>

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
                </p>
            </div>

            <div className="m-[2%]">
                <h2 className="text-center text-2xl font-bold">MY CARTS</h2>
                <div className="m-4">
                    <h4 className="mb-[1%] text-lg font-semibold">Category Wise Cart</h4>
                    <ol className="ml-[3%] list-[lower-roman]">
                        <li className="py-[0.5%] hover:text-[goldenrod] cursor-pointer">
                            <Link href="/cart/rooms-and-suites-cart">Rooms & Suites Cart</Link>
                        </li>
                        <li className="py-[0.5%] hover:text-[goldenrod] cursor-pointer">
                            <Link href="/cart/dining-cart">Dining Cart</Link>
                        </li>
                        <li className="py-[0.5%] hover:text-[goldenrod] cursor-pointer">
                            <Link href="/cart/events-meeting-room-cart">Events/ Meeting Rooms Cart</Link>
                        </li>
                    </ol>
                </div>

                <div className="m-4">
                    <h3 className="text-xl font-semibold">All Carts</h3>

                    {/* Empty Cart Condition */}
                    {(allRoomBookingCart.length == 0 && allDiningBookingCart.length == 0 && allEventMeetingBookingCart.length == 0) &&
                        <div className="flex flex-col items-center justify-center bg-amber-100 p-12">
                            <p className="uppercase font-extrabold text-2xl tracking-wider text-center underline">
                                Your Cart is Empty
                            </p>
                            <p className="text-center text-xl font-semibold">
                                Add Items in Your Cart
                            </p>
                        </div>
                    }

                    {/* Room Booking Cart */}
                    {(allRoomBookingCart.length > 0) &&
                    <RoomsBookingCartComponent />
                    }

                    {/* Dining Booking Cart */}
                    {(allDiningBookingCart.length > 0) &&
                    <DiningBookingCartComponent />
                    }

                    {/* Event Meeting Room Booking Cart */}
                    {(allEventMeetingBookingCart.length > 0) &&
                    <EventMeetingRoomBookingCartComponent />
                    }

                    {/* Login Button */}
                    {(loginUserId == null 
                        && (allEventMeetingBookingCart.length > 0 
                            || allDiningBookingCart.length > 0 
                            || allRoomBookingCart.length > 0)) &&
                        <div className="flex items-center justify-center mt-6">
                            <Link href={`/login`} passHref>
                                <Button onClick={loginButtonClickHandler} variant="contained"> 
                                    Please Login For Booking
                                </Button>
                            </Link>
                        </div>
                    }

                    {/* Proceed Button */}
                    {(loginUserId != null 
                        && (allEventMeetingBookingCart.length > 0 
                            || allDiningBookingCart.length > 0 
                            || allRoomBookingCart.length > 0)) &&
                        <div className="flex items-center justify-center mt-6">
                            {!informationAddingToUserCart && 
                                <Button onClick={addAccountCart} variant="contained"> 
                                    Add to Account Cart 
                                </Button>
                            }
                            {informationAddingToUserCart &&
                                <Button disabled variant="contained">Please Wait...</Button>
                            }
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

export default AllCartsComponent;