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
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";

import EachAdminEventMeetingBookingInfo from "@/components/Admin Booking Information Component/Event Meeting Booking/EachAdminEventMeetingBookingInfo";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";
import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { EventMeetingBookingInfoForAdmin, IContinousMultipleDatesBookingInfoForAdmin, INonContinousMultipleDatesBookingInfoForAdmin, ISingleDateBookingInfoForAdmin, ViewEventMeetingBookingResponseForAdmin } from "@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse";



function PastEventMeetingBookingPage(){
    return(
        <ErrorBoundary>
            <PastEventMeetingBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function PastEventMeetingBookingPageFunctionalComponent(){

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
            !loginEmailAddress.endsWith("@royalpalace.co.in")){
                const loginPageCalledFrom = 'Admin Current Event Meeting Rooms Page';
                const loginRedirectPage = '/admin-home-page';
                dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
                dispatch(updateLoginRedirectPage(loginRedirectPage));
                router.push('/admin-login');
                return ;
        }
    }, [loginUserDetails, router, dispatch]);

    const [eventMeetingBooking, setEventMeetingBooking] = useState<null | EventMeetingBookingInfoForAdmin[]>(null);

    const [displayedEventMeetingBookings, setDisplayedEventMeetingBookings] = useState<EventMeetingBookingInfoForAdmin[]>([]); 
    const [hasMore, setHasMore] = useState<boolean>(true);
    const chunkSize: number = 5;
    const [nextIndex, setNextIndex] = useState<number>(0);


    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchEventMeetingBookingDb();
        }
    }, []);

    async function fetchEventMeetingBookingDb() {
        try {
            const response: Response = await fetch(`/api/view-past-booking/meeting-events`);
            const data: ViewEventMeetingBookingResponseForAdmin = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if('message' in data){
                    if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY){
                        const eventMeetingBookingDb: EventMeetingBookingInfoForAdmin[] = [];
                        setEventMeetingBooking(eventMeetingBookingDb);
                        setHasMore(false);
                    }
                    else if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT){
                        const eventMeetingBookingDb: EventMeetingBookingInfoForAdmin[] | undefined = data.eventMeetingBookingInfo;
                        if(eventMeetingBookingDb){
                            setEventMeetingBooking(eventMeetingBookingDb);
                            loadMoreEventMeetingBooking(eventMeetingBookingDb, 0);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    function loadMoreEventMeetingBooking(eventMeetingBookingInfo: EventMeetingBookingInfoForAdmin[], startIndex: number){
        const endIndex: number = startIndex + chunkSize;
        const nextChunkEventMeetingInfo: EventMeetingBookingInfoForAdmin[] = eventMeetingBookingInfo.slice(startIndex, endIndex);

        setDisplayedEventMeetingBookings(function(previousDisplayedEventMeeting: EventMeetingBookingInfoForAdmin[]){
            //return [...previousDisplayedEventMeeting, ...nextChunkEventMeetingInfo];
            const existingIds: Set<String> = new Set<String>();
            for (let i = 0; i < previousDisplayedEventMeeting.length; i++) {
                existingIds.add(previousDisplayedEventMeeting[i].bookingInfo._id);
            }

            const filteredChunkEventMeetingInfo: EventMeetingBookingInfoForAdmin[] = [];
            for (let i = 0; i < nextChunkEventMeetingInfo.length; i++) {
                const item: EventMeetingBookingInfoForAdmin = nextChunkEventMeetingInfo[i];
                if (!existingIds.has(item.bookingInfo._id)) {
                    filteredChunkEventMeetingInfo.push(item);
                }
            }
            return [...previousDisplayedEventMeeting, ...filteredChunkEventMeetingInfo];
        });
        setNextIndex(endIndex);

        if(endIndex >= eventMeetingBookingInfo.length){
            setHasMore(false);
        }
    }

    function fetchNext(){
        setTimeout(function(){
            if(eventMeetingBooking){
                loadMoreEventMeetingBooking(eventMeetingBooking, nextIndex);
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
                    <span className="px-3">{'>>'}</span>
                    <Link href="/admin-home-page/view-past-bookings/events-meeting-room"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            EVENT/ MEETING ROOMS BOOKING 
                        </span>
                    </Link>
                </p>
            </div>

            {((eventMeetingBooking != null && eventMeetingBooking.length > 0 && 
                displayedEventMeetingBookings.length > 0) && 
                (loginUserDetails != null && 
                    loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
                    <div className="m-4">
                        <InfiniteScroll
                            dataLength={displayedEventMeetingBookings.length}
                            next={fetchNext}
                            hasMore={hasMore}
                            loader={
                                <h4 className="text-center text-lg text-brown-700 bg-green-200 py-2 px-4 m-2 font-semibold">
                                    Loading more bookings...
                                </h4>
                            }
                            endMessage={
                                <p className="text-center text-lg text-red-600 font-bold bg-purple-200 py-2 px-4 m-2">
                                    No more Event and Meeting Rooms Bookings
                                </p>
                            }
                        >
                            {displayedEventMeetingBookings.map(function(eachEventMeetingRoomBookingInfo: EventMeetingBookingInfoForAdmin){
                                const eventMeetingBookingInfo: ISingleDateBookingInfoForAdmin | IContinousMultipleDatesBookingInfoForAdmin | INonContinousMultipleDatesBookingInfoForAdmin =  eachEventMeetingRoomBookingInfo.bookingInfo; 
                                return (
                                    <EachAdminEventMeetingBookingInfo 
                                        key={eventMeetingBookingInfo._id}
                                        eachEventMeetingBookingInfo={eventMeetingBookingInfo} 
                                    />
                                );
                            })}
                        </InfiniteScroll>               
                    </div>
            }
                        

        </div>
    );

}


export default PastEventMeetingBookingPage;