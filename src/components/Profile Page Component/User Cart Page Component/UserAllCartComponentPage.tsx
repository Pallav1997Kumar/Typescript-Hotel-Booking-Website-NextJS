'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";
import { addEventMeetingBookingInfo, resetEventMeetingBookingInfo } from "@/redux store/features/Booking Information/eventMeetingBookingInfoSlice";
import { addRoomSuiteBookingInfo, resetRoomSuiteBookingInfo } from "@/redux store/features/Booking Information/roomSuiteBookingInfoSlice";
import { addDiningBookingInfo, resetDiningBookingInfo } from "@/redux store/features/Booking Information/diningBookingInfoSlice";

import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";
import { ROOMS_SUITES_PRESENT_IN_CART, ROOMS_SUITES_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants";
import { EVENT_MEETING_ROOM_PRESENT_IN_CART, EVENT_MEETING_ROOM_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants";
import { DINING_PRESENT_IN_CART, DINING_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants";

import UserRoomSuiteBookingCart from "@/components/User Carts Component/UserRoomSuiteBookingCart";
import UserDiningBookingCart from "@/components/User Carts Component/UserDiningBookingCart";
import UserEventMeetingBookingCart from "@/components/User Carts Component/UserEventMeetingBookingCart";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { DeleteRoomsSuitesCartByCartIdApiResponse, IRoomsSuitesCartInformation, IViewRoomsSuitesCartByCartIdSuccessApiResponse, ViewRoomsSuitesCartByCartIdApiResponse, ViewRoomsSuitesCartByUserIdApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";
import { DeleteDiningCartByCartIdApiResponse, IDiningCartInformation, IViewDiningCartByCartIdSuccessApiResponse, ViewDiningCartByCartIdApiResponse, ViewDiningCartByUserIdApiResponse } from "@/interface/Dining Interface/diningCartApiResponse";
import { DeleteEventMeetingCartByCartIdApiResponse, IEventMeetingRoomContinousMultipleDatesCartInformation, IEventMeetingRoomNonContinousMultipleDatesCartInformation, IEventMeetingRoomSingleDateCartInformation, IViewEventMeetingRoomCartByCartIdErrorApiResponse, IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse, ViewEventMeetingRoomCartByUserIdApiResponse, ViewMultipleContinousDatesEventMeetingRoomCartByCartIdApiResponse, ViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdApiResponse, ViewSingleDateEventMeetingRoomCartByCartIdApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";


interface ICartIdWithRoomBookingDateType {
    id: string;
    roomBookingDateType: string;
}
 

function UserAllCartComponentPageFunctionComponent(){

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

    const [loadingCartDetails, setLoadingCartDetails] = useState<boolean>(true);
    const [proceedBtnClickable, setProceedBtnClickable] = useState<boolean>(true);

    useEffect(()=>{
        fetchAllCartDetails(loginUserId);
        dispatch(resetEventMeetingBookingInfo());
        dispatch(resetRoomSuiteBookingInfo());
        dispatch(resetDiningBookingInfo());
    }, []);

    const [roomSuitesCart, setRoomSuitesCart] = useState<IRoomsSuitesCartInformation[] | null>(null);
    const [diningCart, setDiningCart] = useState<IDiningCartInformation[] | null>(null);
    const [eventMeetingCart, setEventMeetingCart] = useState<(IEventMeetingRoomSingleDateCartInformation | IEventMeetingRoomNonContinousMultipleDatesCartInformation | IEventMeetingRoomContinousMultipleDatesCartInformation)[] | null>(null);

    const [roomSuiteCartIdList, setRoomSuiteCartIdList] = useState<string[]>([]);
    const [eventMeetingCartIdList, setEventMeetingCartIdList] = useState<ICartIdWithRoomBookingDateType[]>([]);
    const [diningCartIdList, setDiningCartIdList] = useState<string[]>([]);


    async function fetchAllCartDetails(loginUserId: string) {
        try {
            await fetchRoomSuiteCartDb(loginUserId);
            await fetchDiningCartDb(loginUserId);
            await fetchEventMeetingCartDb(loginUserId);
        } 
        catch (error) {
            console.log(error);
        }
        finally{
            setLoadingCartDetails(false);
        }
    }

    async function fetchRoomSuiteCartDb(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/view-cart/rooms-suites/search-by-user-id/${loginUserId}`);
            const data: ViewRoomsSuitesCartByUserIdApiResponse = await response.json();
            
            if(response.status === 200){
                if('message' in data){
                    if(data.message === ROOMS_SUITES_CART_IS_EMPTY){
                        const roomSuitesCartDb: IRoomsSuitesCartInformation[] = [];
                        setRoomSuitesCart(roomSuitesCartDb);
                    }
                    else if(data.message === ROOMS_SUITES_PRESENT_IN_CART){
                        const roomSuitesCartDb: IRoomsSuitesCartInformation[] = data.roomSuiteCartInfo;
                        setRoomSuitesCart(roomSuitesCartDb);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchDiningCartDb(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/view-cart/dining/search-by-user-id/${loginUserId}`);
            const data: ViewDiningCartByUserIdApiResponse = await response.json();
            if(response.status === 200){
                if('message' in data){
                    if(data.message === DINING_CART_IS_EMPTY){
                        const diningCartDb: IDiningCartInformation[] = [];
                        setDiningCart(diningCartDb);
                    }
                    else if(data.message === DINING_PRESENT_IN_CART){
                        const diningCartDb: IDiningCartInformation[] | undefined = data.diningCartInfo;
                        if(diningCartDb){
                            setDiningCart(diningCartDb);
                        }
                    }
                }
            }
        } 
        catch (error) {
            console.log(error);
        }
    }

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
    }


    async function removeDiningItemFromCartDb(id: string) {
        try {
            const response: Response = await fetch(`/api/delete-cart/dining/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data: DeleteDiningCartByCartIdApiResponse = await response.json();   
            if(response.status !== 200){

            }  
            if(response.status === 200){
                await fetchDiningCartDb(loginUserId);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }


    async function removeRoomsSuitesItemFromCartDb(id: string){
        try {
            const response: Response = await fetch(`/api/delete-cart/rooms-suites/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data: DeleteRoomsSuitesCartByCartIdApiResponse = await response.json();   
            if(response.status !== 200){
            }  
            if(response.status === 200){
                await fetchRoomSuiteCartDb(loginUserId);
            }   
        } 
        catch (error) {
            console.log(error);
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



    function getDiningCheckedItemsId(idList: string[]){
        setDiningCartIdList(idList);
    }

    function getRoomsSuiteCheckedItemsId(idList: string[]){
        setRoomSuiteCartIdList(idList);
    }

    function getEventMeetingCheckedItemsId(idList: ICartIdWithRoomBookingDateType[]){
        setEventMeetingCartIdList(idList);
    }


    async function addToDiningBookingHandler(){ 
        const diningPaymentCartList: IViewDiningCartByCartIdSuccessApiResponse[] = [];
        try{
            const fetchDiningCartPromise: Promise<ViewDiningCartByCartIdApiResponse>[]  = diningCartIdList.map(async function(eachDiningCartId){
                const diningCartResponse: Response = await fetch(`/api/view-cart/dining/search-by-cart-id/${eachDiningCartId}`);
                const diningCartData: ViewDiningCartByCartIdApiResponse = await diningCartResponse.json();
                return diningCartData;
            });
            const diningCartPromiseResult: ViewDiningCartByCartIdApiResponse[] = await Promise.all(fetchDiningCartPromise);
            diningCartPromiseResult.forEach(function(eachDiningCartPromise: ViewDiningCartByCartIdApiResponse){
                if('cartInfo' in eachDiningCartPromise){
                    const currentDiningCartPromise: IViewDiningCartByCartIdSuccessApiResponse = eachDiningCartPromise;
                    diningPaymentCartList.push(currentDiningCartPromise);
                }
            });
        }
        catch(error){
            console.log(error);
        }
        finally{
            dispatch(addDiningBookingInfo(diningPaymentCartList));
        }
    }

    async function addToRoomSuiteBookingHandler(){ 
        const roomSuitesPaymentCartList: IViewRoomsSuitesCartByCartIdSuccessApiResponse[] = [];
        setProceedBtnClickable(false);
        try{
            const fetchRoomSuiteCartPromise: Promise<ViewRoomsSuitesCartByCartIdApiResponse>[] = roomSuiteCartIdList.map(async function(eachRoomSuiteCartId: string){
                const roomSuitesCartResponse: Response = await fetch(`/api/view-cart/rooms-suites/search-by-cart-id/${eachRoomSuiteCartId}`);
                const roomSuitesCartData: ViewRoomsSuitesCartByCartIdApiResponse = await roomSuitesCartResponse.json();
                return roomSuitesCartData;
            });
            const roomSuitesCartPromiseResult: ViewRoomsSuitesCartByCartIdApiResponse[] = await Promise.all(fetchRoomSuiteCartPromise);
            roomSuitesCartPromiseResult.forEach(function(eachRoomSuiteCartPromise: ViewRoomsSuitesCartByCartIdApiResponse){
                if('cartInfo' in eachRoomSuiteCartPromise){
                    roomSuitesPaymentCartList.push(eachRoomSuiteCartPromise);
                }
            });
        }
        catch(error){

        }
        finally{
            dispatch(addRoomSuiteBookingInfo(roomSuitesPaymentCartList));
        }
    }

    async function addToEventMeetingBookingHandler(){
        const eventMeetingPaymentCartList: (IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse)[] = [];
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
            console.log(eventMeetingPaymentCartList);
            const redirectPage = `/proceed-booking/events-meetings/${loginUserId}`;
            router.push(redirectPage);
        }
    }


    async function addToBookingHandler(){
        try{
            setProceedBtnClickable(false);
            if(diningCartIdList.length > 0){
                await addToDiningBookingHandler();
            }
            if(roomSuiteCartIdList.length > 0){
                await addToRoomSuiteBookingHandler();
            }
            if(eventMeetingCartIdList.length > 0){
                await addToEventMeetingBookingHandler();
            }
        }
        catch(error){
            console.log(error);
        }
        finally{
            const redirectPage = `/proceed-booking/${loginUserId}`;
            router.push(redirectPage);
            setProceedBtnClickable(true);
        }
    }



    return (
        <React.Fragment>

            <div>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
            </div>

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
                </p>
            </div>

            <div className="m-[2%]">
                <h2 className="text-center text-2xl font-bold">MY CARTS</h2>

                <div className="m-[2%_3%]">
                    <h4 className="mb-[1%] text-lg font-semibold">Category Wise Cart</h4>
                    <ol className="ml-[3%] list-[lower-roman]">
                        <li className="py-[0.5%] hover:text-[goldenrod] cursor-pointer">
                            <Link href={`/profile-home-page/my-cart/rooms-suites/${loginUserId}`}>
                                Rooms & Suites Cart
                            </Link>
                        </li>
                        <li className="py-[0.5%] hover:text-[goldenrod] cursor-pointer">
                            <Link href={`/profile-home-page/my-cart/dining/${loginUserId}`}>
                                Dining Cart
                            </Link>
                        </li>
                        <li className="py-[0.5%] hover:text-[goldenrod] cursor-pointer">
                            <Link href={`/profile-home-page/my-cart/event-meeting-rooms/${loginUserId}`}>
                                Events/ Meeting Rooms Cart
                            </Link>
                        </li>
                    </ol>
                </div>

                <div className="m-[2%_4%]">
                    <h3 className="text-xl font-semibold mb-4">All Carts</h3>

                    {loadingCartDetails &&
                        <div className="w-full my-[2%] flex justify-center items-center bg-[rgba(250,219,224,0.5)] min-h-[250px]">
                            <p className="text-[rgb(4,4,116)] font-semibold text-[1.3rem]"> LOADING CART ...</p>
                        </div>
                    }
                    
                    {(!loadingCartDetails &&
                        (roomSuitesCart !== null && roomSuitesCart.length == 0) && 
                        (diningCart !== null && diningCart.length == 0) && 
                        (eventMeetingCart !== null && eventMeetingCart.length == 0)) &&
                        <div className="flex flex-col items-center justify-center bg-amber-50 py-[5%]">
                            <p className="uppercase font-extrabold text-[2rem] font-sans p-[0.5%] leading-[200%] tracking-[1.25px] underline">
                                Your Cart is Empty
                            </p>
                            <p className="uppercase font-extrabold text-[2rem] font-sans p-[0.5%] leading-[200%] tracking-[1.25px] underline">
                                Add Items in Your Cart
                            </p>
                        </div>
                    }

                    {(!loadingCartDetails && roomSuitesCart !== null && roomSuitesCart.length > 0) &&
                        <UserRoomSuiteBookingCart 
                            roomSuitesCart={roomSuitesCart}
                            onGetCheckIdRoomsSuitesCart={getRoomsSuiteCheckedItemsId} 
                            onRemoveRoomsSuitesItemFromCart={removeRoomsSuitesItemFromCartDb}
                        />
                    }

                    {(!loadingCartDetails && diningCart !== null && diningCart.length > 0) &&
                        <UserDiningBookingCart 
                            diningCart={diningCart} 
                            onGetCheckIdDiningCart={getDiningCheckedItemsId}
                            onRemoveDiningItemFromCart={removeDiningItemFromCartDb}
                        />
                    }

                    {(!loadingCartDetails && eventMeetingCart !== null && eventMeetingCart.length > 0) &&
                        <UserEventMeetingBookingCart 
                            eventMeetingCart={eventMeetingCart} 
                            onGetCheckIdEventMeetingCart={getEventMeetingCheckedItemsId}
                            onRemoveEventMeetingItemFromCart={removeEventMeetingItemFromCart}
                        />
                    }


                    {((roomSuitesCart !== null && roomSuitesCart.length > 0) || 
                        (diningCart !== null && diningCart.length > 0) ||
                        (eventMeetingCart !== null && eventMeetingCart.length > 0)) &&
                        <div className="flex justify-center items-center mt-6">

                            {(eventMeetingCartIdList.length > 0 || diningCartIdList.length > 0 || roomSuiteCartIdList.length > 0) &&
                                <div>
                                    {proceedBtnClickable &&
                                        <Button onClick={addToBookingHandler} variant="contained">
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

                            {(!loadingCartDetails && eventMeetingCartIdList.length == 0 && diningCartIdList.length == 0 && roomSuiteCartIdList.length == 0) &&
                                <Button disabled variant="contained">
                                    Procced For Booking
                                </Button>
                            }

                        </div>
                    }

                </div>

            </div>
        </React.Fragment>
    );
}


function UserAllCartComponentPage(){
    return (
        <ErrorBoundary>
            <UserAllCartComponentPageFunctionComponent />
        </ErrorBoundary>
    );
}


export default UserAllCartComponentPage;