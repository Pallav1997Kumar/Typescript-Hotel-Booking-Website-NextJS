import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { USER_INFORMATION_UPDATED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";


Connection();


interface UpdateUserRequestBody {
    firstName: string;
    middleName?: string;  
    lastName: string;
    fullName: string;
    gender: string;
    dob: Date;  
    contactNo: number;
    alternateContactNo?: number;  
}

interface UpdateUserInfo {
    firstName: string;
    middleName?: string; 
    lastName: string;
    fullName: string;
    gender: string;
    dateOfBirth: Date; 
    contactNo: number;
    alternateContactNo?: number; 
}

async function PATCH(request: NextRequest, context: IContextUserId): Promise<NextResponse> {
    try{
        const params = context.params;
        const loginUserId: string = params.userId;
        const body: UpdateUserRequestBody = await request.json();

        const firstName: string = body.firstName;
        const middleName: string | undefined = body.middleName;
        const lastName: string = body.lastName;
        const fullName: string = body.fullName;
        const gender: string = body.gender;
        const dob: Date = body.dob;
        const contactNo: number = body.contactNo;
        const alternateContactNo: number | undefined = body.alternateContactNo;

        const hotelUser: IHotelCustomersUser | null  = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){
            const updatedInfo: UpdateUserInfo  = {
                firstName, 
                middleName,
                lastName,
                fullName,
                gender,
                dateOfBirth: dob,
                contactNo,
                alternateContactNo,
            }

            const updatedHotelUser: IHotelCustomersUser | null = 
                await HotelCustomersUsers.findByIdAndUpdate(loginUserId, {
                    $set: updatedInfo
                });
            return NextResponse.json(
                { message: USER_INFORMATION_UPDATED_SUCCESSFULLY },
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
        );
    }
}

export { PATCH };