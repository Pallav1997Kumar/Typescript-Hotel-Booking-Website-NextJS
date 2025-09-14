'use client'
import React from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import EachRoomCartComponent from './EachRoomCartComponent';

import { IRoomsDetailsForCart } from "@/interface/Rooms and Suites Interface/roomsSuitesBookingInterface";


function RoomsBookingCartComponent() {

    const allRoomBookingCart: IRoomsDetailsForCart[] = useAppSelector((reduxStore) => reduxStore.roomCartSlice.roomCart);

    
    if(allRoomBookingCart.length == 0){
        return (
            <div className="bg-azure flex flex-col items-center justify-center py-20">
                <p className="uppercase underline text-2xl font-extrabold font-sans pb-5">
                    Rooms And Suites Cart is Empty
                </p>
                <p className="uppercase underline text-2xl font-extrabold font-sans pb-5">
                    Click on Below Button to Add Items
                </p>
                <Link href={`/rooms-suites/`} passHref>
                    <Button variant="contained">
                        Rooms And Suites Page
                    </Button>
                </Link>
            </div>
        );
    }


    return (
        <div className="border border-black m-2">
            {(allRoomBookingCart.length > 0) && allRoomBookingCart.map(function(eachRoomInCart: IRoomsDetailsForCart){
                return(
                    <EachRoomCartComponent 
                        key={eachRoomInCart.roomCartId} 
                        eachRoomInCart={eachRoomInCart} 
                    />
                )
            })}
        </div>
    );
}

export default RoomsBookingCartComponent;