'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InfiniteScroll from "react-infinite-scroll-component";

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

import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";
import { IDiningBookingInfoForAdmin, IDiningBookingInfoForArrayForAdmin, ViewPastDiningBookingResponseForAdmin } from "@/interface/Dining Interface/viewDiningBookingApiResponse";


function PastDiningBookingPage(){
    return(
        <ErrorBoundary>
            <PastDiningBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function PastDiningBookingPageFunctionalComponent(){

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
            const loginPageCalledFrom = 'Admin Past Dining Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
        if(loginUserDetails != null && 
            !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Past Dining Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
    }, [loginUserDetails, router, dispatch]);


    const [diningBooking, setDiningBooking] = useState<null | IDiningBookingInfoForArrayForAdmin[]>(null);

    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);


    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchDiningBookingDb(page);
        }
    }, [page]);


    async function fetchDiningBookingDb(currentPage: number) {
        try {
            const response: Response = await fetch(`/api/view-past-booking/dining?page=${currentPage}`);
            const data: ViewPastDiningBookingResponseForAdmin = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if('message' in data){
                    if(data.message === DINING_BOOKING_INFO_IS_EMPTY){
                        const diningBookingDb: IDiningBookingInfoForArrayForAdmin[] = [];
                        setDiningBooking(diningBookingDb);
                        setHasMore(false);
                    }
                    else if(data.message === DINING_BOOKING_INFO_IS_PRESENT){
                        const diningBookingInfo: IDiningBookingInfoForArrayForAdmin[] | undefined = data.diningBookingInfo;
                        if(diningBookingInfo){
                            let diningBookingDb: IDiningBookingInfoForArrayForAdmin[] = [];
                            if(Array.isArray(diningBooking) && diningBooking.length > 0){
                                diningBookingDb = [...diningBooking, ...diningBookingInfo];
                            }
                            else{
                                diningBookingDb = diningBookingInfo;
                            }
                            setDiningBooking(diningBookingDb);
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
        fetchDiningBookingDb(nextPage);
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
                    <Link href="/admin-home-page/view-past-bookings/dining"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            DINING BOOKING 
                        </span>
                    </Link>
                </p>
            </div>


            {((diningBooking != null && 
                diningBooking.length > 0) && 
                (loginUserDetails != null && 
                    loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
                    <div className="m-4">
                        <InfiniteScroll
                            dataLength={diningBooking.length}
                            next={fetchNext}
                            hasMore={hasMore}
                            loader={
                                <h4 className="text-center text-lg text-brown-700 bg-green-200 py-2 px-4 m-2 font-semibold">
                                    Loading more bookings...
                                </h4>
                            }
                            endMessage={
                                <p className="text-center text-lg text-red-600 font-bold bg-purple-200 py-2 px-4 m-2">
                                    No more Dining Bookings
                                </p>
                            }
                        >
                            {diningBooking.map(function(eachDiningBookingInfo: IDiningBookingInfoForArrayForAdmin){
                                const diningBookingInfo: IDiningBookingInfoForAdmin =  eachDiningBookingInfo.bookingInfo; 
                                return (
                                    <EachAdminDiningBookingInfo 
                                        key={diningBookingInfo._id}
                                        eachDiningBookingInfo={diningBookingInfo} 
                                    />
                                );
                            })}
                        </InfiniteScroll>               
                    </div>
            }

        </div>
    );

}


export default PastDiningBookingPage;