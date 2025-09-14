import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import EventsMeetingsEachRoom from "@/components/Events Meeting Component/EventsMeetingsEachRoom";

import { 
    EventMeetingRoomsInfoResponse, 
    MeetingEventArea 
} from "@/interface/Event Meeting Interface/eventMeetingRoomInterface";


export async function generateMetadata(){
    return {
        title: 'Events And Meeting'
    }
}


export default async function page(){

    const meetingEventRoomInfo: EventMeetingRoomsInfoResponse = 
        await fetchMeetingEventsRoomInformation();
    const meetingEventsRooms: MeetingEventArea[] = meetingEventRoomInfo.meetingEventsRooms;

    return (
        <React.Fragment>
            <div className="my-1">
                <Image src={'/events-meeting/event meeting.jpg'} alt="meeting image" width={1400} height={500} />
            </div>

            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline">
                            HOME 
                        </span>
                    </Link> 
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/meetings-events"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            EVENTS AND MEETINGS 
                        </span>
                    </Link>
                </p>
            </div>

            <div className="my-8 px-12 text-center">
                <h2 className="text-3xl font-semibold">
                    EVENTS AND MEETINGS
                </h2>
                <p className="text-xl my-2 leading-relaxed text-gray-600 font-sans">
                    From private meetings to grand corporate events, wedding anniversaries, engagements and birthday parties. When in Kolkata, it has to be The Oberoi Grand.
                </p>
                <p className="text-xl my-2 leading-relaxed text-gray-600 font-sans">
                    At The Oberoi Grand, Kolkata, we can help you realise a perfect celebration. From birthdays to anniversaries and engagements, we have a venue to suit and the sincere hospitality to make your event simply unforgettable.
                </p>
                <p className="text-xl my-2 leading-relaxed text-gray-600 font-sans">
                    The venue for Prime Ministerial and State conferences since the dawn of Independence, our corporate events are always impeccably executed; from planning and preparation to flawless delivery, with warm, intuitive service that brings an event to life.
                </p>
                <p className="text-xl my-2 leading-relaxed text-gray-600 font-sans">
                    For meetings of up to twenty people, you can take your pick of our three board rooms. We also offer global translation services, upon request.
                </p>
            </div>

            <div>
                {meetingEventsRooms.map(function(eachEventsMeetings: MeetingEventArea){
                    return (
                        <EventsMeetingsEachRoom 
                            key={eachEventsMeetings.meetingEventAreaTitle} 
                            currentMeetingEvent={eachEventsMeetings} 
                        />
                    );
                })}
            </div>

        </React.Fragment>
    );
}

async function fetchMeetingEventsRoomInformation(): Promise<EventMeetingRoomsInfoResponse>{
    try {
        const response: Response = await fetch(
            `${process.env.URL}/api/hotel-booking-information/events-meeting-room-information/`
        );
        const meetingEventRoomInfo: EventMeetingRoomsInfoResponse = await response.json();
        return meetingEventRoomInfo;
    } catch (error) {
        console.log(error);
        return {
            meetingEventsRooms: []
        };
    }
}