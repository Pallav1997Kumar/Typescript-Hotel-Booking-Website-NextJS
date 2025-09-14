import React from "react";
import Image from 'next/image';
import Link from 'next/link';

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary"; 

import { EventMeetingRoomsInfoResponse, MeetingEventArea } from "@/interface/Event Meeting Interface/eventMeetingRoomInterface";


function EventsMeetingComponent() {
    return (
        <ErrorBoundary>
            <EventsMeetingComponentFunctionalComponent />
        </ErrorBoundary>
    );
}


async function EventsMeetingComponentFunctionalComponent(){

    const meetingEventsRooms: MeetingEventArea[] = await fetchMeetingEventsRoomInformation();
    const threeEventsRooms: MeetingEventArea[] = meetingEventsRooms.slice(0,3)

    return (
        <div className="p-8 bg-pink-100 bg-opacity-60">
            <h2 className="text-center text-2xl font-serif mb-6">Events and Meeting Rooms</h2>
            <div className="bg-gray-300 border-3 border-gray-600 p-4">
                <Link href={`/meetings-events/`} passHref>
                    <p className="text-right text-red-600 underline mb-3 text-lg font-semibold transition-all duration-1000 hover:text-darkred hover:text-xl">
                        SEE ALL THE EVENTS ROOMS OPTIONS
                    </p>
                </Link>
                <div className="flex flex-wrap w-full">
                    {threeEventsRooms.map(function(eachEventRoom: MeetingEventArea){
                        return(
                            <div key={eachEventRoom.meetingEventAreaPath} className="w-full sm:w-1/3 px-2 py-2">
                                <Image src={eachEventRoom.meetingEventAreaImage} alt="room-photo" width={375} height={300} />
                                <Link href={`/meetings-events/${eachEventRoom.meetingEventAreaPath}`} passHref>
                                    <h4 className="text-center text-xl font-italic mt-3 cursor-pointer hover:underline">
                                        {eachEventRoom.meetingEventAreaTitle}
                                    </h4>
                                </Link>
                                <p className="text-center mt-2">{eachEventRoom.meetingEventAreaShortDescription}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}


async function fetchMeetingEventsRoomInformation(): Promise<MeetingEventArea[]>{
    try {
        const response: Response = await fetch(`${process.env.URL}/api/hotel-booking-information/events-meeting-room-information/`);
        const meetingEventRoomInfo: EventMeetingRoomsInfoResponse = await response.json();
        const meetingEventsRooms: MeetingEventArea[] = meetingEventRoomInfo.meetingEventsRooms;
        return meetingEventsRooms;
    } catch (error) {
        console.log(error);
        return[];
    }
}


export default EventsMeetingComponent;