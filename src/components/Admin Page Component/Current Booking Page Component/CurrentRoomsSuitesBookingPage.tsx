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
    ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, 
    ROOMS_SUITES_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";

import EachAdminRoomBookingInfo from "@/components/Admin Booking Information Component/Rooms Suites Booking/EachAdminRoomBookingInfo";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { IRoomsSuitesBookingInfoForAdmin, IRoomsSuitesBookingInfoForArrayForAdmin, ViewCurrentRoomsSuitesBookingResponseForAdmin } from "@/interface/Rooms and Suites Interface/viewRoomSuiteBookingApiResponse";


function CurrentRoomsSuitesBookingPage(){
    return (
        <ErrorBoundary>
            <CurrentRoomsSuitesBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function CurrentRoomsSuitesBookingPageFunctionalComponent(){

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
            const loginPageCalledFrom = 'Admin Current Rooms Suites Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }

        if(loginUserDetails != null && 
            !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Current Rooms Suites Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
    }, [loginUserDetails, router, dispatch]);
    

    const [loadingBookingDetails, setLoadingBookingDetails] = useState<boolean>(true);

    const [roomSuitesBooking, setRoomSuitesBooking] = useState<null | IRoomsSuitesBookingInfoForArrayForAdmin[]>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchRoomSuiteBookingDb(currentPage);
        }
    }, []);

    async function fetchRoomSuiteBookingDb(page = 1) {
        try {
            const response: Response = await fetch(`/api/view-current-booking/rooms-suites?page=${page}`);
            const data: ViewCurrentRoomsSuitesBookingResponseForAdmin = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if('message' in data){
                    if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_EMPTY){
                        const roomSuitesBookingDb: IRoomsSuitesBookingInfoForArrayForAdmin[] = [];
                        setRoomSuitesBooking(roomSuitesBookingDb);
                        setTotalPages(1);
                    }
                    else if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_PRESENT){
                        const roomSuitesBookingDb: IRoomsSuitesBookingInfoForArrayForAdmin[] | undefined = data.roomSuitesBookingInfo;
                        if(roomSuitesBookingDb){
                            setRoomSuitesBooking(roomSuitesBookingDb);
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
                    <Link href="/admin-home-page/view-current-bookings/rooms-suites"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            ROOMS AND SUITES BOOKING 
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
                        LOADING ROOMS AND SUITES BOOKING DETAILS...
                    </p>
                </div>
            }


            {/* Main Content */}
            {(loginUserDetails != null && 
                loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")) &&
                <div className="m-8">

                    {/* No Bookings */}
                    {(!loadingBookingDetails && 
                        roomSuitesBooking !== null && roomSuitesBooking.length == 0) &&
                        <div className="bg-blue-200 py-12 px-4 m-8 flex items-center justify-center">
                            <p className="text-[rgba(192,46,46,0.795)] font-bold text-[1.5rem] font-sans">
                                There are no Current or Future Upcoming Rooms and Suites Bookings
                            </p>
                        </div>
                    }

                    {/* Bookings Found */}
                    {(!loadingBookingDetails && 
                        roomSuitesBooking !== null && roomSuitesBooking.length > 0) &&
                        <div>
                            {roomSuitesBooking.map(function(eachRoomSuitesBookingInfo: IRoomsSuitesBookingInfoForArrayForAdmin){
                                const roomSuitesBookingInfo: IRoomsSuitesBookingInfoForAdmin =  eachRoomSuitesBookingInfo.bookingInfo; 
                                return (
                                    <EachAdminRoomBookingInfo 
                                        key={eachRoomSuitesBookingInfo._id}
                                        eachRoomBookingInfo={roomSuitesBookingInfo} 
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


export default CurrentRoomsSuitesBookingPage;