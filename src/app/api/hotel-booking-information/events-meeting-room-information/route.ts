import { NextRequest, NextResponse } from "next/server";

import typedMeetingEventsRooms from "@/json objects/meetingEventsRooms";

import { MeetingEventArea } from "@/interface/Event Meeting Interface/eventMeetingRoomInterface";


const meetingEventsRooms: MeetingEventArea[] = typedMeetingEventsRooms;

function GET(){
    
    return NextResponse.json(
        {meetingEventsRooms}
    );
    
}

export { GET };