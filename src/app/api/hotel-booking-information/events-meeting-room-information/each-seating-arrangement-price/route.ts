import { NextRequest, NextResponse } from "next/server";

import typedEventMeetingPriceForSeatingArrangement from "@/json objects/booking rates/seatingArrangementPrice";

import { EventMeetingPriceForSeatingArrangement } from "@/interface/Event Meeting Interface/eventMeetingRoomInterface";


const eventMeetingPriceForSeatingArrangement: EventMeetingPriceForSeatingArrangement[] = 
    typedEventMeetingPriceForSeatingArrangement;

function GET(){   
    return NextResponse.json(
        {eventMeetingPriceForSeatingArrangement}
    );
}


export { GET };