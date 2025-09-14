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
    ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, 
    ROOMS_SUITES_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";

import UserRoomsSuitesBookingComponent from "@/components/User Booking Component/UserRoomsSuitesBookingComponent";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { IRoomsSuitesBookingInfoForArrayForCustomer, ViewRoomsSuitesBookingResponseForCustomer } from "@/interface/Rooms and Suites Interface/viewRoomSuiteBookingApiResponse";


function UserCurrentRoomsSuitesBookingPageFunctionalComponent(){

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

    useEffect(()=>{
        fetchRoomSuiteBookingDb(loginUserId);
    }, []);

    async function fetchRoomSuiteBookingDb(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/view-current-booking/rooms-suites/${loginUserId}`);
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
        finally {
            setLoadingBookingDetails(false);
        }
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
                    <Link href="/profile-home-page"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            PROFILE PAGE 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span> 
                    <Link href={`/profile-home-page/view-current-bookings/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            VIEW CURRENT OR UPCOMING BOOKINGS 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span> 
                    <Link href={`/profile-home-page/view-current-bookings/rooms-suites/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            ROOMS AND SUITES BOOKING 
                        </span>
                    </Link>
                </p>
            </div>

            {/* Loading Message */}
            {loadingBookingDetails &&
                <div className="bg-pink-400 p-6 my-4 flex items-center justify-center">
                    <p className="text-gray-200 font-bold text-2xl font-sans"> 
                        LOADING ROOMS AND SUITES BOOKING DETAILS...
                    </p>
                </div>
            }

            {/* Booking Info Container */}
            <div className="m-8">
                {(!loadingBookingDetails && roomSuitesBooking !== null && roomSuitesBooking.length == 0) &&
                    <div className="bg-blue-200 p-6 my-4 flex items-center justify-center">
                        <p className="text-red-700 font-bold text-2xl font-sans">
                            You do not have any Current or Future Upcoming Rooms and Suites Bookings
                        </p>
                    </div>
                }

                {(!loadingBookingDetails && roomSuitesBooking !== null && roomSuitesBooking.length > 0) &&
                    <UserRoomsSuitesBookingComponent roomSuitesBookingInfo={roomSuitesBooking} />
                }
            </div>

        </div>
    );

}


function UserCurrentRoomsSuitesBookingPage(){
    return(
        <ErrorBoundary>
            <UserCurrentRoomsSuitesBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


export default UserCurrentRoomsSuitesBookingPage;