'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import InfiniteScroll from "react-infinite-scroll-component";
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

import EachAdminRoomBookingInfo from "@/components/Admin Booking Information Component/Rooms Suites Booking/EachAdminRoomBookingInfo";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { IRoomsSuitesBookingInfoForAdmin, IRoomsSuitesBookingInfoForArrayForAdmin, ViewPastRoomsSuitesBookingResponseForAdmin } from "@/interface/Rooms and Suites Interface/viewRoomSuiteBookingApiResponse";


function PastRoomsSuitesBookingPage(){
    return(
        <ErrorBoundary>
            <PastRoomsSuitesBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function PastRoomsSuitesBookingPageFunctionalComponent(){

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
            const loginPageCalledFrom = 'Admin Past Rooms Suites Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }

        if(loginUserDetails != null && 
            !loginEmailAddress.endsWith("@royalpalace.co.in")){
                const loginPageCalledFrom = 'Admin Past Rooms Suites Page';
                const loginRedirectPage = '/admin-home-page';
                dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
                dispatch(updateLoginRedirectPage(loginRedirectPage));
                router.push('/admin-login');
                return ;
        }
    }, [loginUserDetails, router, dispatch]);
    

    const [roomSuitesBooking, setRoomSuitesBooking] = useState<null | IRoomsSuitesBookingInfoForArrayForAdmin[]>(null);

    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);


    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchRoomSuiteBookingDb(page);
        }
    }, [page]);


    async function fetchRoomSuiteBookingDb(currentPage: number) {
        try {
            const response: Response = await fetch(`/api/view-past-booking/rooms-suites?page=${currentPage}`);
            const data: ViewPastRoomsSuitesBookingResponseForAdmin = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if('message' in data){
                    if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_EMPTY){
                        const roomSuitesBookingDb: IRoomsSuitesBookingInfoForArrayForAdmin[] = [];
                        setRoomSuitesBooking(roomSuitesBookingDb);
                        setHasMore(false);
                    }
                    else if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_PRESENT){
                        const roomSuitesBookingInfo: IRoomsSuitesBookingInfoForArrayForAdmin[] | undefined = data.roomSuitesBookingInfo;
                        if(roomSuitesBookingInfo){
                            let roomSuitesBookingDb: IRoomsSuitesBookingInfoForArrayForAdmin[] = [];
                            if(Array.isArray(roomSuitesBooking) && roomSuitesBooking.length > 0){
                                roomSuitesBookingDb = [...roomSuitesBooking, ...roomSuitesBookingInfo];
                            }
                            else{
                                roomSuitesBookingDb = roomSuitesBookingInfo;
                            }
                            setRoomSuitesBooking(roomSuitesBookingDb);
                            if(data.pagination){
                                setHasMore(data.pagination.hasMore);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
            setHasMore(false);
        }
    }


    function fetchNext() {
        const nextPage: number = page + 1;
        setPage(nextPage);
        fetchRoomSuiteBookingDb(nextPage);
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
                    <Link href="/admin-home-page/view-past-bookings/rooms-suites"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            ROOMS AND SUITES BOOKING 
                        </span>
                    </Link>
                </p>
            </div>


            {((roomSuitesBooking != null && roomSuitesBooking.length > 0) && 
                (loginUserDetails != null && 
                    loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
                    <div className="m-4">
                        <InfiniteScroll
                            dataLength={roomSuitesBooking.length}
                            next={fetchNext}
                            hasMore={hasMore}
                            loader={
                                <h4 className="text-center text-lg text-brown-700 bg-green-200 py-2 px-4 m-2 font-semibold">
                                    Loading more bookings...
                                </h4>
                            }
                            endMessage={
                                <p className="text-center text-lg text-red-600 font-bold bg-purple-200 py-2 px-4 m-2">
                                    No more Rooms and Suites Bookings
                                </p>
                            }
                        >
                            {roomSuitesBooking.map(function(eachRoomSuitesBookingInfo: IRoomsSuitesBookingInfoForArrayForAdmin){
                                const roomSuitesBookingInfo: IRoomsSuitesBookingInfoForAdmin =  eachRoomSuitesBookingInfo.bookingInfo;  
                                return (
                                    <EachAdminRoomBookingInfo 
                                        key={roomSuitesBookingInfo._id}
                                        eachRoomBookingInfo={roomSuitesBookingInfo} 
                                    />
                                );
                            })}
                        </InfiniteScroll>               
                    </div>
            }

        </div>
    );

}


export default PastRoomsSuitesBookingPage;