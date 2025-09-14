'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";


function NavbarFunctionalComponent(){
    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    const dispatch = useAppDispatch();

    const [hasMounted, setHasMounted] = useState<Boolean>(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null; 
    }
    
    let loginUserId: string | undefined;
    let loginEmailAddress: string | undefined;
    let loginUserFullName: string | undefined;

    if(loginUserDetails != null){
        loginUserId = loginUserDetails.userId;
        loginEmailAddress = loginUserDetails.emailAddress;
        loginUserFullName = loginUserDetails.fullName;
    } 

    function loginClickHandler(){
        const loginPageCalledFrom = 'Navigation Bar';
        const loginRedirectPage = '/profile-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
    }

    let isAdmin: boolean = false;

    if(loginUserDetails != null && 
        loginEmailAddress && loginEmailAddress.endsWith("@royalpalace.co.in")){
        isAdmin = true;
    }

    const usernameClickDestination: string = isAdmin ? '/admin-home-page' : '/profile-home-page';

    
    return(
        <div className="flex w-full bg-green-700 bg-opacity-60 text-yellow-300 items-center px-4 py-2 flex-wrap">

            {/* Logo */}
            <div className="w-[15%] pl-4">
                <Image src={'/hotel-logo.jpg'} alt="hotel-logo" width={150} height={40} />
            </div>

            {/* Main Navigation */}
            <div className="w-full md:w-[68%] flex flex-wrap items-center justify-center py-3 space-x-6">
                <ul className="flex flex-wrap gap-x-6 gap-y-2 uppercase text-lg font-bold font-sans">
                    <li>
                        <Link href="/" className="hover:bg-green-900 hover:text-gray-200 hover:border-b-4 hover:border-gray-300 px-2 py-1 transition-all">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/rooms-suites/" className="hover:bg-green-900 hover:text-gray-200 hover:border-b-4 hover:border-gray-300 px-2 py-1 transition-all">
                            Rooms & Suites
                        </Link>
                    </li>
                    <li>
                        <Link href="/dining/" className="hover:bg-green-900 hover:text-gray-200 hover:border-b-4 hover:border-gray-300 px-2 py-1 transition-all">
                            Dining
                        </Link>
                    </li>
                    <li>
                        <Link href="/meetings-events/" className="hover:bg-green-900 hover:text-gray-200 hover:border-b-4 hover:border-gray-300 px-2 py-1 transition-all">
                            Event/Meeting Rooms
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact-us" className="hover:bg-green-900 hover:text-gray-200 hover:border-b-4 hover:border-gray-300 px-2 py-1 transition-all">
                            Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/about-us" className="hover:bg-green-900 hover:text-gray-200 hover:border-b-4 hover:border-gray-300 px-2 py-1 transition-all">
                            About
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Cart + Login for Guests */}
            {(loginUserId == null) &&
            <div className="w-full md:w-[17%] flex justify-end space-x-4 py-2">
                <ul className="flex gap-x-4 uppercase text-lg font-semibold font-sans">
                    <li>
                        <Link href="/cart" className="hover:bg-violet-700 hover:text-white hover:border-2 hover:border-white px-2 py-1 transition-all">
                            My Cart
                        </Link>
                    </li>
                    <li>
                        <Link onClick={loginClickHandler} href="/login" className="hover:bg-violet-700 hover:text-white hover:border-2 hover:border-white px-2 py-1 transition-all">
                            Login
                        </Link>
                    </li>
                </ul>
            </div>
            }


            {/* User Profile Link if Logged In */}
            {(loginUserDetails != null) &&
            <div className="w-full md:w-[17%] flex justify-end py-2 pr-4">
                <ul className="flex gap-x-4 uppercase text-lg font-semibold font-sans">
                    <li>
                        <Link href={usernameClickDestination} className="hover:bg-green-900 hover:text-gray-200 hover:border-b-4 hover:border-gray-300 px-2 py-1 transition-all">
                            {loginUserFullName}
                        </Link>
                    </li>
                </ul>
            </div>
            }
        </div>
    );
}


function Navbar(){
    return (
        <ErrorBoundary>
            <NavbarFunctionalComponent />
        </ErrorBoundary>
    );
}


export default Navbar;