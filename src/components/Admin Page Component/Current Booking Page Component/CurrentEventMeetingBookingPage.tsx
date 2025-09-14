'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import { 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";
import EachAdminEventMeetingBookingInfo from "@/components/Admin Booking Information Component/Event Meeting Booking/EachAdminEventMeetingBookingInfo";

import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { EventMeetingBookingInfoForAdmin, IContinousMultipleDatesBookingInfoForAdmin, INonContinousMultipleDatesBookingInfoForAdmin, ISingleDateBookingInfoForAdmin, ViewEventMeetingBookingResponseForAdmin } from "@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse";


function CurrentEventMeetingBookingPage(){
    return (
        <ErrorBoundary>
            <CurrentEventMeetingBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function CurrentEventMeetingBookingPageFunctionalComponent(){

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
            const loginPageCalledFrom = 'Admin Current Event Meeting Rooms Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
    
        if(loginUserDetails != null && 
            !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Current Event Meeting Rooms Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        } 
    }, [loginUserDetails, router, dispatch]);
    

    const [loadingBookingDetails, setLoadingBookingDetails] = useState<boolean>(true);

    const [eventMeetingBooking, setEventMeetingBooking] = useState<null | EventMeetingBookingInfoForAdmin[]>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const BOOKINGS_PER_PAGE: number = 5;

    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchEventMeetingBookingDb();
        }
    }, []);

    async function fetchEventMeetingBookingDb() {
        try {
            const response: Response = await fetch(`/api/view-current-booking/meeting-events`);
            const data: ViewEventMeetingBookingResponseForAdmin = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if('message' in data){
                    if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY){
                        const eventMeetingBookingDb: EventMeetingBookingInfoForAdmin[] = [];
                        setEventMeetingBooking(eventMeetingBookingDb);
                        setTotalPages(1);
                    }
                    else if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT){
                        const eventMeetingBookingDb: EventMeetingBookingInfoForAdmin[] | undefined = data.eventMeetingBookingInfo;
                        if(eventMeetingBookingDb){
                            setEventMeetingBooking(eventMeetingBookingDb);
                            const total: number = Math.ceil(eventMeetingBookingDb.length / BOOKINGS_PER_PAGE);
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
    const currentPageBookings: EventMeetingBookingInfoForAdmin[] = Array.isArray(eventMeetingBooking) ? eventMeetingBooking.slice(indexOfFirstBooking, indexOfLastBooking) : [];


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
                    <Link href="/admin-home-page/view-current-bookings/events-meeting-room"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            EVENT/ MEETING ROOMS BOOKING 
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
                        LOADING EVENT/ MEETING ROOMS BOOKING DETAILS...
                    </p>
                </div>
            }


            {/* Main Content */}
            {(loginUserDetails != null && 
                loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")) &&
                <div className="m-8">

                    {/* No Bookings */}
                    {(!loadingBookingDetails && eventMeetingBooking !== null && eventMeetingBooking.length == 0) &&
                        <div className="bg-blue-200 py-12 px-4 m-8 flex items-center justify-center">
                            <p className="text-[rgba(192,46,46,0.795)] font-bold text-[1.5rem] font-sans">
                                There are no Current or Future Upcoming Events/ Meeting Room Bookings
                            </p>
                        </div>
                    }

                    {/* Bookings Found */}
                    {(!loadingBookingDetails && 
                        eventMeetingBooking !== null && 
                        eventMeetingBooking.length > 0) &&
                        <div>
                            {currentPageBookings.map(function(eachEventMeetingRoomBookingInfo: EventMeetingBookingInfoForAdmin){
                                const eventMeetingBookingInfo: ISingleDateBookingInfoForAdmin | IContinousMultipleDatesBookingInfoForAdmin | INonContinousMultipleDatesBookingInfoForAdmin =  eachEventMeetingRoomBookingInfo.bookingInfo; 
                                return (
                                    <EachAdminEventMeetingBookingInfo 
                                        key={eachEventMeetingRoomBookingInfo._id}
                                        eachEventMeetingBookingInfo={eventMeetingBookingInfo} 
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


export default CurrentEventMeetingBookingPage;