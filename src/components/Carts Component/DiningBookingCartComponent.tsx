'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@mui/material/Button';

import { useAppDispatch, useAppSelector } from "@/redux store/hooks";
import { deleteParticularBookingFromDiningCart } from "@/redux store/features/Booking Features/diningBookingCartSlice";
import { getDateTextFromFullDate } from "@/functions/date";
import { convertToINR } from '@/functions/currency';

import { DiningDetailsForCart } from '@/interface/Dining Interface/diningBookingInterface';
import { Dining, DiningInfoResponse } from '@/interface/Dining Interface/hotelDiningInterface';


function DiningBookingCartComponent(){

    const allDiningBookingCart: DiningDetailsForCart[] = useAppSelector((reduxStore) => reduxStore.diningCartSlice.diningCart);

    const dispatch = useAppDispatch();

    useEffect(()=>{
        fetchDiningInformation();
    }, []);

    const [dining, setDining] = useState<Dining[]>([]);

    async function fetchDiningInformation(){
        try {
            const response: Response = await fetch('/api/hotel-booking-information/dining-information/');
            const diningInfo: DiningInfoResponse = await response.json();
            setDining(diningInfo.dining);
        } catch (error) {
            console.log(error);
        }
    }


    function removeDiningFromCartHandler(diningBookingID: number){
        dispatch(deleteParticularBookingFromDiningCart(diningBookingID));
    }


    if(allDiningBookingCart.length == 0){
        return (
            <div className="bg-blue-50 flex flex-col items-center justify-center py-20">
                <p className="uppercase underline text-2xl font-extrabold font-sans pb-3">
                    Dining Cart is Empty
                </p>
                <p className="uppercase underline text-2xl font-extrabold font-sans pb-3">
                    Click on Below Button to Add Items
                </p>
                <Link href={`/dining/`} passHref>
                    <Button variant="contained">Dining Page</Button>
                </Link>
            </div>
        );
    }


    return (
        <div className="border border-black m-2">
            {(allDiningBookingCart.length > 0) && allDiningBookingCart.map(function(eachDiningInCart: DiningDetailsForCart){
                const particularDiningBasicInfo: Dining | undefined = dining.find(function(eachDiningInHotel: Dining){
                    return (eachDiningInHotel.diningAreaTitle == eachDiningInCart.diningRestaurantTitle);
                });
                return (
                    <div key={eachDiningInCart.diningCartId} className="flex flex-row p-4 m-2 border-4 border-gray-500">
                        
                        {/* Image Section */}
                        <div className="w-2/5">
                            {(particularDiningBasicInfo) && 
                            <Image 
                                src={particularDiningBasicInfo.photo} 
                                alt='dining-image' 
                                width={400} 
                                height={230} 
                            />
                            }
                        </div>
                        
                        {/* Info Section */}
                        <div className="w-3/5 pl-4">
                            
                            <p className="font-serif font-bold text-xl mb-2">
                                Dining Restaurant Name: {eachDiningInCart.diningRestaurantTitle} 
                            </p>
                            
                            <p className="mb-2 capitalize font-sans">
                                <span className="font-semibold">Table Booking Date: </span>
                                {getDateTextFromFullDate(typeof eachDiningInCart.tableBookingDate === 'string' ? eachDiningInCart.tableBookingDate: eachDiningInCart.tableBookingDate.toISOString())}
                            </p>
                            
                            <p className="mb-2 capitalize font-sans">
                                <span className="font-semibold">Meal Type: </span>
                                {eachDiningInCart.mealType}
                            </p>
                            
                            <p className="mb-2 capitalize font-sans">
                                <span className="font-semibold">Table Booking Time: </span>
                                {eachDiningInCart.tableBookingTime}
                            </p>
                            
                            <p className="mb-2 capitalize font-sans">
                                <span className="font-semibold">Total Number Of Guest: </span>
                                {eachDiningInCart.noOfGuests}
                            </p>
                            
                            <p className="mb-2 capitalize font-sans">
                                <span className="font-semibold">Total Booking Price: </span>
                                {convertToINR(eachDiningInCart.priceForBooking)}
                            </p>
                            
                            <p className="font-semibold">Total Number Of Tables</p>
                            <div className="flex flex-row mb-4">
                                <p className="pr-6 font-sans">
                                    <span className="font-semibold">Two Guest Table: </span>
                                    {eachDiningInCart.tableBookingCountDetails.tableCountTwoPerson}
                                </p>
                                <p className="pr-6 font-sans">
                                    <span className="font-semibold">Four Guest Table: </span>
                                    {eachDiningInCart.tableBookingCountDetails.tableCountFourPerson}
                                </p>
                                <p className="pr-6 font-sans">
                                    <span className="font-semibold">Six Guest Table: </span>
                                    {eachDiningInCart.tableBookingCountDetails.tableCountSixPerson}
                                </p>
                            </div>
                            
                            <Button variant="contained" onClick={()=>removeDiningFromCartHandler(eachDiningInCart.diningCartId)}>
                                Remove From Cart
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default DiningBookingCartComponent;