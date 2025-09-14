'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import { 
    DINING_BOOKING_INFO_IS_PRESENT, 
    DINING_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";

import EachAdminDiningBookingInfo from "@/components/Admin Booking Information Component/Dining Booking/EachAdminDiningBookingInfo";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { IDiningBookingInfoForAdmin, IDiningBookingInfoForArrayForAdmin, ViewCurrentDiningBookingResponseForAdmin } from "@/interface/Dining Interface/viewDiningBookingApiResponse";
import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";


function CurrentDiningBookingPage(){
    return (
        <ErrorBoundary>
            <CurrentDiningBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function CurrentDiningBookingPageFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    let loginUserId: string;
    let loginUserFullName: string;
    let loginEmailAddress: string;

    if(loginUserDetails != null){
        loginUserId = loginUserDetails.userId;
        loginEmailAddress = loginUserDetails.emailAddress;
        loginUserFullName = loginUserDetails.fullName;
    }

    useEffect(function(){
        if(loginUserDetails == null){
            const loginPageCalledFrom = 'Admin Current Dining Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }

        if(loginUserDetails != null && 
            !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Current Dining Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
    }, [loginUserDetails, router, dispatch]);
    

    const [loadingBookingDetails, setLoadingBookingDetails] = useState<boolean>(true);

    const [diningBooking, setDiningBooking] = useState<null | IDiningBookingInfoForArrayForAdmin[]>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchDiningBookingDb(currentPage);
        }
    }, []);

    async function fetchDiningBookingDb(page: number = 1) {
        try {
            const response: Response = await fetch(`/api/view-current-booking/dining?page=${page}`);
            const data: ViewCurrentDiningBookingResponseForAdmin = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if('message' in data){
                    if(data.message === DINING_BOOKING_INFO_IS_EMPTY){
                        const diningBookingDb: IDiningBookingInfoForArrayForAdmin[] = [];
                        setDiningBooking(diningBookingDb);
                        setTotalPages(1);
                    }
                    else if(data.message === DINING_BOOKING_INFO_IS_PRESENT){
                        const diningBookingDb: IDiningBookingInfoForArrayForAdmin[] | undefined = data.diningBookingInfo;
                        if(diningBookingDb){
                            setDiningBooking(diningBookingDb);
                        }
                        if(data.pagination){
                            setTotalPages(data.pagination.totalPages || 1);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoadingBookingDetails(false);
        }
    }


    // Pagination handlers
    function goToPrevPage() {
        setCurrentPage(function(prev: number) {
            return Math.max(prev - 1, 1);
        });
    }

    function goToNextPage() {
        setCurrentPage(function(prev: number) {
            return Math.min(prev + 1, totalPages);
        });
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
                    <Link href="/admin-home-page"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            ADMIN HOME PAGE 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/admin-home-page/view-current-bookings"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            VIEW CURRENT OR UPCOMING BOOKINGS 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span>
                    <Link href="/admin-home-page/view-current-bookings/dining"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            DINING BOOKING 
                        </span>
                    </Link>
                </p>
            </div>

            {/* Loading State */}
            {(loadingBookingDetails && 
                (loginUserDetails != null && 
                    loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
                <div className="bg-pink-400 py-12 px-4 m-8 flex items-center justify-center">
                    <p className="text-[#cccbd8] font-bold text-[1.5rem] font-sans"> 
                        LOADING DINING BOOKING DETAILS...
                    </p>
                </div>
            }


            {/* Main Content */}
            {(loginUserDetails != null && 
                loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")) &&
                <div className="m-8">

                    {/* No Bookings */}
                    {(!loadingBookingDetails && 
                        diningBooking !== null && diningBooking.length == 0) &&
                        <div className="bg-blue-200 py-12 px-4 m-8 flex items-center justify-center">
                            <p className="text-[rgba(192,46,46,0.795)] font-bold text-[1.5rem] font-sans">
                                There are no Current or Future Upcoming Dining Bookings
                            </p>
                        </div>
                    }

                    {/* Bookings Found */}
                    {(!loadingBookingDetails && 
                        diningBooking !== null && diningBooking.length > 0) &&
                        <div>
                            {diningBooking.map(function(eachDiningBookingInfo: IDiningBookingInfoForArrayForAdmin){
                                const diningBookingInfo: IDiningBookingInfoForAdmin =  eachDiningBookingInfo.bookingInfo; 
                                return (
                                    <EachAdminDiningBookingInfo 
                                        key={eachDiningBookingInfo._id}
                                        eachDiningBookingInfo={diningBookingInfo} 
                                    />
                                );
                            })}

                            {/* Pagination controls */}
                            <div className="mt-12 text-center space-x-4">
                                <Button onClick={goToPrevPage} variant="contained" disabled={currentPage === 1}>
                                    Prev
                                </Button>
                                <span className="mx-2">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button onClick={goToNextPage} variant="contained" disabled={currentPage === totalPages}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    }
                </div>
            }

        </div>
    );

}


export default CurrentDiningBookingPage;