import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';

import { convertToINR } from "@/functions/currency";

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { RoomWithDateDetails, DateDetail, RoomSuitesEachDayInfoRespone } from "@/interface/Rooms and Suites Interface/eachDayRoomSuitesInfoInterface";


interface RoomsProps {
    title: string;
    intro: string;
    path: string;
    description: string;
    totalRoomSize: string;
    coverPhoto: string;
}


function Rooms(props: RoomsProps){
    return (
        <ErrorBoundary>
            <RoomsFunctionalComponent 
                title={props.title} 
                intro={props.intro} 
                path={props.path}
                description={props.description} 
                totalRoomSize={props.totalRoomSize} 
                coverPhoto={props.coverPhoto}
            />
        </ErrorBoundary>
    );
}


async function RoomsFunctionalComponent(props: RoomsProps){

    const title: string = props.title;
    const intro: string = props.intro;
    const path: string = props.path;
    const description: string = props.description;
    const totalRoomSize: string = props.totalRoomSize;
    const coverPhoto: string = props.coverPhoto;

    const roomsWithDateInformation: RoomWithDateDetails | undefined = await fetchRoomsSuitesEachDayData(title);
    if(!roomsWithDateInformation){
        throw new Error("Missing roomsWithDateInformation");
    }
    const dateDetailsOfRoom: DateDetail[] = roomsWithDateInformation.dateDetails;

    const startingPriceOfRoom: number = getRoomStartingPrice(dateDetailsOfRoom);

    function getRoomStartingPrice(dateDetailsOfParticularRoom: DateDetail[]): number {
        dateDetailsOfParticularRoom.sort((a,b) => a.price - b.price);
        const minimumPriceDateDetails: DateDetail = dateDetailsOfParticularRoom[0];
        const minimumPrice: number = minimumPriceDateDetails.price;
        return minimumPrice;
    }

    return (
        <React.Fragment>
            <div className="m-5 bg-[#e6ffff] flex flex-row">
                <div className="p-4  w-3/7">
                    <Image src={coverPhoto} alt="room-cover-image" width={500} height={300} className="w-[500px] h-[300px] object-cover" />
                </div>

                <div className="p-6 flex flex-col justify-between w-4/7">
                    <div>
                        <h2 className="font-serif text-2xl mb-4 font-semibold">{title}</h2>
                        <p className="mb-2">{intro}</p>
                        <p className="mb-2">{description}</p>
                        <p className="mb-2">
                            <b>Total Room Size: </b>{totalRoomSize}
                        </p>
                        <p className="p-2 bg-green-200 text-purple-800 font-semibold w-fit mt-2">
                            <b>Price Starting at {convertToINR(startingPriceOfRoom)} only </b>
                        </p>
                    </div>

                    <div className="flex mt-6">
                        <div className="pr-4">
                            <Link href={`/rooms-suites/${path}`} passHref>
                                <Button variant="outlined">EXPLORE</Button>
                            </Link>
                        </div>                   
                    </div>
                </div>

            </div>
        </React.Fragment>
    );
}


async function fetchRoomsSuitesEachDayData(title: string): Promise<RoomWithDateDetails | undefined>{
    try{
        const response: Response = await fetch(`${process.env.URL}/api/hotel-booking-information/room-and-suites-information/each-day-information/`);
        const data: RoomSuitesEachDayInfoRespone = await response.json();
        const allRoomsWithDate: RoomWithDateDetails[] = data.roomsWithDate;
        const particularRoomEachDayInfo: RoomWithDateDetails | undefined = allRoomsWithDate.find(function(eachRoomWithDate: RoomWithDateDetails){
            return eachRoomWithDate.roomTitle == title
        });
        if(!particularRoomEachDayInfo){
            throw new Error("particularRoomEachDayInfo is missing");
        }
        return particularRoomEachDayInfo;
    }
    catch(error){
        console.log(error);
    }
}


export default Rooms;