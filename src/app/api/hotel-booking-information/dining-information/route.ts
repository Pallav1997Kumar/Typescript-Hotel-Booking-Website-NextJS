import { NextRequest, NextResponse } from "next/server";

import typedDining from "@/json objects/dining";

import { Dining } from "@/interface/Dining Interface/hotelDiningInterface";


const dining: Dining[] = typedDining;

function GET(){
    
    return NextResponse.json(
        {dining}
    );
    
}

export { GET };