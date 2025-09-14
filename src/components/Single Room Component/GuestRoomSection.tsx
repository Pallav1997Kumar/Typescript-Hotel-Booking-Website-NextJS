"use client"
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';

import { guestTitleConstant } from "@/constant string files/roomsImportantConstants";
import { Room, GuestCount, RoomGuestInfoResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesGuestInfoInterface";


interface IPropsGuestRoomSection{
    roomNo: number;
    roomTitle: string;
    onGetGuestDataParticularRoom: (data: ParticularRoomInfoInterface) => void;
    roomGuestDetails: ParticularRoomInfoInterface | undefined;
}

interface ParticularRoomInfoInterface {
    roomNo: number;
    noOfAdult: number;
    noOfChildren: number;
    total: number;
}


export default function GuestRoomSection(props: IPropsGuestRoomSection){
    const roomNo: number = props.roomNo;
    const roomGuestDetails: ParticularRoomInfoInterface | undefined = props.roomGuestDetails;
    const roomTitle: string = props.roomTitle;

    useEffect(()=>{
        fetchRoomGuestInfo();
    },[]);

    const [guestCountOfRoom, setGuestCountOfRoom] = useState<null | GuestCount[]>(null);
    const [editGuestDetails, setEditGuestDetails] = useState<boolean>(false);
    const [noOfChildParticularRoom, setNoOfChildParticularRoom] = useState<number>(roomGuestDetails?.noOfChildren || 0);
    const [noOfAdultParticularRoom, setNoOfAdultParticularRoom] = useState<number>(roomGuestDetails?.noOfAdult || 0);
    const totalParticularRoom: number = noOfAdultParticularRoom + noOfChildParticularRoom;
    // console.log(guestCountOfRoom);

    let maxAdultGuestCount: number = 0;
    let maxChildGuestCount: number = 0;
    if(guestCountOfRoom != null && Array.isArray(guestCountOfRoom)){
        guestCountOfRoom.forEach(function(eachGuestTitle: GuestCount){
            if(eachGuestTitle.guestTitle == guestTitleConstant.ADULT){
                maxAdultGuestCount = eachGuestTitle.maximumGuest;
            }
            if(eachGuestTitle.guestTitle == guestTitleConstant.CHILDREN){
                maxChildGuestCount = eachGuestTitle.maximumGuest;
            }
        });
    }

    const adultGuestCountArray: number[] = [];
    const childGuestCountArray: number[] = [];
    if(maxAdultGuestCount > 0){
        for(let i = 1; i <= maxAdultGuestCount; i++){
            adultGuestCountArray.push(i);
        }
    }

    if(maxChildGuestCount > 0){
        for(let i = 0; i <= maxChildGuestCount; i++){
            childGuestCountArray.push(i);
        }
    }
    // console.log(adultGuestCountArray);
    // console.log(childGuestCountArray);

    async function fetchRoomGuestInfo(){
        try{
            const response: Response = await fetch('/api/hotel-booking-information/room-and-suites-information/hotel-rooms-guest-count/');
            const data: RoomGuestInfoResponse = await response.json();
            const allRoomsData: Room[] = data.roomsGuestInfo;
            const guestDetails: GuestCount[] = fetchSpecificRoomGuestInfo(allRoomsData,roomTitle);
            setGuestCountOfRoom(guestDetails);
        }
        catch(error){
            console.log(error);
        }
    }

    function fetchSpecificRoomGuestInfo(allRoomsInfo: Room[], titleOfRoom: string): GuestCount[]{
        const specificRoomInfo: Room | undefined = allRoomsInfo.find(function(eachRoom: Room){
            return eachRoom.title == titleOfRoom;
        });
        if(!specificRoomInfo){
            throw new Error("specificRoomInfo is missing");
        }
        const guestDetails: GuestCount[] = specificRoomInfo.guestCount;
        return guestDetails;
    }

    function buttonClickHandler(){
        setEditGuestDetails(false);
        const particularRoomInfo: ParticularRoomInfoInterface = {
            roomNo: roomNo,
            noOfAdult: noOfAdultParticularRoom,
            noOfChildren: noOfChildParticularRoom,
            total: totalParticularRoom
        };
        props.onGetGuestDataParticularRoom(particularRoomInfo);
    }


    return (
        <div className="my-4">
            <p>Room {roomNo}</p>

            {!editGuestDetails &&
            <div>
                <span className="mr-5">{noOfAdultParticularRoom} Adults, </span>
                <span className="mr-5">{noOfChildParticularRoom} Children </span>
                <span className="mx-12"> Total: {totalParticularRoom} </span>
                <span 
                    className="text-left text-slate-500 hover:text-sky-400 hover:cursor-pointer" 
                    onClick={()=> setEditGuestDetails(true)}
                >
                    Edit
                </span>
            </div>}

            {editGuestDetails && 
            <div>

                <span className="font-semibold">Adults</span>
                {adultGuestCountArray.map(function(eachCount: number){
                    if(noOfAdultParticularRoom == eachCount){
                        return (
                            <span 
                                key={eachCount} 
                                className="mx-1 px-2 py-1 bg-red-400 text-white rounded"
                            > 
                                {eachCount} 
                            </span>
                        );
                    }
                    else{
                        return (
                            <span 
                                key={eachCount} 
                                onClick={()=>setNoOfAdultParticularRoom(eachCount)} 
                                className="mx-1 px-2 py-1 bg-beige hover:bg-orange-300 cursor-pointer rounded"
                            > 
                                {eachCount} 
                            </span>
                        );
                    }
                })}

                <span className="ml-10 font-semibold">Children</span>
                {childGuestCountArray.map(function(eachCount: number){
                    if(noOfChildParticularRoom == eachCount){
                        return (
                            <span 
                                key={eachCount} 
                                className="mx-1 px-2 py-1 bg-red-400 text-white rounded"
                            > 
                                {eachCount} 
                            </span>
                        );
                    }
                    else{
                        return (
                            <span 
                                key={eachCount} 
                                onClick={()=>setNoOfChildParticularRoom(eachCount)} 
                                className="mx-1 px-2 py-1 bg-beige hover:bg-orange-300 cursor-pointer rounded"
                            > 
                                {eachCount} 
                            </span>
                        );
                    }
                })}     
            
                <span className="ml-10 mr-2 font-semibold">Total</span>
                <span>{totalParticularRoom}</span>
                <span className="ml-7">
                    <Button 
                        disabled={noOfAdultParticularRoom < 1} 
                        color="secondary" 
                        onClick={buttonClickHandler}
                    >
                        Done
                    </Button>
                </span>
            </div>}
        </div>
    );
}