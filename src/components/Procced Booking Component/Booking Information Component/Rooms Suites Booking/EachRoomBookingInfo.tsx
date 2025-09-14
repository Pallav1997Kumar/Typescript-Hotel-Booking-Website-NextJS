'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';

import { getDateTextFromOnlyDate } from "@/functions/date";
import { convertToINR } from "@/functions/currency";

import { IRoomsSuitesCartInformation } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";
import { Room, RoomSuitesInfoResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface";
import { IGuestRoomDetails } from "@/interface/Rooms and Suites Interface/roomsSuitesDbModelsInterface";


interface IPropsEachRoomBookingInfo{
    eachRoomBookingInfo: IRoomsSuitesCartInformation;
}


function EachRoomBookingInfo(props: IPropsEachRoomBookingInfo){
    const eachRoomBookingInfo: IRoomsSuitesCartInformation = props.eachRoomBookingInfo;

    useEffect(()=>{
        fetchRoomsSuitesInformation();
    }, []);

    const [roomsSuites, setRoomsSuites] = useState<Room[]>([]);

    async function fetchRoomsSuitesInformation(){
        try {
            const response: Response = await fetch('/api/hotel-booking-information/room-and-suites-information/');
            const roomSuitesInfo: RoomSuitesInfoResponse = await response.json();
            setRoomsSuites(roomSuitesInfo.rooms);
        } catch (error) {
            console.log(error);
        }
    }

    const [displayGuestDetails, setDisplayGuestDetails] = useState<boolean>(false);

    const particularRoomBasicInfo: Room | undefined = roomsSuites.find(function(eachRoomInHotel: Room){
        return (eachRoomInHotel.title == eachRoomBookingInfo.bookingRoomTitle);
    });

    return (
        <div className="flex flex-col p-1 m-1 border-4 border-gray-500">
            <div className="flex flex-row">
                
                <div className="w-2/5">
                    {(particularRoomBasicInfo) && 
                    <Image src={particularRoomBasicInfo.photos[0]} alt="room-image" width={400} height={200} />
                    }
                </div>
                
                <div className="w-3/5 p-0">
                    
                    <p className="font-serif text-xl font-bold mb-1">
                        Room Title: {eachRoomBookingInfo.bookingRoomTitle} 
                    </p>
    
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Room CheckIn Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomBookingInfo.bookingCheckinDate.toString())}  
                    </p>
                    
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Room CheckOut Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomBookingInfo.bookingCheckoutDate.toString())} 
                    </p>
                    
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Total Number of Rooms: </span> 
                        {eachRoomBookingInfo.totalRooms} 
                    </p>
                    
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Total Number of Guests: </span> 
                        {eachRoomBookingInfo.totalGuest} 
                    </p>
                    
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Total Price Of Room: </span>
                        {convertToINR(eachRoomBookingInfo.totalPriceOfAllRooms)} 
                    </p>
                    
                    <p onClick={()=>setDisplayGuestDetails(true)} className="mt-5 cursor-pointer hover:uppercase hover:text-blue-500">
                        View Guest Details
                    
                    </p>
                </div>
                
            </div>
            
            {displayGuestDetails && 
            <div className="flex flex-col bg-bisque border-2 border-green-500">
                <div className="flex flex-row flex-wrap p-[1%_2.5%_1%_1%] m-[0.1%] border border-dotted border-blue-500">
                    {(eachRoomBookingInfo.guestRoomsDetails).map(function(eachRoomForGuest: IGuestRoomDetails){
                        return (
                            <div key={eachRoomForGuest.roomNo} className="p-[1%_2.5%_1%_1%] m-[0.1%] border border-dotted border-blue-500">
                                <p>
                                    <span className="font-semibold">Room: </span>
                                    {eachRoomForGuest.roomNo} 
                                </p>
                                
                                <p>
                                    <span className="font-semibold">Number of Adults: </span> 
                                    {eachRoomForGuest.noOfAdult} 
                                </p>
                                
                                <p>
                                    <span className="font-semibold">Number of Children: </span> 
                                    {eachRoomForGuest.noOfChildren} 
                                </p>
                                
                                <p>
                                    <span className="font-semibold">Total Guests in Room: </span>
                                    {eachRoomForGuest.total}
                                </p>
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center justify-center m-1">
                    <Button onClick={()=>setDisplayGuestDetails(false)} variant="contained">
                        CLOSE
                    </Button>
                </div>
            </div>
            }
        </div>
    );
}

export default EachRoomBookingInfo;