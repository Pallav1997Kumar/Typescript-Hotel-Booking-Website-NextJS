'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';

import Button from '@mui/material/Button';

import { useAppDispatch } from "@/redux store/hooks";
import { deleteParticularBookingFromRoomCart } from "@/redux store/features/Booking Features/roomBookingCartSlice";
import { getDateTextFromOnlyDate } from "@/functions/date";
import { convertToINR } from "@/functions/currency";

import { IRoomsDetailsForCart, ParticularRoomInfoInterface } from "@/interface/Rooms and Suites Interface/roomsSuitesBookingInterface";
import { RoomSuitesInfoResponse, Room } from "@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface";


interface IPropsEachRoomCartComponent {
    eachRoomInCart: IRoomsDetailsForCart;
}


function EachRoomCartComponent(props: IPropsEachRoomCartComponent){

    const dispatch = useAppDispatch();

    useEffect(()=>{
        fetchRoomsSuitesInformation();
    }, []);

    const [roomsSuites, setRoomsSuites] = useState<Room[]>([]);

    async function fetchRoomsSuitesInformation(){
        try {
            const response: Response = await fetch('/api/hotel-booking-information/room-and-suites-information/');
            const roomSuitesInfo: RoomSuitesInfoResponse = await response.json();
            const rooms: Room[] = roomSuitesInfo.rooms
            setRoomsSuites(rooms);
        } catch (error) {
            console.log(error);
        }
    }

    const [displayGuestDetails, setDisplayGuestDetails] = useState<boolean>(false);
    const eachRoomInCart: IRoomsDetailsForCart = props.eachRoomInCart;
    const particularRoomBasicInfo: Room | undefined = roomsSuites.find(function(eachRoomInHotel: Room){
        return (eachRoomInHotel.title == eachRoomInCart.roomTitle);
    });


    function removeRoomFromCartHandler(roomID: number){
        dispatch(deleteParticularBookingFromRoomCart(roomID));
    }


    return (
        <div className="flex flex-col p-4 m-4 border-4 border-gray-500">
            <div className="flex flex-row">
                
                <div className="w-2/5">
                    {(particularRoomBasicInfo) && 
                    <Image 
                        src={particularRoomBasicInfo.photos[0]} 
                        alt="room-image" 
                        width={400} 
                        height={200} 
                    />
                    }
                </div>
                
                <div className="w-3/5 p-0">
                    <p className="font-serif text-lg font-bold mb-2">
                        Room Title: {eachRoomInCart.roomTitle} 
                    </p>
                    <p className="font-sans mb-2">
                        <span className="font-semibold">CheckIn Date: </span> 
                        {getDateTextFromOnlyDate(typeof eachRoomInCart.checkinDate === 'string' ? eachRoomInCart.checkinDate : eachRoomInCart.checkinDate.toISOString())}  
                    </p>
                    <p className="font-sans mb-2">
                        <span className="font-semibold">CheckOut Date: </span> 
                        {getDateTextFromOnlyDate(typeof eachRoomInCart.checkoutDate === 'string' ? eachRoomInCart.checkoutDate : eachRoomInCart.checkoutDate.toISOString())} 
                    </p>
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Total Number of Rooms: </span> 
                        {eachRoomInCart.totalRooms} 
                    </p>
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Total Number of Guests: </span> 
                        {eachRoomInCart.totalGuest} 
                    </p>
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Total Price Of Room: </span>
                        {convertToINR(eachRoomInCart.totalPriceOfAllRooms)} 
                    </p>
                    <Button onClick={()=> removeRoomFromCartHandler(eachRoomInCart.roomCartId)} variant="contained">
                        Remove From Cart
                    </Button>
                    <p onClick={()=>setDisplayGuestDetails(true)} className="mt-5 hover:cursor-pointer hover:uppercase hover:text-blue-600">
                        View Guest Details
                    </p>
                </div>
                
            </div>
            
            {displayGuestDetails && 
            <div className="flex flex-col bg-orange-100 border-2 border-green-600 mt-4">
                <div className="flex flex-row flex-wrap">
                    {(eachRoomInCart.guestRoomsDetails).map(function(eachRoomForGuest: ParticularRoomInfoInterface){
                        return (
                            <div key={eachRoomForGuest.roomNo} className="p-4 m-1 border border-dotted border-blue-600">
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

                <div className="flex items-center justify-center m-4">
                    <Button onClick={()=>setDisplayGuestDetails(false)} variant="contained">
                        CLOSE
                    </Button>
                </div>
            </div>
            }
        </div>
    );
}

export default EachRoomCartComponent;