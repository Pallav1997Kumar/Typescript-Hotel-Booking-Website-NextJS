import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import EventsMeetingBookingComponent from "@/components/Events Meeting Component/EventsMeetingBookingComponent";

import { IContextSlug } from '@/interface/contextInterface';
import { 
    EventMeetingRoomsInfoResponse, 
    MeetingEventArea, 
    MeetingEventAreaInfo, 
    MeetingEventAreaSeatingCapacity 
} from "@/interface/Event Meeting Interface/eventMeetingRoomInterface";


export async function generateMetadata(context: IContextSlug){
    const params = context.params
    const slug: string = params.slug;
    const currentEventMeetingAreaPath: string = slug;
    const meetingEventsInfo: MeetingEventArea | undefined = 
        await fetchCurrentMeetingEventsRoomInformation(currentEventMeetingAreaPath);
    if(!meetingEventsInfo){
        throw new Error("meetingEventsInfo is missing");
    }
    const meetingEventAreaTitle: string = meetingEventsInfo.meetingEventAreaTitle;
    return {
        title: meetingEventAreaTitle,
    }
}

function getCurrentPageMeetingEventInfo(
    allMeetingEventsRooms: MeetingEventArea[], 
    meetingEventsPath: string
): MeetingEventArea{
    const currentPageMeetingEventsInfo: MeetingEventArea | undefined = 
        allMeetingEventsRooms.find(function(eachMeetingEvents: MeetingEventArea){
            return (eachMeetingEvents.meetingEventAreaPath === meetingEventsPath);
        });
    if(!currentPageMeetingEventsInfo){
        throw new Error("currentPageMeetingEventsInfo is missing");
    }
    return currentPageMeetingEventsInfo; 
}

function getCurrentEventMeetingRoomArea(
    meetingEventsInfo: MeetingEventArea
): number{
    const onlyDimensionDetail: MeetingEventAreaInfo | undefined = 
        (meetingEventsInfo.meetingEventAreaInfo).find(function(eachInfo: MeetingEventAreaInfo){
            return (eachInfo.meetingEventAreaInfoTitle === "Dimension")
        });
    if(!onlyDimensionDetail){
        throw new Error("onlyDimensionDetail is missing");
    }

    const dimensionString: string = onlyDimensionDetail.meetingEventAreaInfoDetails;
    const eachLength: string[] = dimensionString.split("x");
    const length: string = eachLength[0].split("metre")[0].trim();
    const width: string = eachLength[1].split("metre")[0].trim();
    const area: number = Number(length) * Number(width);
    return area;
}

async function fetchCurrentMeetingEventsRoomInformation(
    meetingEventsPath: string
): Promise<MeetingEventArea | undefined>{
    try {
        const response: Response = await fetch(
            `${process.env.URL}/api/hotel-booking-information/events-meeting-room-information/`
        );
        const meetingEventRoomInfo: EventMeetingRoomsInfoResponse = await response.json();
        const meetingEventsRooms: MeetingEventArea[] = meetingEventRoomInfo.meetingEventsRooms;
        const currentPageMeetingEvents: MeetingEventArea = 
            getCurrentPageMeetingEventInfo(meetingEventsRooms, meetingEventsPath);
        return currentPageMeetingEvents;
    } catch (error) {
        console.log(error);
    }
}


async function Page(context: IContextSlug){
    const slug: string = context.params.slug;
    const currentEventMeetingAreaPath: string = slug;
    const meetingEventsInfo: MeetingEventArea | undefined = 
        await fetchCurrentMeetingEventsRoomInformation(currentEventMeetingAreaPath);
    if(!meetingEventsInfo){
        throw new Error("meetingEventsInfo is missing");
    }

    const meetingEventRoomArea: number = getCurrentEventMeetingRoomArea(meetingEventsInfo);

    return(
        <div className="m-8">

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
                    <span className="px-3">{'>>'}</span> 
                    <Link href={`/meetings-events/${currentEventMeetingAreaPath}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            {meetingEventsInfo.meetingEventAreaTitle} 
                        </span>
                    </Link>
                </p>
            </div>

            {/* Title */}
            <h2 className="mb-8 text-3xl font-semibold">
                {meetingEventsInfo.meetingEventAreaTitle}
            </h2>

            {/* Top Section */}
            <div className="flex flex-row gap-6">
                <div className="w-[45%]">
                    <Image 
                        src={meetingEventsInfo.meetingEventAreaImage} 
                        alt="meeting-event" 
                        width={500} 
                        height={300} 
                    />
                </div>
                <div className="w-[55%]">
                    <p className="py-2 text-lg italic font-serif">
                        {meetingEventsInfo.meetingEventAreaShortDescription}
                    </p>
                    <p className="py-2 text-xl font-serif">
                        {meetingEventsInfo.meetingEventAreaDescription}
                    </p>
                    
                    {/* Area Info */}
                    <div className="my-8">
                        <h3 className="text-xl font-semibold mb-4">
                            Meeting Event Room Area Information
                        </h3>

                        <div className="flex flex-row w-4/5 border border-gray-300 mb-2">
                            <div className="w-2/5 border-r border-gray-300 p-2 font-medium">
                                Area
                            </div>
                            <div className="w-3/5 p-2">
                                {meetingEventRoomArea} square metre
                            </div>
                        </div>
                        
                        {(meetingEventsInfo.meetingEventAreaInfo).map(function(
                            eachInfo: MeetingEventAreaInfo
                        ){
                            return (
                                <div 
                                    key={eachInfo.meetingEventAreaInfoTitle} 
                                    className="flex flex-row w-4/5 border border-gray-300 mb-2"
                                >
                                    <div className="w-2/5 border-r border-gray-300 p-2 font-medium">
                                        {eachInfo.meetingEventAreaInfoTitle}
                                    </div>
                                    <div className="w-3/5 p-2">
                                        {eachInfo.meetingEventAreaInfoDetails}
                                    </div>
                                </div>
                            );
                        })}
                        
                    </div>

                </div>
            </div>

            {/* Middle Section */}
            <div className="flex flex-row gap-6 my-8">
                {/* Seating Capacity */}
                <div className="w-3/5">
                    <h3 className="text-xl font-semibold mb-4">
                        Meeting Event Room Area Seating Capacity
                    </h3>
                    {(meetingEventsInfo.meetingEventAreaSeatingCapacityInfo).map(function(
                        eachSeatingArrangement: MeetingEventAreaSeatingCapacity
                    ){
                        return (
                            <div 
                                key={eachSeatingArrangement.meetingEventAreaSeatingTitle} 
                                className="flex flex-row w-3/4 border border-gray-300 mb-2"
                            >
                                <div className="w-1/2 border-r border-gray-300 p-2 font-medium">
                                    {eachSeatingArrangement.meetingEventAreaSeatingTitle}
                                </div>
                                <div className="w-1/2 p-2">
                                    {eachSeatingArrangement.meetingEventAreaSeatingCapacity} persons
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Other Conveniences */}
                <div className="w-2/5">
                    <p className="font-semibold mb-2">OTHER CONVENIENCES</p>
                    {(meetingEventsInfo.meetingEventAreaOtherConveniences).map(function(
                        eachConveniences: string
                    ){
                        return (
                            <li key={eachConveniences}>{eachConveniences}</li>
                        );
                    })}
                </div>
            </div>

            {/* Booking Component */}
            <div>
                <EventsMeetingBookingComponent 
                    meetingEventsInfoTitle={meetingEventsInfo.meetingEventAreaTitle} 
                    meetingEventsSeatingInfo={meetingEventsInfo.meetingEventAreaSeatingCapacityInfo} 
                    meetingEventAreaPath ={meetingEventsInfo.meetingEventAreaPath} 
                />
            </div>

        </div>
    );
}


export default Page;