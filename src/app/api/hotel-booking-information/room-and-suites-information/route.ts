import { NextRequest, NextResponse } from "next/server";

import typedRoom from "@/json objects/rooms";
import { Room } from "@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface";


const rooms: Room[] = typedRoom;


function GET(){

    return NextResponse.json(
        {rooms}
    );
    
}

export { GET };