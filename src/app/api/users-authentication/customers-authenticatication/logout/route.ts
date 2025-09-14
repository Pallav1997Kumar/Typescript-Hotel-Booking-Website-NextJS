import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers";

import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants";
import { LOGOUT_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";


const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

async function POST(request: NextRequest): Promise<NextResponse> {
    try{
        const cookieStore = await cookies();
        cookieStore.delete('jwt-token');
        
        return NextResponse.json(
            { message: LOGOUT_SUCCESSFULLY },
            { status: 200 }
        );
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            { error: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST };