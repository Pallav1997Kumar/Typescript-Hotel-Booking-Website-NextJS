'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";
import { addEventMeetingBookingInfo, resetEventMeetingBookingInfo } from "@/redux store/features/Booking Information/eventMeetingBookingInfoSlice";

import { EVENT_MEETING_ROOM_PRESENT_IN_CART, EVENT_MEETING_ROOM_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";

import UserEventMeetingBookingCart from "@/components/User Carts Component/UserEventMeetingBookingCart";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { DeleteEventMeetingCartByCartIdApiResponse, IEventMeetingRoomContinousMultipleDatesCartInformation, IEventMeetingRoomNonContinousMultipleDatesCartInformation, IEventMeetingRoomSingleDateCartInformation, IViewEventMeetingRoomCartByCartIdErrorApiResponse, IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse, ViewEventMeetingRoomCartByUserIdApiResponse, ViewMultipleContinousDatesEventMeetingRoomCartByCartIdApiResponse, ViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdApiResponse, ViewSingleDateEventMeetingRoomCartByCartIdApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";


interface ICartIdWithRoomBookingDateType {
    id: string;
    roomBookingDateType: string;
}


function UserEventMeetingCartPageComponentFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    useEffect(function() {
        if (loginUserDetails == null) {
            const loginPageCalledFrom = 'My Cart Page';
            const loginRedirectPage = '/profile-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/login');
        }
    }, [loginUserDetails, dispatch, router]);

    if(loginUserDetails == null){
        return null;
    }

    const loginUserId: string = loginUserDetails.userId;

    useEffect(()=>{
        fetchEventMeetingCartDb(loginUserId);
        dispatch(resetEventMeetingBookingInfo());
    }, []);

    const [loadingCartDetails, setLoadingCartDetails] = useState<boolean>(true);
    const [proceedBtnClickable, setProceedBtnClickable] = useState<boolean>(true);

    const [eventMeetingCart, setEventMeetingCart] = useState<(IEventMeetingRoomSingleDateCartInformation | IEventMeetingRoomNonContinousMultipleDatesCartInformation | IEventMeetingRoomContinousMultipleDatesCartInformation)[] | null>(null);
    const [eventMeetingCartIdList, setEventMeetingCartIdList] = useState<ICartIdWithRoomBookingDateType[]>([]);


    async function fetchEventMeetingCartDb(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/view-cart/meeting-events/search-by-user-id/${loginUserId}`);
            const data: ViewEventMeetingRoomCartByUserIdApiResponse = await response.json();
            if(response.status === 200){
                if('message' in data){
                    if(data.message === EVENT_MEETING_ROOM_CART_IS_EMPTY){
                        const eventMeetingCartDb: (IEventMeetingRoomSingleDateCartInformation | IEventMeetingRoomNonContinousMultipleDatesCartInformation | IEventMeetingRoomContinousMultipleDatesCartInformation)[] = [];
                        setEventMeetingCart(eventMeetingCartDb);
                    }
                    else if(data.message === EVENT_MEETING_ROOM_PRESENT_IN_CART){
                        const eventMeetingCartDb: (IEventMeetingRoomSingleDateCartInformation | IEventMeetingRoomNonContinousMultipleDatesCartInformation | IEventMeetingRoomContinousMultipleDatesCartInformation)[] | undefined = data.eventMeetingCartInfo;
                        if(eventMeetingCartDb){
                            setEventMeetingCart(eventMeetingCartDb);
                        }
                    }
                }
            }
        } 
        catch (error) {
            console.log(error);
        }
        finally{
            setLoadingCartDetails(false);
        }
    }


    async function removeEventMeetingItemFromCart(id: string, bookingType: string){
        if(bookingType === roomBookingDateTypeConstants.SINGLE_DATE){
            await removeEventMeetingSingleDateItemFromCartDb(id);
        }
        else if(bookingType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS){
            await removeEventMeetingMultipleDatesContinuousItemFromCartDb(id);
        }
        else if(bookingType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS){
            await removeEventMeetingMultipleDatesNonContinuousItemFromCartDb(id);
        }
    }


    async function removeEventMeetingSingleDateItemFromCartDb(id: string){
        try {
            const response: Response = await fetch(`/api/delete-cart/meeting-events/single-date/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data: DeleteEventMeetingCartByCartIdApiResponse = await response.json();   
            if(response.status !== 200){
                
            } 
            if(response.status === 200){
                await fetchEventMeetingCartDb(loginUserId);
            } 
        } 
        catch (error) {
            console.log(error);
        }
    }


    async function removeEventMeetingMultipleDatesContinuousItemFromCartDb(id: string){
        try {
            const response: Response = await fetch(`/api/delete-cart/meeting-events/multiple-dates-continous/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data: DeleteEventMeetingCartByCartIdApiResponse = await response.json();   
            if(response.status !== 200){
            }  
            if(response.status === 200){
                await fetchEventMeetingCartDb(loginUserId);
            } 
        } 
        catch (error) {
            console.log(error);
        }
    }


    async function removeEventMeetingMultipleDatesNonContinuousItemFromCartDb(id: string){
        try {
            const response: Response = await fetch(`/api/delete-cart/meeting-events/multiple-dates-non-continous/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data: DeleteEventMeetingCartByCartIdApiResponse = await response.json();   
            if(response.status !== 200){
            }  
            if(response.status === 200){
                await fetchEventMeetingCartDb(loginUserId);
            } 
        } 
        catch (error) {
            console.log(error);
        }
    }


    function getEventMeetingCheckedItemsId(idList: ICartIdWithRoomBookingDateType[]){
        setEventMeetingCartIdList(idList);
    }

    async function addToEventMeetingBookingHandler(){
        const eventMeetingPaymentCartList: (IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse)[] = [];
        setProceedBtnClickable(false);
        try{
            const fetchEventMeetingCartPromise: Promise<ViewSingleDateEventMeetingRoomCartByCartIdApiResponse | ViewMultipleContinousDatesEventMeetingRoomCartByCartIdApiResponse | ViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdApiResponse>[] = eventMeetingCartIdList.map(async function(eachEventMeetingCartId: ICartIdWithRoomBookingDateType){
                if(eachEventMeetingCartId.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE){
                    const eventMeetingCartResponse: Response = await fetch(`/api/view-cart/meeting-events/search-by-cart-id/single-date/${eachEventMeetingCartId.id}`);
                    const eventMeetingCartData: ViewSingleDateEventMeetingRoomCartByCartIdApiResponse = await eventMeetingCartResponse.json();
                    return eventMeetingCartData;
                                       
                }
                else if(eachEventMeetingCartId.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS){
                    const eventMeetingCartResponse: Response = await fetch(`/api/view-cart/meeting-events/search-by-cart-id/multiple-dates-continous/${eachEventMeetingCartId.id}`);
                    const eventMeetingCartData: ViewMultipleContinousDatesEventMeetingRoomCartByCartIdApiResponse = await eventMeetingCartResponse.json();
                    return eventMeetingCartData; 
                }
                else if(eachEventMeetingCartId.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS){
                    const eventMeetingCartResponse: Response = await fetch(`/api/view-cart/meeting-events/search-by-cart-id/multiple-dates-non-continous/${eachEventMeetingCartId.id}`);
                    const eventMeetingCartData: ViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdApiResponse = await eventMeetingCartResponse.json();
                    return eventMeetingCartData; 
                }
                else {
                    throw new Error("eachEventMeetingCartId.roomBookingDateType is different");
                }
            });
            const eventMeetingCartPromiseResult: (ViewSingleDateEventMeetingRoomCartByCartIdApiResponse | ViewMultipleContinousDatesEventMeetingRoomCartByCartIdApiResponse | ViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdApiResponse)[] = await Promise.all(fetchEventMeetingCartPromise);
            eventMeetingCartPromiseResult.forEach(function(eachEventMeetingCartPromise){
                if('cartInfo' in eachEventMeetingCartPromise){
                    eventMeetingPaymentCartList.push(eachEventMeetingCartPromise);
                }
            });
        }
        catch(error){
            console.log(error);
        }
        finally{
            dispatch(addEventMeetingBookingInfo(eventMeetingPaymentCartList));
            const redirectPage = `/proceed-booking/events-meetings/${loginUserId}`;
            router.push(redirectPage);
            setProceedBtnClickable(true);
        }
    }



    if(!loadingCartDetails && eventMeetingCart !== null && eventMeetingCart.length == 0){
        return (
            <React.Fragment>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

                <div className="m-6 bg-[#f0f8ff] p-4">
                    <p className="text-xl font-bold tracking-wider text-blueviolet">
                        <Link href="/">
                            <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                                HOME 
                            </span>
                        </Link> 
                        <span className="px-3">{'>>'}</span> 
                        <Link href="/profile-home-page"> 
                            <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                                PROFILE PAGE 
                            </span>
                        </Link>
                        <span className="px-3">{'>>'}</span> 
                        <Link href={`/profile-home-page/my-cart/${loginUserId}`}> 
                            <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                                MY ACCOUNT CART 
                            </span>
                        </Link>
                        <span className="px-3">{'>>'}</span>
                        <Link href={`/profile-home-page/my-cart/event-meeting-rooms/${loginUserId}`}> 
                            <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                                MY ACCOUNT EVENTS AND MEETING ROOM CART 
                            </span>
                        </Link>
                    </p>
                </div>

                <div className="bg-azure flex flex-col items-center justify-center py-[5%]">
                    <p className="uppercase underline text-2xl font-extrabold font-sans pb-[1.25%]">
                        Meeting and Event Rooom Cart is Empty
                    </p>
                    <p className="uppercase underline text-2xl font-extrabold font-sans pb-[1.25%]">
                        Click on Below Button to Add Items
                    </p>
                    <Link href={`/meetings-events/`} passHref>
                        <Button variant="contained">Meeting and Event Room Page</Button>
                    </Link>
                </div>
            </React.Fragment>
        );
    }


    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
            
            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            HOME 
                        </span>
                    </Link> 
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/profile-home-page"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            PROFILE PAGE 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span> 
                    <Link href={`/profile-home-page/my-cart/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            MY ACCOUNT CART 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span>
                    <Link href={`/profile-home-page/my-cart/event-meeting-rooms/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            MY ACCOUNT EVENTS AND MEETING ROOM CART 
                        </span>
                    </Link>
                </p>
            </div>

            {loadingCartDetails &&
                <div className="w-full my-[2%] flex justify-center items-center bg-[rgba(250,219,224,0.5)] min-h-[250px]">
                    <p className="text-[rgb(4,4,116)] font-semibold text-[1.3rem]"> 
                        LOADING CART ...
                    </p>
                </div>
            }

            <div className="m-[2%]">
                {(!loadingCartDetails && eventMeetingCart !== null && eventMeetingCart.length > 0) &&
                    <UserEventMeetingBookingCart 
                        eventMeetingCart={eventMeetingCart} 
                        onGetCheckIdEventMeetingCart={getEventMeetingCheckedItemsId}
                        onRemoveEventMeetingItemFromCart={removeEventMeetingItemFromCart}
                    />
                }

                {(eventMeetingCart !== null && eventMeetingCart.length > 0 && eventMeetingCartIdList.length > 0) &&
                    <div className="flex justify-center items-center mt-[2%]">
                        {proceedBtnClickable && 
                            <Button onClick={addToEventMeetingBookingHandler} variant="contained">
                                Procced For Booking
                            </Button>
                        }
                        {!proceedBtnClickable &&
                            <Button disabled variant="contained">
                                Please Wait
                            </Button>
                        } 
                    </div>
                }

                {(eventMeetingCart !== null && eventMeetingCart.length > 0 && eventMeetingCartIdList.length == 0) &&
                    <div className="flex justify-center items-center mt-[2%]">
                        <Button disabled variant="contained">
                            Procced For Booking
                        </Button>
                    </div>
                }
            </div>
        </div>
    );

}


function UserEventMeetingCartPageComponent(){
    return (
        <ErrorBoundary>
            <UserEventMeetingCartPageComponentFunctionalComponent />
        </ErrorBoundary>
    );
}


export default UserEventMeetingCartPageComponent;