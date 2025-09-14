'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import { 
    DINING_BOOKING_INFO_IS_PRESENT, 
    DINING_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";
import { 
    ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, 
    ROOMS_SUITES_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";
import { 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";

import UserAllBookingComponent from "@/components/User Booking Component/UserAllBookingComponent";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { EventMeetingBookingInfoForCustomer, ViewEventMeetingBookingResponseForCustomer } from "@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse";
import { IDiningBookingInfoForArrayForCustomer, ViewDiningBookingResponseForCustomer } from "@/interface/Dining Interface/viewDiningBookingApiResponse";
import { IRoomsSuitesBookingInfoForArrayForCustomer, ViewRoomsSuitesBookingResponseForCustomer } from "@/interface/Rooms and Suites Interface/viewRoomSuiteBookingApiResponse";


function UserPastAllBookingPageFunctionalComponent(){

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

    const [loadingBookingDetails, setLoadingBookingDetails] = useState<boolean>(true);

    const [roomSuitesBooking, setRoomSuitesBooking] = useState<null | IRoomsSuitesBookingInfoForArrayForCustomer[]>(null);
    const [diningBooking, setDiningBooking] = useState<null | IDiningBookingInfoForArrayForCustomer[]>(null);
    const [eventMeetingBooking, setEventMeetingBooking] = useState<null | EventMeetingBookingInfoForCustomer[]>(null);


    useEffect(()=>{
        fetchAllBookingDetails(loginUserId);
    }, []);


    let allBookingInfo: (IRoomsSuitesBookingInfoForArrayForCustomer | IDiningBookingInfoForArrayForCustomer | EventMeetingBookingInfoForCustomer)[] | null = null;

    if(roomSuitesBooking != null && diningBooking != null && eventMeetingBooking != null){
        allBookingInfo = [...roomSuitesBooking, ...diningBooking, ...eventMeetingBooking];
    }


    async function fetchAllBookingDetails(loginUserId: string) {
        try {
            await fetchRoomSuiteBookingDb(loginUserId);
            await fetchDiningBookingDb(loginUserId);
            await fetchEventMeetingBookingDb(loginUserId);
        } 
        catch (error) {
            console.log(error);
        }
        finally{
            setLoadingBookingDetails(false);
        }
    }

    async function fetchRoomSuiteBookingDb(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/view-past-booking/rooms-suites/${loginUserId}`);
            const data: ViewRoomsSuitesBookingResponseForCustomer = await response.json();
            
            if(response.status === 200){
                if('message' in data){
                    if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_EMPTY){
                        const roomSuitesBookingDb: IRoomsSuitesBookingInfoForArrayForCustomer[] = [];
                        setRoomSuitesBooking(roomSuitesBookingDb);
                    }
                    else if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_PRESENT){
                        const roomSuitesBookingDb: IRoomsSuitesBookingInfoForArrayForCustomer[] | undefined = data.roomSuitesBookingInfo;
                        if(roomSuitesBookingDb){
                            setRoomSuitesBooking(roomSuitesBookingDb);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchDiningBookingDb(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/view-past-booking/dining/${loginUserId}`);
            const data: ViewDiningBookingResponseForCustomer = await response.json();
            if(response.status === 200){
                if('message' in data){
                    if(data.message === DINING_BOOKING_INFO_IS_EMPTY){
                        const diningBookingDb: IDiningBookingInfoForArrayForCustomer[] = [];
                        setDiningBooking(diningBookingDb);
                    }
                    else if(data.message === DINING_BOOKING_INFO_IS_PRESENT){
                        const diningBookingDb: IDiningBookingInfoForArrayForCustomer[] | undefined = data.diningBookingInfo;
                        if(diningBookingDb) {
                            setDiningBooking(diningBookingDb);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchEventMeetingBookingDb(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/view-past-booking/meeting-events/${loginUserId}`);
            const data: ViewEventMeetingBookingResponseForCustomer = await response.json();
            if(response.status === 200){
                if('message' in data){
                    if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY){
                        const eventMeetingBookingDb: EventMeetingBookingInfoForCustomer[] = [];
                        setEventMeetingBooking(eventMeetingBookingDb);
                    }
                    else if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT){
                        const eventMeetingBookingDb: EventMeetingBookingInfoForCustomer[] | undefined = data.eventMeetingBookingInfo;
                        if(eventMeetingBookingDb){
                            setEventMeetingBooking(eventMeetingBookingDb);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    
    return (
        <React.Fragment>

            <div>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
            </div>

            {/* Breadcrumb Navigation */}
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
                    <Link href={`/profile-home-page/view-past-bookings/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            VIEW PAST BOOKINGS 
                        </span>
                    </Link>
                </p>
            </div>

            <div className="m-8">
                <h2 className="text-center text-2xl font-bold mb-4">MY PAST BOOKINGS</h2>

                <div className="m-8">
                    <h4 className="text-lg font-semibold mb-2">Category Wise Bookings</h4>
                    
                    <ol className="ml-6 list-[lower-roman]">
                        <li className="p-1 hover:cursor-pointer hover:text-[goldenrod]">
                            <Link href={`/profile-home-page/view-past-bookings/rooms-suites/${loginUserId}`}>
                                Rooms & Suites Booking
                            </Link>
                        </li>
                        <li className="p-1 hover:cursor-pointer hover:text-[goldenrod]">
                            <Link href={`/profile-home-page/view-past-bookings/dining/${loginUserId}`}>
                                Dining Booking
                            </Link>
                        </li>
                        <li className="p-1 hover:cursor-pointer hover:text-[goldenrod]">
                            <Link href={`/profile-home-page/view-past-bookings/events-meeting-room/${loginUserId}`}>
                                Events/ Meeting Rooms Booking
                            </Link>
                        </li>
                    </ol>
                </div>

                <div className="m-8">
                    <h3 className="text-xl font-semibold mb-4">All Bookings</h3>

                    {loadingBookingDetails &&
                        <div className="flex items-center justify-center bg-[#f5294b] py-20 my-6">
                            <p className="text-white font-semibold text-[1.45rem] font-sans"> 
                                LOADING BOOKING DETAILS ...
                            </p>
                        </div>
                    }

                    {(!loadingBookingDetails &&
                        (roomSuitesBooking !== null && roomSuitesBooking.length == 0) && 
                        (diningBooking !== null && diningBooking.length == 0) && 
                        (eventMeetingBooking !== null && eventMeetingBooking.length == 0)) &&
                        <div className="flex flex-col items-center justify-center bg-[antiquewhite] py-20">
                            <p className="uppercase font-extrabold font-sans text-2xl p-2 leading-[200%] tracking-wide underline">
                                You do not have any Past Bookings
                            </p>
                        </div>
                    }

                    {(allBookingInfo != null && allBookingInfo.length > 0) &&
                        <UserAllBookingComponent allBookingInfo={allBookingInfo} />
                    }


                </div>
                
            </div>

        </React.Fragment>
    );
}


function UserPastAllBookingPage(){
    return(
        <ErrorBoundary>
            <UserPastAllBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


export default UserPastAllBookingPage;