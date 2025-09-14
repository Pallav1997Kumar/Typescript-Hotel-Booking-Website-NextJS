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
  DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_PRESENT,
  DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_EMPTY
} from "@/constant string files/apiSuccessMessageConstants";

import EachAdminEventMeetingBookingInfo from "@/components/Admin Booking Information Component/Event Meeting Booking/EachAdminEventMeetingBookingInfo";
import EachAdminDiningBookingInfo from "@/components/Admin Booking Information Component/Dining Booking/EachAdminDiningBookingInfo";
import EachAdminRoomBookingInfo from "@/components/Admin Booking Information Component/Rooms Suites Booking/EachAdminRoomBookingInfo";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { DiningRoomsSuitesEventMeetingBookingInfoForAdmin, ViewDiningRoomsSuitesEventMeetingBookingResponseForAdmin } from "@/interface/viewRoomDiningEventBookingApiResponse";
import { IContinousMultipleDatesBookingInfoForAdmin, INonContinousMultipleDatesBookingInfoForAdmin, ISingleDateBookingInfoForAdmin } from "@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse";
import { IRoomsSuitesBookingInfoForAdmin } from "@/interface/Rooms and Suites Interface/viewRoomSuiteBookingApiResponse";
import { IDiningBookingInfoForAdmin } from "@/interface/Dining Interface/viewDiningBookingApiResponse";


function CurrentAllBookingPage(){
    return (
        <ErrorBoundary>
            <CurrentAllBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function CurrentAllBookingPageFunctionalComponent(){

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
            const loginPageCalledFrom = 'Admin Current Dining, Rooms Suites and Event Meeting Rooms Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
        if(loginUserDetails != null && 
            !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Current Dining, Rooms Suites and Event Meeting Rooms Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
        return ;
    }
    }, [loginUserDetails, router, dispatch])


    const [loadingBookingDetails, setLoadingBookingDetails] = useState<boolean>(true);

    const [diningRoomSuiteEventMeetingBooking, setDiningRoomSuiteEventMeetingBooking] = useState<null | DiningRoomsSuitesEventMeetingBookingInfoForAdmin[]>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const BOOKINGS_PER_PAGE: number = 5;

    useEffect(function() {
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchDiningRoomsSuitesEventMeetingBookingDb();
        }
    }, []);

    async function fetchDiningRoomsSuitesEventMeetingBookingDb() {
        try {
            const response: Response = await fetch(`/api/view-current-booking`);
            const data: ViewDiningRoomsSuitesEventMeetingBookingResponseForAdmin = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if('message' in data){
                    if(data.message === DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_EMPTY){
                        const diningRoomSuiteEventMeetingBookingDb: DiningRoomsSuitesEventMeetingBookingInfoForAdmin[] = [];
                        setDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingDb);
                        setTotalPages(1);
                    }
                    else if(data.message === DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_PRESENT){
                        const diningRoomSuiteEventMeetingBookingDb: DiningRoomsSuitesEventMeetingBookingInfoForAdmin[] | undefined = data.diningRoomsSuitesEventMeetingBookingInfo;
                        if(diningRoomSuiteEventMeetingBookingDb){
                            setDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingDb);
                            const total: number = Math.ceil(diningRoomSuiteEventMeetingBookingDb.length / BOOKINGS_PER_PAGE);
                            setTotalPages(total);
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

     // Get bookings for current page only
    const indexOfLastBooking: number = currentPage * BOOKINGS_PER_PAGE;
    const indexOfFirstBooking: number = indexOfLastBooking - BOOKINGS_PER_PAGE;
    const currentPageBookings: DiningRoomsSuitesEventMeetingBookingInfoForAdmin[] = Array.isArray(diningRoomSuiteEventMeetingBooking) ? diningRoomSuiteEventMeetingBooking.slice(indexOfFirstBooking, indexOfLastBooking) : [];


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
                </p>
            </div>

            {(loginUserDetails != null && 
                loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")) &&
                <div className="m-8">

                    <h2 className="text-center text-2xl font-semibold">
                        CURRENT BOOKINGS
                    </h2>

                    <div className="m-8">

                        <h4 className="mb-2 text-lg font-medium">
                            Category Wise Bookings
                        </h4>
                        
                        <ol className="ml-6 list-[lower-roman]">
                            <li className="py-1 hover:text-yellow-600 cursor-pointer">
                                <Link href={"/admin-home-page/view-current-bookings/rooms-suites"}>
                                    Rooms & Suites Booking
                                </Link>
                            </li>
                            <li className="py-1 hover:text-yellow-600 cursor-pointer">
                                <Link href={"/admin-home-page/view-current-bookings/dining"}>
                                    Dining Booking
                                </Link>
                            </li>
                            <li className="py-1 hover:text-yellow-600 cursor-pointer">
                                <Link href={"/admin-home-page/view-current-bookings/events-meeting-room"}>
                                    Events/ Meeting Rooms Booking
                                </Link>
                            </li>
                        </ol>
                    </div>


                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            All Bookings
                        </h3>

                        {loadingBookingDetails &&
                            <div className="bg-pink-400 p-6 m-4 flex items-center justify-center">
                                <p className="text-gray-200 font-bold text-2xl font-sans"> 
                                    LOADING DINING, ROOMS / SUITES  AND  EVENT/ MEETING ROOMS BOOKING DETAILS...
                                </p>
                            </div>
                        }

                        <div className="flex flex-col gap-4">
                            {(!loadingBookingDetails && 
                                diningRoomSuiteEventMeetingBooking !== null && 
                                    diningRoomSuiteEventMeetingBooking.length == 0) &&
                                        <div className="bg-blue-200 p-6 m-4 flex items-center justify-center">
                                            <p className="text-red-700 font-bold text-2xl font-sans">
                                                There are no Current or Future Upcoming Dining, Rooms/Suites and Events/ Meeting Room Bookings
                                            </p>
                                        </div>
                            }

                            {(!loadingBookingDetails && 
                                diningRoomSuiteEventMeetingBooking !== null && 
                                    diningRoomSuiteEventMeetingBooking.length > 0) &&
                                        <div>
                                            {currentPageBookings.map(function(eachBookingInfo: DiningRoomsSuitesEventMeetingBookingInfoForAdmin){
                                                const currentBookingInfo: ISingleDateBookingInfoForAdmin | IContinousMultipleDatesBookingInfoForAdmin | INonContinousMultipleDatesBookingInfoForAdmin | IRoomsSuitesBookingInfoForAdmin | IDiningBookingInfoForAdmin = eachBookingInfo.bookingInfo; 

                                                if('diningRestaurantTitle' in currentBookingInfo){
                                                    if(currentBookingInfo.diningRestaurantTitle){
                                                        const diningBookingInfo: IDiningBookingInfoForAdmin =  currentBookingInfo; 
                                                        return (
                                                            <EachAdminDiningBookingInfo 
                                                                key={eachBookingInfo._id}
                                                                eachDiningBookingInfo={diningBookingInfo} 
                                                            />
                                                        );
                                                    }
                                                }

                                                if('bookingRoomTitle' in currentBookingInfo){
                                                    if(currentBookingInfo.bookingRoomTitle){
                                                        const roomSuitesBookingInfo: IRoomsSuitesBookingInfoForAdmin =  currentBookingInfo; 
                                                        return (
                                                            <EachAdminRoomBookingInfo 
                                                                key={eachBookingInfo._id}
                                                                eachRoomBookingInfo={roomSuitesBookingInfo} 
                                                            />
                                                        );
                                                    }
                                                }

                                                if('meetingEventsInfoTitle' in currentBookingInfo){
                                                    if(currentBookingInfo.meetingEventsInfoTitle){
                                                        const eventMeetingBookingInfo: ISingleDateBookingInfoForAdmin | IContinousMultipleDatesBookingInfoForAdmin | INonContinousMultipleDatesBookingInfoForAdmin =  currentBookingInfo; 
                                                        return (
                                                            <EachAdminEventMeetingBookingInfo 
                                                                key={eachBookingInfo._id}
                                                                eachEventMeetingBookingInfo={eventMeetingBookingInfo} 
                                                            />
                                                        );
                                                    }
                                                }
                                                
                                            })}

                                            {/* Pagination controls */}
                                            <div className="mt-12 text-center space-x-4">
                                                <Button onClick={goToPrevPage} variant="contained" disabled={currentPage === 1}>
                                                    Prev
                                                </Button>
                                                <span>
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <Button onClick={goToNextPage} variant="contained" disabled={currentPage === totalPages}>
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                            }
                        </div>

                    </div>
                </div>
            }

        </div>
    );

}


export default CurrentAllBookingPage;