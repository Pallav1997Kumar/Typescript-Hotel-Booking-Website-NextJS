'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';

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
import { IDiningBookingInfoForAdmin } from "@/interface/Dining Interface/viewDiningBookingApiResponse";
import { IRoomsSuitesBookingInfoForAdmin } from "@/interface/Rooms and Suites Interface/viewRoomSuiteBookingApiResponse";
import { IContinousMultipleDatesBookingInfoForAdmin, INonContinousMultipleDatesBookingInfoForAdmin, ISingleDateBookingInfoForAdmin } from "@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse";


function PastAllBookingPage(){
    return (
        <ErrorBoundary>
            <PastAllBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function PastAllBookingPageFunctionalComponent(){

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
            const loginPageCalledFrom = 'Admin Past Dining, Rooms Suites and Event Meeting Rooms Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }

        if(loginUserDetails != null && 
            !loginEmailAddress.endsWith("@royalpalace.co.in")){
                const loginPageCalledFrom = 'Admin Past Dining, Rooms Suites and Event Meeting Rooms Page';
                const loginRedirectPage = '/admin-home-page';
                dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
                dispatch(updateLoginRedirectPage(loginRedirectPage));
                router.push('/admin-login');
                return ;
        }
    }, [loginUserDetails, router, dispatch]);


    const [diningRoomSuiteEventMeetingBooking, setDiningRoomSuiteEventMeetingBooking] = useState<null | DiningRoomsSuitesEventMeetingBookingInfoForAdmin[]>(null);

    const [displayedDiningRoomSuiteEventMeetingBookings, setDiningRoomSuiteDisplayedEventMeetingBookings] = useState<DiningRoomsSuitesEventMeetingBookingInfoForAdmin[]>([]); 
    const [hasMore, setHasMore] = useState<boolean>(true);
    const chunkSize: number = 5;
    const [nextIndex, setNextIndex] = useState<number>(0);


    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
                fetchDiningRoomSuiteEventMeetingBookingDb();
        }
    }, []);

    async function fetchDiningRoomSuiteEventMeetingBookingDb() {
        try {
            const response: Response = await fetch(`/api/view-past-booking`);
            const data: ViewDiningRoomsSuitesEventMeetingBookingResponseForAdmin = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if('message' in data){
                    if(data.message === DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_EMPTY){
                        const diningRoomSuiteEventMeetingBookingDb: DiningRoomsSuitesEventMeetingBookingInfoForAdmin[] = [];
                        setDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingDb);
                        setHasMore(false);
                    }
                    else if(data.message === DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_PRESENT){
                        const diningRoomSuiteEventMeetingBookingDb: DiningRoomsSuitesEventMeetingBookingInfoForAdmin[] | undefined = data.diningRoomsSuitesEventMeetingBookingInfo;
                        if(diningRoomSuiteEventMeetingBookingDb){
                            setDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingDb);
                            loadMoreDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingDb, 0);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    function loadMoreDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingInfo: DiningRoomsSuitesEventMeetingBookingInfoForAdmin[], startIndex: number){
        const endIndex: number = startIndex + chunkSize;
        const nextChunkDiningRoomSuiteEventMeetingInfo: DiningRoomsSuitesEventMeetingBookingInfoForAdmin[] = diningRoomSuiteEventMeetingBookingInfo.slice(startIndex, endIndex);

        setDiningRoomSuiteDisplayedEventMeetingBookings(function(previousDisplayedDiningRoomSuiteEventMeeting: DiningRoomsSuitesEventMeetingBookingInfoForAdmin[]){
            //return [...previousDisplayedDiningRoomSuiteEventMeeting, ...nextChunkDiningRoomSuiteEventMeetingInfo];
            const existingIds: Set<string> = new Set<string>();
            for (let i = 0; i < previousDisplayedDiningRoomSuiteEventMeeting.length; i++) {
                existingIds.add(previousDisplayedDiningRoomSuiteEventMeeting[i].bookingInfo._id);
            }

            const filteredChunkDiningRoomSuiteEventMeetingInfo: DiningRoomsSuitesEventMeetingBookingInfoForAdmin[] = [];
            for (let i = 0; i < nextChunkDiningRoomSuiteEventMeetingInfo.length; i++) {
                const item: DiningRoomsSuitesEventMeetingBookingInfoForAdmin = nextChunkDiningRoomSuiteEventMeetingInfo[i];
                if (!existingIds.has(item.bookingInfo._id)) {
                    filteredChunkDiningRoomSuiteEventMeetingInfo.push(item);
                }
            }
            return [...previousDisplayedDiningRoomSuiteEventMeeting, ...filteredChunkDiningRoomSuiteEventMeetingInfo];
        });
        setNextIndex(endIndex);

        if(endIndex >= diningRoomSuiteEventMeetingBookingInfo.length){
            setHasMore(false);
        }
    }

    function fetchNext(){
        setTimeout(function(){
            if(diningRoomSuiteEventMeetingBooking){
                loadMoreDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBooking, nextIndex);
            }
        }, 1000);
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
                    <Link href="/admin-home-page"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            ADMIN HOME PAGE 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/admin-home-page/view-past-bookings"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            VIEW PAST BOOKINGS 
                        </span>
                    </Link>
                </p>
            </div>


            {(loginUserDetails != null && 
                loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")) &&
                <div className="my-8 mx-12">
                    <h4 className="mb-2 text-lg font-semibold">
                        Category Wise Bookings
                    </h4>
                    <ol className="ml-8 list-[lower-roman]">
                        <li className="py-1 hover:text-yellow-600 cursor-pointer">
                            <Link href={"/admin-home-page/view-past-bookings/rooms-suites"}>
                                Rooms & Suites Booking
                            </Link>
                        </li>
                        <li className="py-1 hover:text-yellow-600 cursor-pointer">
                            <Link href={"/admin-home-page/view-past-bookings/dining"}>
                                Dining Booking
                            </Link>
                        </li>
                        <li className="py-1 hover:text-yellow-600 cursor-pointer">
                            <Link href={"/admin-home-page/view-past-bookings/events-meeting-room"}>
                                Events/ Meeting Rooms Booking
                            </Link>
                        </li>
                    </ol>
                </div>
            }
                        

            {((diningRoomSuiteEventMeetingBooking != null && 
                diningRoomSuiteEventMeetingBooking.length > 0 && 
                displayedDiningRoomSuiteEventMeetingBookings.length > 0) && 
                    (loginUserDetails != null && 
                        loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
                            <div className="m-16">
                                <h3 className="text-2xl font-bold mb-4">PAST BOOKINGS</h3>

                                <InfiniteScroll
                                    dataLength={displayedDiningRoomSuiteEventMeetingBookings.length}
                                    next={fetchNext}
                                    hasMore={hasMore}
                                    loader={
                                        <h4 className="text-center text-lg text-brown p-4 m-2 bg-[#7fffd4]">
                                            Loading more bookings...
                                        </h4>
                                    }
                                    endMessage={
                                        <p className="text-center text-red-600 font-bold text-lg bg-[#d1c1e0] p-4 m-2">
                                            No more Dining, Rooms/ Suites and Event/ Meeting Rooms Bookings
                                        </p>
                                    }
                                >
                                    {displayedDiningRoomSuiteEventMeetingBookings.map(function(eachDiningRoomSuiteEventMeetingRoomBookingInfo: DiningRoomsSuitesEventMeetingBookingInfoForAdmin){
                                        const eachBookingInfo: ISingleDateBookingInfoForAdmin | IContinousMultipleDatesBookingInfoForAdmin | INonContinousMultipleDatesBookingInfoForAdmin | IRoomsSuitesBookingInfoForAdmin | IDiningBookingInfoForAdmin =  eachDiningRoomSuiteEventMeetingRoomBookingInfo.bookingInfo; 
                                        
                                        if('diningRestaurantTitle' in eachBookingInfo){
                                            if(eachBookingInfo.diningRestaurantTitle){
                                                const diningBookingInfo: IDiningBookingInfoForAdmin =  eachBookingInfo; 
                                                return (
                                                    <EachAdminDiningBookingInfo 
                                                        key={diningBookingInfo._id}
                                                        eachDiningBookingInfo={diningBookingInfo} 
                                                    />
                                                );
                                            }
                                        }
                                        
                                        if('bookingRoomTitle' in eachBookingInfo){
                                            if(eachBookingInfo.bookingRoomTitle){
                                                const roomSuitesBookingInfo: IRoomsSuitesBookingInfoForAdmin =  eachBookingInfo;  
                                                return (
                                                    <EachAdminRoomBookingInfo 
                                                        key={roomSuitesBookingInfo._id}
                                                        eachRoomBookingInfo={roomSuitesBookingInfo} 
                                                    />
                                                ); 
                                            }         
                                        }
                                        
                                        if('meetingEventsInfoTitle' in eachBookingInfo){
                                            if(eachBookingInfo.meetingEventsInfoTitle){
                                                const eventMeetingBookingInfo: ISingleDateBookingInfoForAdmin | IContinousMultipleDatesBookingInfoForAdmin | INonContinousMultipleDatesBookingInfoForAdmin = eachBookingInfo;
                                                return (
                                                    <EachAdminEventMeetingBookingInfo
                                                        key={eventMeetingBookingInfo._id} 
                                                        eachEventMeetingBookingInfo={eventMeetingBookingInfo} 
                                                    />
                                                );
                                            }
                                        }
                                        
                                    })}
                                </InfiniteScroll>               
                            </div>
            }
                        
        </div>
    );

}


export default PastAllBookingPage;