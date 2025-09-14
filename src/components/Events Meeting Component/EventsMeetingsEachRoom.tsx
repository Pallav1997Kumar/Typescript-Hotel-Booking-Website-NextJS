import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import Button from '@mui/material/Button';

import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary';

import { MeetingEventArea, MeetingEventAreaSeatingCapacity } from "@/interface/Event Meeting Interface/eventMeetingRoomInterface";


// Define types for Event Meeting Room data
interface IEventMeetingRoomProps{
    currentMeetingEvent: MeetingEventArea;
}


function EventsMeetingsEachRoom(props: IEventMeetingRoomProps) {
    return (
        <ErrorBoundary>
            <EventsMeetingsEachRoomFunctionalComponent currentMeetingEvent={props.currentMeetingEvent} />
        </ErrorBoundary>
    );
}


function EventsMeetingsEachRoomFunctionalComponent(props: IEventMeetingRoomProps) {
    const currentMeetingEvent: MeetingEventArea = props.currentMeetingEvent;
    const meetingEventAreaPath: string = currentMeetingEvent.meetingEventAreaPath;

    const unsortedMeetingEventAreaSeatingCapacityInfo: MeetingEventAreaSeatingCapacity[] = currentMeetingEvent.meetingEventAreaSeatingCapacityInfo;
    const onlyMeetingEventsSeatingInfoWhereSeatingPresent: MeetingEventAreaSeatingCapacity[] = unsortedMeetingEventAreaSeatingCapacityInfo.filter(function(eachSeatingArrangement: MeetingEventAreaSeatingCapacity){
        return (eachSeatingArrangement.meetingEventAreaSeatingCapacity != 'N/A');
    });
    const sortedMeetingEventAreaSeatingCapacityInfo: MeetingEventAreaSeatingCapacity[] = onlyMeetingEventsSeatingInfoWhereSeatingPresent.toSorted((a,b) => Number(b.meetingEventAreaSeatingCapacity) - Number(a.meetingEventAreaSeatingCapacity));
    const maximumSeatingCapacity: string | number = sortedMeetingEventAreaSeatingCapacityInfo[0].meetingEventAreaSeatingCapacity;

    return (
        <div className="flex flex-row m-[5%_3%] border border-blue-500 p-[1%] bg-[rgb(250,239,226)]">
            <div className="w-2/5">
                <Image src={currentMeetingEvent.meetingEventAreaImage} alt="current-event-meeting" width={500} height={300} />
            </div>

            <div className="w-3/5 px-[4%] py-[2%]">
                <h3 className="mb-[2.5%] text-left font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] text-[1.5rem] tracking-[1.5px] word-spacing-[3px]">
                    {currentMeetingEvent.meetingEventAreaTitle}
                </h3>
                <p className="font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] italic text-[rgb(44,40,40)]"> 
                    Maximum Seating Capacity: {maximumSeatingCapacity} 
                </p>
                <p className="italic font-[Verdana,Geneva,Tahoma,sans-serif] font-semibold text-brown-700 tracking-[0.5px] text-[1rem] my-[2%]">
                    {currentMeetingEvent.meetingEventAreaShortDescription}
                </p>
                <p className="font-[Gill_Sans,Calibri,Trebuchet_MS,sans-serif] tracking-[0.8px] word-spacing-[1.25px] text-[1.25rem]">
                    {currentMeetingEvent.meetingEventAreaDescription}
                </p>
                <div className="mt-[5%] flex items-center justify-center">
                    <Link href={`/meetings-events/${meetingEventAreaPath}`}> 
                        <Button variant="contained">EXPLORE EVENT AND MEETING AREA</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
    
}

export default EventsMeetingsEachRoom;