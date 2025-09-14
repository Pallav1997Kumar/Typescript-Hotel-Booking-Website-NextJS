'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { LoginUserDetails, logout } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LogoutResponse } from "@/interface/Hotel User Interface/hotelUsersInterfce";


function ProfileHomePageFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore) => reduxStore.userSlice.loginUserDetails);

    const [redirectHandled, setRedirectHandled] = useState<Boolean>(false);

    useEffect(() => {
        if (loginUserDetails == null && !redirectHandled) {
            const loginPageCalledFrom = 'Profile Page';
            const loginRedirectPage = '/profile-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/login');
            setRedirectHandled(true);
        }
    }, [loginUserDetails, dispatch, router, redirectHandled]);


    let loginUserId : string= '';
    let loginUserFullName: string = '';


    if(loginUserDetails != null){
        loginUserId = loginUserDetails.userId;
        loginUserFullName = loginUserDetails.fullName;
    }  
    

    async function logoutHandler() {
        try {
            const response: Response = await fetch(`/api/users-authentication/customers-authenticatication/logout`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data: LogoutResponse = await response.json();
            if(response.status === 200){
                const loginPageCalledFrom = 'Profile Page';
                const loginRedirectPage = '/profile-home-page';
                dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
                dispatch(updateLoginRedirectPage(loginRedirectPage));
                router.push('/login');
                dispatch(logout());
                localStorage.removeItem('loginUserDetails');
            }
        } catch (error) {
            
        }
    }
    

    return (
        <div className="my-12">

            {(loginUserDetails != null) && 
                <h1 className="text-5xl text-center uppercase">Welcome</h1>
            }
            {(loginUserDetails != null) && 
                <h3 className="text-2xl text-center mt-4 mb-12 uppercase">{loginUserFullName}</h3>
            }
            
            {(loginUserDetails != null) && 
                <div className="bg-green-100 p-6">
                    <ul>
                        <li className="py-2 px-4 mb-1 border-b border-dashed border-blue-500 hover:bg-aquamarine cursor-pointer">
                            <Link href={`/profile-home-page/edit-personal-information/${loginUserId}`}>
                                Edit Personal Information
                            </Link>
                        </li>
                        <li className="py-2 px-4 mb-1 border-b border-dashed border-blue-500 hover:bg-aquamarine cursor-pointer">
                            <Link href={`/profile-home-page/change-password/${loginUserId}`}>
                                Change Account Password
                            </Link>
                        </li>
                        <li className="py-2 px-4 mb-1 border-b border-dashed border-blue-500 hover:bg-aquamarine cursor-pointer">
                            <Link href={`/profile-home-page/my-cart/${loginUserId}`}>
                                My Account Cart
                            </Link>
                        </li>
                        <li className="py-2 px-4 mb-1 border-b border-dashed border-blue-500 hover:bg-aquamarine cursor-pointer">
                            <Link href="/cart">
                                My Browser Cart
                            </Link>
                        </li>
                        <li className="py-2 px-4 mb-1 border-b border-dashed border-blue-500 hover:bg-aquamarine cursor-pointer">
                            <Link href={`/profile-home-page/view-current-bookings/${loginUserId}`}>
                                View Current Bookings
                            </Link>
                        </li>
                        <li className="py-2 px-4 mb-1 border-b border-dashed border-blue-500 hover:bg-aquamarine cursor-pointer">
                        <Link href={`/profile-home-page/view-past-bookings/${loginUserId}`}>
                                View Past Bookings
                            </Link>
                        </li>
                        <li className="py-2 px-4 mb-1 border-b border-dashed border-blue-500 hover:bg-aquamarine cursor-pointer">
                            <Link href={`/profile-home-page/view-account-balance/${loginUserId}`}>
                                View Account Balance
                            </Link>
                        </li>
                        <li className="py-2 px-4 mb-1 border-b border-dashed border-blue-500 hover:bg-aquamarine cursor-pointer">
                            <Link href={`/profile-home-page/add-money-account/${loginUserId}`}>
                                Add Money to Account
                            </Link>
                        </li>

                        <li onClick ={logoutHandler} className="py-2 px-4 mb-1 border-b border-dashed border-blue-500 hover:bg-aquamarine cursor-pointer">
                            Logout
                        </li>
                    </ul>
                </div>
            }
        </div>
    );
}


function ProfileHomePage(){
    return (
        <ErrorBoundary>
            <ProfileHomePageFunctionalComponent />
        </ErrorBoundary>
    );
}


export default ProfileHomePage;