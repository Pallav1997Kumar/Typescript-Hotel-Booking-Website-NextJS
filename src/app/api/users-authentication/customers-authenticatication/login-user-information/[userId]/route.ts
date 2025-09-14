import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";


Connection();


async function GET(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        // { params: { userId: '6648bdb50b15bc1c6d960c8a' } }
        const loginUserId: string = params.userId;

        const hotelUser: IHotelCustomersUser | null = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const loginUserDetails = {
                userId: hotelUser._id, 
                firstName: hotelUser.firstName,
                middleName: hotelUser.middleName,
                lastName: hotelUser.lastName,
                fullName: hotelUser.fullName,
                gender: hotelUser.gender,
                dateOfBirth: hotelUser.dateOfBirth,
                emailAddress: hotelUser.emailAddress, 
                contactNo: hotelUser.contactNo,
                alternateContactNo: hotelUser.alternateContactNo,
                accountBalance: hotelUser.accountBalance
            }
            return NextResponse.json(
                { loginUserDetails },
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
        
    }
    catch(error){
        return NextResponse.json(
            { error: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        )
    }
}

export { GET };