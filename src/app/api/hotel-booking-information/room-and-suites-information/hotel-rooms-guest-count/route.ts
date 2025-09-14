import { NextRequest, NextResponse } from "next/server";

import typedRoomsGuestInfo from "@/json objects/roomsGuestInfo";

import { Room } from "@/interface/Rooms and Suites Interface/roomsSuitesGuestInfoInterface";


const roomsGuestInfo: Room[] = typedRoomsGuestInfo;


function GET(){
    
    return NextResponse.json(
        {roomsGuestInfo}
    );
    
}

export { GET }; 