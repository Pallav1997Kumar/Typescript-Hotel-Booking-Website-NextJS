'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";
import { addRoomSuiteBookingInfo, resetRoomSuiteBookingInfo } from "@/redux store/features/Booking Information/roomSuiteBookingInfoSlice";

import { ROOMS_SUITES_PRESENT_IN_CART, ROOMS_SUITES_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants";

import UserRoomSuiteBookingCart from "@/components/User Carts Component/UserRoomSuiteBookingCart";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { DeleteRoomsSuitesCartByCartIdApiResponse, IRoomsSuitesCartInformation, IViewRoomsSuitesCartByCartIdSuccessApiResponse, ViewRoomsSuitesCartByCartIdApiResponse, ViewRoomsSuitesCartByUserIdApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";


function UserRoomsSuitesCartPageComponentFunctionalComponent(){

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
        fetchRoomSuiteCartDb(loginUserId);
        dispatch(resetRoomSuiteBookingInfo());
    }, []);

    const [loadingCartDetails, setLoadingCartDetails] = useState<boolean>(true);
    const [proceedBtnClickable, setProceedBtnClickable] = useState<boolean>(true);

    const [roomSuitesCart, setRoomSuitesCart] = useState<IRoomsSuitesCartInformation[] | null>(null);
    const [roomSuiteCartIdList, setRoomSuiteCartIdList] = useState<string[]>([]);

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
        } 
        catch (error) {
            console.log(error);
        }
        finally{
            setLoadingCartDetails(false);
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

    function getRoomsSuiteCheckedItemsId(idList: string[]){
        setRoomSuiteCartIdList(idList);
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
            const redirectPage = `/proceed-booking/rooms-suites/${loginUserId}`;
            router.push(redirectPage);
            setProceedBtnClickable(true);
        }
    }


    if(!loadingCartDetails && roomSuitesCart !== null && roomSuitesCart.length == 0){
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
                        <Link href={`/profile-home-page/my-cart/rooms-suites/${loginUserId}`}> 
                            <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                                MY ACCOUNT ROOMS AND SUITES CART 
                            </span>
                        </Link>
                    </p>
                </div>

                <div className="bg-azure flex flex-col items-center justify-center py-[5%]">
                    <p className="uppercase underline text-2xl font-extrabold font-sans pb-[1.25%]">
                        Rooms And Suites Cart is Empty
                    </p>
                    <p className="uppercase underline text-2xl font-extrabold font-sans pb-[1.25%]">
                        Click on Below Button to Add Items
                    </p>
                    <Link href={`/rooms-suites/`} passHref>
                        <Button variant="contained">Rooms And Suites Page</Button>
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
                    <Link href={`/profile-home-page/my-cart/rooms-suites/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            MY ACCOUNT ROOMS AND SUITES CART 
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
                {(!loadingCartDetails && roomSuitesCart !== null && roomSuitesCart.length > 0) &&
                    <UserRoomSuiteBookingCart 
                        roomSuitesCart={roomSuitesCart} 
                        onGetCheckIdRoomsSuitesCart={getRoomsSuiteCheckedItemsId}
                        onRemoveRoomsSuitesItemFromCart={removeRoomsSuitesItemFromCartDb}
                    />
                }

                {(roomSuitesCart !== null && roomSuitesCart.length > 0 && roomSuiteCartIdList.length > 0) &&
                    <div className="flex justify-center items-center mt-[2%]">
                        {proceedBtnClickable && 
                            <Button onClick={addToRoomSuiteBookingHandler} variant="contained">
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

                {(roomSuitesCart !== null && roomSuitesCart.length > 0 && roomSuiteCartIdList.length == 0) &&
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


function UserRoomsSuitesCartPageComponent(){
    return (
        <ErrorBoundary>
            <UserRoomsSuitesCartPageComponentFunctionalComponent />
        </ErrorBoundary>
    );
}

export default UserRoomsSuitesCartPageComponent;