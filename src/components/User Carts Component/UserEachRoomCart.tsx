'use client'
import React, { useState, useEffect, ChangeEvent } from "react";
import Image from 'next/image';

import Button from '@mui/material/Button';

import { getDateTextFromOnlyDate } from "@/functions/date";
import { convertToINR } from "@/functions/currency";

import { IGuestRoomDetails, IRoomsSuitesCartInfo } from "@/interface/Rooms and Suites Interface/roomsSuitesDbModelsInterface";
import { Room, RoomSuitesInfoResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface";


interface IRoomsSuitesCartInformation extends IRoomsSuitesCartInfo{
    _id: string;
}

interface IPropsUserEachRoomCart{
    isRoomSuiteChecked: boolean;
    eachRoomInCart: IRoomsSuitesCartInformation;
    onRemoveRoomsSuitesItemFromCart: (id: string) => void;
    onGetRoomsSuitesCheckboxInfo: (event: ChangeEvent<HTMLInputElement>, id: string) => void;
}


function UserEachRoomCart(props: IPropsUserEachRoomCart){

    const eachRoomInCart: IRoomsSuitesCartInformation = props.eachRoomInCart;
    const isRoomSuiteChecked: boolean = props.isRoomSuiteChecked;
    console.log(eachRoomInCart.bookingCheckinDate);
    console.log(eachRoomInCart.bookingCheckinDate.toString());
    
    const [roomsSuites, setRoomsSuites] = useState<Room[]>([]);
    const [displayGuestDetails, setDisplayGuestDetails] = useState(false);

    useEffect(()=>{
        fetchRoomsSuitesInformation();
    }, []);

    const particularRoomBasicInfo: Room | undefined = roomsSuites.find(function(eachRoomInHotel: Room){
        return (eachRoomInHotel.title == eachRoomInCart.bookingRoomTitle);
    });


    async function fetchRoomsSuitesInformation(){
        try {
            const response: Response = await fetch('/api/hotel-booking-information/room-and-suites-information/');
            const roomSuitesInfo: RoomSuitesInfoResponse = await response.json();
            setRoomsSuites(roomSuitesInfo.rooms);
        } catch (error) {
            console.log(error);
        }
    }

    async function removeRoomsSuitesItemFromCart(id: string){
        props.onRemoveRoomsSuitesItemFromCart(id);
    }

    function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>, id: string){
        props.onGetRoomsSuitesCheckboxInfo(event, id);
    }


    return(
        <div className="flex flex-col p-4 m-4 border-4 border-gray-400">
            <div className="flex flex-row">

                <div className="w-1/40 flex items-center justify-center">
                    <input 
                        type="checkbox" 
                        checked={isRoomSuiteChecked}
                        onChange={(event)=>handleCheckboxChange(event, eachRoomInCart._id)}      
                    />
                </div>

                <div className="w-16/40">
                    {(particularRoomBasicInfo != null) && 
                    <Image src={particularRoomBasicInfo.photos[0]} alt="room-image" width={400} height={200} />
                    }
                </div>

                <div className="w-23/40 p-0">
                    <p className="font-serif text-xl font-bold mb-2">
                        Room Title: {eachRoomInCart.bookingRoomTitle} 
                    </p>
                    
                    <p className="mb-2">
                        <span className="font-semibold">CheckIn Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomInCart.bookingCheckinDate.toString())}  
                    </p>
                    
                    <p className="mb-2">
                        <span className="font-semibold">CheckOut Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomInCart.bookingCheckoutDate.toString())}  
                    </p>
                    
                    <p className="mb-2">
                        <span className="font-semibold">Total Number of Rooms: </span> 
                        {eachRoomInCart.totalRooms} 
                    </p>
                    
                    <p className="mb-2">
                        <span className="font-semibold">Total Number of Guests: </span> 
                        {eachRoomInCart.totalGuest} 
                    </p>
                    
                    <p className="mb-2">
                        <span className="font-semibold">Total Price Of Room: </span>
                        {convertToINR(eachRoomInCart.totalPriceOfAllRooms)} 
                    </p>
                    
                    <Button 
                        onClick={()=>removeRoomsSuitesItemFromCart(eachRoomInCart._id)} 
                        variant="contained"
                    >
                        Remove From Cart
                    </Button>
                    
                    <p 
                        onClick={()=>setDisplayGuestDetails(true)} 
                        className="mt-5 cursor-pointer text-blue-600 uppercase"
                    >
                        View Guest Details
                    </p>
                </div>

            </div>

            {displayGuestDetails && 
            <div className="flex flex-col bg-bisque border-2 border-green-500">
                <div className="flex flex-row">
                    {(eachRoomInCart.guestRoomsDetails).map(function(eachRoomForGuest: IGuestRoomDetails){
                        return (
                            <div key={eachRoomForGuest.roomNo} className="p-2.5 m-1 border-dotted border-blue-500">
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

export default UserEachRoomCart;