'use client'
import React, { useState } from "react";
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';
import { deleteParticularBookingFromRoomCart } from '@/redux store/features/Booking Features/roomBookingCartSlice';
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants";

import RoomsBookingCartComponent from "@/components/Carts Component/RoomsBookingCartComponent";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { IRoomsDetailsForCart } from "@/interface/Rooms and Suites Interface/roomsSuitesBookingInterface";
import { AddRoomsSuitesToCartApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";


function RoomsSuitesCartComponent(){
    return (
        <ErrorBoundary>
            <RoomsSuitesCartComponentFunctionalComponent />
        </ErrorBoundary>
    );
}

function RoomsSuitesCartComponentFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const allRoomBookingCart: IRoomsDetailsForCart[] = useAppSelector((reduxStore) => reduxStore.roomCartSlice.roomCart);

    const loginUserIdDetails: LoginUserDetails | null = useAppSelector((reduxStore) => reduxStore.userSlice.loginUserDetails);
    
    let loginUserId: null | string = null;
    if(loginUserIdDetails != null){
        loginUserId = loginUserIdDetails.userId;
    }

    const [informationAddingToUserCart, setInformationAddingToUserCart] = useState<boolean>(false);

    function loginButtonClickHandler(){
        const loginPageCalledFrom = 'Rooms and Suites Cart Component';
        const loginRedirectPage = '/cart/rooms-and-suites-cart';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }

    async function addAccountCart(){
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
                    <Link href="/cart/rooms-and-suites-cart"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            MY ROOMS AND SUITES CARTS 
                        </span>
                    </Link>
                </p>
            </div>

            <RoomsBookingCartComponent />

            {(allRoomBookingCart.length > 0 && loginUserId === null) && 
                <div className="flex items-center justify-center mt-6 mb-6">
                    <Button onClick={loginButtonClickHandler} variant="contained"> 
                        Please Login For Booking 
                    </Button>
                </div>
            }

            {(allRoomBookingCart.length > 0 && loginUserId !== null) &&
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

export default RoomsSuitesCartComponent;