'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";
import { addDiningBookingInfo, resetDiningBookingInfo } from "@/redux store/features/Booking Information/diningBookingInfoSlice";

import { DINING_PRESENT_IN_CART, DINING_CART_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants";

import UserDiningBookingCart from "@/components/User Carts Component/UserDiningBookingCart";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice"; 
import { DeleteDiningCartByCartIdApiResponse, IDiningCartInformation, IViewDiningCartByCartIdSuccessApiResponse, ViewDiningCartByCartIdApiResponse, ViewDiningCartByUserIdApiResponse } from "@/interface/Dining Interface/diningCartApiResponse";


function UserDiningCartPageComponentFunctionalComponent(){

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
        fetchDiningCartDb(loginUserId);
        dispatch(resetDiningBookingInfo());
    }, []);

    const [loadingCartDetails, setLoadingCartDetails] = useState<boolean>(true);
    const [proceedBtnClickable, setProceedBtnClickable] = useState<boolean>(true);

    const [diningCart, setDiningCart] = useState<IDiningCartInformation[] | null>(null);
    const [diningCartIdList, setDiningCartIdList] = useState<string[]>([]);


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
        finally{
            setLoadingCartDetails(false);
        }
    }


    async function removeDiningItemFromCartDb(id: string){
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


    function getDiningCheckedItemsId(idList: string[]){
        setDiningCartIdList(idList);
    }

    async function addToDiningBookingHandler(){ 
        const diningPaymentCartList: IViewDiningCartByCartIdSuccessApiResponse[] = [];
        setProceedBtnClickable(false);
        try{
            const fetchDiningCartPromise: Promise<ViewDiningCartByCartIdApiResponse>[] = diningCartIdList.map(async function(eachDiningCartId: string){
                const diningCartResponse: Response = await fetch(`/api/view-cart/dining/search-by-cart-id/${eachDiningCartId}`);
                const diningCartData: ViewDiningCartByCartIdApiResponse = await diningCartResponse.json();              
                return diningCartData;
            });
            const diningCartPromiseResult: ViewDiningCartByCartIdApiResponse[] = await Promise.all(fetchDiningCartPromise);
            diningCartPromiseResult.forEach(function(eachDiningCartPromise: ViewDiningCartByCartIdApiResponse){
                if('cartInfo' in eachDiningCartPromise){
                    diningPaymentCartList.push(eachDiningCartPromise);
                }
            });
        }
        catch(error){

        }
        finally{
            dispatch(addDiningBookingInfo(diningPaymentCartList));
            const redirectPage = `/proceed-booking/dining/${loginUserId}`;
            router.push(redirectPage);
            setProceedBtnClickable(true);
        }
    }


    if(!loadingCartDetails && diningCart !== null && diningCart.length == 0){
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
                        <Link href={`/profile-home-page/my-cart/dining/${loginUserId}`}> 
                            <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                                MY ACCOUNT DINING CART 
                            </span>
                        </Link>
                    </p>
                </div>

                <div className="bg-azure flex flex-col items-center justify-center py-[5%]">
                    <p className="uppercase underline text-2xl font-extrabold font-sans pb-[1.25%]">
                        Dining Cart is Empty
                    </p>
                    <p className="uppercase underline text-2xl font-extrabold font-sans pb-[1.25%]">
                        Click on Below Button to Add Items
                    </p>
                    <Link href={`/dining/`} passHref>
                        <Button variant="contained">Dining Page</Button>
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
                    <Link href={`/profile-home-page/my-cart/dining/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            MY ACCOUNT DINING CART 
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
                {(!loadingCartDetails && diningCart !== null && diningCart.length > 0) &&
                    <UserDiningBookingCart 
                        diningCart={diningCart} 
                        onGetCheckIdDiningCart={getDiningCheckedItemsId}
                        onRemoveDiningItemFromCart={removeDiningItemFromCartDb}
                    />
                }

                {(diningCart !== null && diningCart.length > 0 && diningCartIdList.length > 0) &&
                    <div className="flex justify-center items-center mt-[2%]">
                        {proceedBtnClickable && 
                            <Button onClick={addToDiningBookingHandler} variant="contained">
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

                {(diningCart !== null && diningCart.length > 0 && diningCartIdList.length == 0) &&
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


function UserDiningCartPageComponent(){
    return (
        <ErrorBoundary>
            <UserDiningCartPageComponentFunctionalComponent />
        </ErrorBoundary>
    );
}


export default UserDiningCartPageComponent;