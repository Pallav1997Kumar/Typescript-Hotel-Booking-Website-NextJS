'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { getDateTextFromFullDate } from "@/functions/date";
import { convertToINR } from '@/functions/currency';

import { IDiningBookingInfoForCustomer } from '@/interface/Dining Interface/viewDiningBookingApiResponse';
import { ITransactionDetailsFrontend } from '@/interface/hotelCustomersInterface';
import { Dining, DiningInfoResponse } from '@/interface/Dining Interface/hotelDiningInterface';


interface IPropsEachDiningBookingInfo {
    eachDiningBookingInfo: IDiningBookingInfoForCustomer;
    transactionDetails: ITransactionDetailsFrontend;
}


function EachDiningBookingInfo(props: IPropsEachDiningBookingInfo){

    const eachDiningBookingInfo: IDiningBookingInfoForCustomer = props.eachDiningBookingInfo;
    const transactionDetails: ITransactionDetailsFrontend = props.transactionDetails;

    useEffect(()=>{
        fetchDiningInformation();
    }, []);

    const [dining, setDining] = useState<Dining[]>([]);

    async function fetchDiningInformation(): Promise<void>{
        try {
            const response: Response = await fetch('/api/hotel-booking-information/dining-information/');
            const diningInfo: DiningInfoResponse = await response.json();
            const diningInfomation: Dining[] = diningInfo.dining;
            setDining(diningInfomation);
        } catch (error) {
            console.log(error);
        }
    }

    const particularDiningBasicInfo: Dining | undefined = dining.find(function(eachDiningInHotel: Dining){
        return (eachDiningInHotel.diningAreaTitle == eachDiningBookingInfo.diningRestaurantTitle);
    });

    return (
        <div className="flex flex-row p-4 m-4 border-4 border-gray-500">
            

            {/* Image */}
            <div className="w-2/5">
                {(particularDiningBasicInfo != null) && 
                    <Image 
                        src={particularDiningBasicInfo.photo} 
                        alt='dining-image' 
                        width={430} 
                        height={210} 
                    />
                }
            </div>
            

            {/* Info Section */}
            <div className="w-3/5 px-4">

                <p className="font-serif text-xl font-bold mb-2">
                    Dining Restaurant Name: {eachDiningBookingInfo.diningRestaurantTitle} 
                </p>

                {transactionDetails != null &&
                    <p className="mb-2 capitalize font-sans">
                        <span className="font-semibold">Dining Table Booked On Date: </span>
                        {getDateTextFromFullDate(transactionDetails.transactionDateTime.toString())}
                    </p>
                }

                <p className="mb-2 capitalize font-sans">
                    <span className="font-semibold">Table Dining Date: </span>
                    {getDateTextFromFullDate(eachDiningBookingInfo.tableBookingDate.toString())}
                </p>
                
                <p className="mb-2 capitalize font-sans">
                    <span className="font-semibold">Meal Type: </span>
                    {eachDiningBookingInfo.mealType}
                </p>
                
                <p className="mb-2 capitalize font-sans">
                    <span className="font-semibold">Table Booking Time: </span>
                    {eachDiningBookingInfo.tableBookingTime}
                </p>
                
                <p className="mb-2 capitalize font-sans">
                    <span className="font-semibold">Total Number Of Guest: </span>
                    {eachDiningBookingInfo.noOfGuests}
                </p>
                
                <p className="mb-2 capitalize font-sans">
                    <span className="font-semibold">Total Booking Price: </span>
                    {convertToINR(eachDiningBookingInfo.priceForBooking)}
                </p>
                
                <p className="font-semibold mt-4 mb-2">Total Number Of Tables</p>
                
                <div className="flex flex-row mb-2">
                    
                    <p className="pr-6 font-sans">
                        <span className="font-semibold">Two Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountTwoPerson}
                    </p>
                    
                    <p className="pr-6 font-sans">
                        <span className="font-semibold">Four Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountFourPerson}
                    </p>
                    
                    <p className="pr-6 font-sans">
                        <span className="font-semibold">Six Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountSixPerson}
                    
                    </p>
                </div>
                
            </div>
        </div>
    )

}

export default EachDiningBookingInfo;