import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Rooms from "@/components/Rooms Component/Rooms";

import { 
    Room, 
    RoomSuitesInfoResponse 
} from '@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface';


export function generateMetadata(){
    return {
        title: 'Rooms And Suites'
    }
}


export default async function Page(){

    const roomSuitesInfo: RoomSuitesInfoResponse = 
        await fetchRoomsSuitesInformation();
    const roomsSuites: Room[] = roomSuitesInfo.rooms;
    
    return (
        <React.Fragment>
            <div className="my-1">
                <Image 
                    src={'/Room Photo/Room-Generic.jpg'} 
                    alt="room image" 
                    width={1400} 
                    height={500} 
                />
            </div>

            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline">
                             HOME 
                        </span>
                    </Link> 
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/rooms-suites"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            ROOMS AND SUITES 
                        </span>
                    </Link>
                </p>
            </div>

            <div className="my-8 px-12 text-center">
                <h2 className="text-3xl font-semibold">
                    ROOMS AND SUITES
                </h2>
                <p className="text-xl my-2 leading-relaxed text-gray-600 font-sans">
                    For your safety and comfort we have put in place strict measures adhering to both governmental requirements and sanitary guidelines.
                </p>
                <p className="text-xl my-2 leading-relaxed text-gray-600 font-sans">
                    Our rooms and suites have been thoughtfully designed for business and leisure travellers to Kolkata; with classic furnishings, heritage style design features, modern technologies and 24 hour services.
                </p>
            </div>

            <div>
                {roomsSuites.map(function(roomSuite: Room){
                    return (
                        <Rooms 
                            key={roomSuite.title}
                            title={roomSuite.title} 
                            intro={roomSuite.intro} 
                            path={roomSuite.path}
                            description={roomSuite.description} 
                            totalRoomSize={roomSuite.totalRoomSize} 
                            coverPhoto={roomSuite.photos[0]} 
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
}


async function fetchRoomsSuitesInformation(): Promise<RoomSuitesInfoResponse>{
    try {
        const response: Response = await fetch(
            `${process.env.URL}/api/hotel-booking-information/room-and-suites-information/`
        );
        const roomSuitesInfo: RoomSuitesInfoResponse = await response.json();
        return roomSuitesInfo;
    } catch (error) {
        console.log(error);
        return {
            rooms: []
        };
    }
}