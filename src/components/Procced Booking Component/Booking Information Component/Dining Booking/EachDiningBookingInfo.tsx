'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { getDateTextFromFullDate } from "@/functions/date";
import { convertToINR } from '@/functions/currency';

import { IDiningCartInformation } from '@/interface/Dining Interface/diningCartApiResponse';
import { Dining, DiningInfoResponse } from '@/interface/Dining Interface/hotelDiningInterface';


interface IPropsEachDiningBookingInfo{
    eachDiningBookingInfo: IDiningCartInformation;
}

function EachDiningBookingInfo(props: IPropsEachDiningBookingInfo){

    const eachDiningBookingInfo: IDiningCartInformation = props.eachDiningBookingInfo;

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

    const particularDiningBasicInfo: Dining | undefined = dining.find(function(eachDiningInHotel: Dining){
        return (eachDiningInHotel.diningAreaTitle == eachDiningBookingInfo.diningRestaurantTitle);
    });

    return (
        <div className="flex flex-row p-1 m-1 border-4 border-gray-500">
            
            
            <div className="w-2/5">
                {(particularDiningBasicInfo) && 
                <Image 
                    src={particularDiningBasicInfo.photo} 
                    alt='dining-image' 
                    width={430} 
                    height={210} 
                />
                }
            </div>
            

            <div className="w-3/5 p-0">
                
                <p className="font-serif text-xl font-bold mb-1">
                    Dining Restaurant Name: {eachDiningBookingInfo.diningRestaurantTitle} 
                </p>
                
                <p className="font-sans mb-2 capitalize">
                    <span className="font-semibold">Table Dining Date: </span>
                    {getDateTextFromFullDate(eachDiningBookingInfo.tableBookingDate.toString())}
                </p>
                
                <p className="font-sans mb-2 capitalize">
                    <span className="font-semibold">Meal Type: </span>
                    {eachDiningBookingInfo.mealType}
                </p>
                
                <p className="font-sans mb-2 capitalize">
                    <span className="font-semibold">Table Booking Time: </span>
                    {eachDiningBookingInfo.tableBookingTime}
                </p>
                
                <p className="font-sans mb-2 capitalize">
                    <span className="font-semibold">Total Number Of Guest: </span>
                    {eachDiningBookingInfo.noOfGuests}
                </p>
                
                <p className="font-sans mb-2 capitalize">
                    <span className="font-semibold">Total Booking Price: </span>
                    {convertToINR(eachDiningBookingInfo.priceForBooking)}
                </p>
                
                <p className="font-semibold">Total Number Of Tables</p>
                
                <div className="flex flex-row pb-1">
                    <p className="pr-3">
                        <span className="font-semibold">Two Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountTwoPerson}
                    </p>
                    
                    <p className="pr-3">
                        <span className="font-semibold">Four Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountFourPerson}
                    </p>
                    
                    <p className="pr-3">
                        <span className="font-semibold">Six Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountSixPerson}
                    </p>
                </div>
                
            </div>
        </div>
    );

}

export default EachDiningBookingInfo;