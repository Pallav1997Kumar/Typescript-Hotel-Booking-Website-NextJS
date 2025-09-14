'use client'
import React, { useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { logout } from "@/redux store/features/Auth Features/loginUserDetailsSlice";

import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { AdminLogoutResponse } from "@/interface/Hotel User Interface/hotelAdminInterface";


function AdminHomePage(){
    return (
        <ErrorBoundary>
            <AdminHomePageFunctionalComponent />
        </ErrorBoundary>
    );
}


function AdminHomePageFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    let loginUserId: string | undefined;
    let loginUserFullName: string | undefined;
    let loginEmailAddress: string | undefined;

    if(loginUserDetails != null){
        loginUserId = loginUserDetails.userId;
        loginEmailAddress = loginUserDetails.emailAddress;
        loginUserFullName = loginUserDetails.fullName;
    }

    useEffect(function(){
        if(loginUserDetails == null){
            const loginPageCalledFrom = 'Admin Home Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
        }
        if(loginUserDetails != null && 
            !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
                const loginPageCalledFrom = 'Admin Home Page';
                const loginRedirectPage = '/admin-home-page';
                dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
                dispatch(updateLoginRedirectPage(loginRedirectPage));
                router.push('/admin-login');
        }
    }, [loginUserDetails, dispatch, router])


    async function logoutHandler() {
        try {
            const response: Response = await fetch(`/api/users-authentication/admin-authentication/logout`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                }
            );
            const data: AdminLogoutResponse = await response.json();

            if(response.status === 200){
                const loginPageCalledFrom = 'Admin Home Page';
                const loginRedirectPage = '/admin-home-page';
                dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
                dispatch(updateLoginRedirectPage(loginRedirectPage));
                router.push('/admin-login');
                dispatch(logout());
                localStorage.removeItem('loginUserDetails');
            }
        } catch (error) {
            
        }
    }
    

    return (
        <div className="my-12">

            <h1 className="text-5xl text-center uppercase">
                Welcome
            </h1>
            <h3 className="text-center text-2xl uppercase mt-4 mb-12">
                {loginUserFullName}
            </h3>
            
            <div className="bg-emerald-100 p-8">
                <ul>
                    
                    <li className="list-none py-2 px-4 my-1 border-b border-dashed border-blue-600 hover:bg-aquamarine hover:cursor-pointer">
                        <Link href={"/admin-home-page/view-current-bookings"}>
                            View Current Bookings
                        </Link>
                    </li>
                    
                    <li className="list-none py-2 px-4 my-1 border-b border-dashed border-blue-600 hover:bg-aquamarine hover:cursor-pointer">
                    <Link href={"/admin-home-page/view-past-bookings"}>
                            View Past Bookings
                        </Link>
                    </li>

                    <li className="list-none py-2 px-4 my-1 border-b border-dashed border-blue-600 hover:bg-aquamarine hover:cursor-pointer">
                    <Link href={"/admin-home-page/view-transaction-history?page=1"}>
                            View Transaction History
                        </Link>
                    </li>
                    
                    <li 
                        onClick ={logoutHandler}
                        className="list-none py-2 px-4 my-1 border-b border-dashed border-blue-600 hover:bg-aquamarine hover:cursor-pointer"
                    >
                        Logout
                    </li>
                </ul>
            </div>

        </div>
    );
}


export default AdminHomePage;