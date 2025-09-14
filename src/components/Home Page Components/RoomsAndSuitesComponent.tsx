import React from "react";
import Image from 'next/image';
import Link from 'next/link';

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { Room, RoomSuitesInfoResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface";


function RoomsAndSuitesComponent(){
    return (
        <ErrorBoundary>
            <RoomsAndSuitesComponentFunctionalComponent />
        </ErrorBoundary>
    );
}


async function RoomsAndSuitesComponentFunctionalComponent(){

    const roomsSuites: Room[] = await fetchRoomsSuitesInformation();
    const threeRooms: Room[] = roomsSuites.slice(0,3);

    return (
        <div className="p-8 bg-yellow-200 bg-opacity-50">
            <h2 className="text-center text-2xl font-serif mb-6">Rooms and Suites</h2>
            <div className="bg-gray-300 border-3 border-gray-600 p-4">
                <Link href={`/rooms-suites/`} passHref>
                    <p className="text-right text-red-600 underline mb-3 text-lg font-semibold transition-all duration-1000 hover:text-darkred hover:text-xl">
                        SEE ALL THE ROOMS OPTIONS
                    </p>
                </Link>
                <div className="flex flex-wrap w-full">
                    {threeRooms.map(function(eachRoom: Room){
                        return(
                            <div key={eachRoom.path} className="w-full sm:w-1/3 px-2 py-2">
                                <Image src={eachRoom.photos[0]} alt="room-photo" width={375} height={300} className="object-cover" />
                                <Link href={`/rooms-suites/${eachRoom.path}`} passHref>
                                    <h4 className="text-center text-xl font-italic mt-3 cursor-pointer hover:underline">
                                        {eachRoom.title}
                                    </h4>
                                </Link>
                                <p className="text-center mt-2">{eachRoom.intro}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}


async function fetchRoomsSuitesInformation(): Promise<Room[]>{
    try {
        const response: Response = await fetch(`${process.env.URL}/api/hotel-booking-information/room-and-suites-information/`);
        const roomSuitesInfo: RoomSuitesInfoResponse = await response.json();
        const roomsSuites: Room[] = roomSuitesInfo.rooms;
        return roomsSuites;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export default RoomsAndSuitesComponent;