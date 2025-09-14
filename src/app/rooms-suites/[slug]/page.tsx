import React from 'react';
import Link from 'next/link';

import RoomBasicContainer from "@/components/Single Room Component/RoomBasicContainer";
import RoomAmenitiesContainer from "@/components/Single Room Component/RoomAmenitiesContainer";
import RoomImageGallery from "@/components/Single Room Component/RoomImageGallery";
import ContactUsContainer from "@/components/Single Room Component/ContactUsContainer";
import BookingRoomContainer from "@/components/Single Room Component/BookingRoomContainer";

import { IContextSlug } from '@/interface/contextInterface';
import { 
    Room, 
    RoomSuitesInfoResponse 
} from '@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface';


export async function generateMetadata(context: IContextSlug) {
    const params = context.params
    const slug: string = params.slug;
    const currentRoomPath: string = slug;
    const roomSuitesInfo: Room | undefined = await fetchCurrentRoomData(currentRoomPath);
    if(!roomSuitesInfo){
        throw new Error("Missing roomSuitesInfo");
    }
    const roomTitle = roomSuitesInfo.title;
    return {
        title: roomTitle,
    };
}

export async function fetchCurrentRoomData(
    currentRoomPath: string
): Promise<Room | undefined> {
    try {
        // Fetching all rooms and suites information
        const response: Response = await fetch(
            `${process.env.URL}/api/hotel-booking-information/room-and-suites-information/`
        );
        const roomSuitesInfo: RoomSuitesInfoResponse = await response.json();
        const allRoomsInfo: Room[] = roomSuitesInfo.rooms;

        // Find the current room suites information based on the path
        const currentRoomSuitesInfo: Room | undefined = allRoomsInfo.find(function(eachRoom: Room){
            return (eachRoom.path === currentRoomPath);
        });

        return currentRoomSuitesInfo;
    } catch (error) {
        console.error('Error fetching room and suite information:', error);
    }
}

// Main component to render the room information
async function Page(context: IContextSlug) {
    const slug: string = context.params.slug;
    const currentRoomPath: string = slug; 
    const roomSuitesInfo: Room | undefined = await fetchCurrentRoomData(currentRoomPath);

    if(!roomSuitesInfo){
        throw new Error("Missing roomSuitesInfo");
    }

    return (
        <div className="mx-[5%] my-[3%]">

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
                    <span className="px-3">{'>>'}</span>
                    <Link href={`/rooms-suites/${currentRoomPath}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            {roomSuitesInfo.title} 
                        </span>
                    </Link> 
                </p>
            </div>

            <h2 className="text-center uppercase text-3xl font-sans tracking-[2px] word-spacing-[6px] mb-[2%]">
                {roomSuitesInfo.title}
            </h2>
            <p className="italic">{roomSuitesInfo.intro}</p>
            <RoomBasicContainer roomInfo={roomSuitesInfo} />
            <RoomAmenitiesContainer roomInfo={roomSuitesInfo} />
            <RoomImageGallery roomInfo={roomSuitesInfo} />
            <ContactUsContainer />
            <BookingRoomContainer roomInfo={roomSuitesInfo} />
        </div>
    );
}

export default Page;