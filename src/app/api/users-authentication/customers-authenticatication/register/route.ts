import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";


import { 
    INTERNAL_SERVER_ERROR, 
    REGISTRATION_ERROR_MESSAGE 
} from "@/constant string files/apiErrorMessageConstants";

import { USER_REGISTERED_SUCCESSFULLY } from "@/constant string files/apiSuccessMessageConstants";


import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";


Connection();

const SALT_ROUNDS = 10;


interface RegisterBody {
    firstName: string;
    middleName?: string;  
    lastName: string;
    fullName: string;
    gender: string;
    dob: Date;  
    email: string;
    contactNo: number;  
    alternateContactNo?: number;  
    password: string;  
}


async function POST(request: NextRequest): Promise<NextResponse> {
    try{
        const body: RegisterBody = await request.json();

        const firstName: string = body.firstName;
        const middleName: string | undefined = body.middleName;
        const lastName: string = body.lastName;
        const fullName: string = body.fullName;
        const gender: string = body.gender;
        const dob: Date = body.dob;
        const email: string = body.email;
        const contactNo: number = body.contactNo;
        const alternateContactNo: number | undefined = body.alternateContactNo;
        const password: string = body.password;

        if(email.toString().endsWith("@royalpalace.co.in")){
            return NextResponse.json(
                { errorMessage: REGISTRATION_ERROR_MESSAGE.INVALID_DOMAIN_EMAIL_ADDRESS },
                { status: 404 }
            );
        }

        const hotelUser: IHotelCustomersUser | null = await HotelCustomersUsers.findOne( { emailAddress: email } );

        if(hotelUser){
            return NextResponse.json(
                { errorMessage: REGISTRATION_ERROR_MESSAGE.EMAIL_ADDRESS_ALREADY_EXIST },
                { status: 404 }
            );
        }

        else {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const accountBalance = 0;
            const newHotelCustomerUser: IHotelCustomersUser = new HotelCustomersUsers({
                firstName,
                middleName,
                lastName,
                fullName,
                gender,
                dateOfBirth: dob,
                emailAddress: email,
                contactNo,
                alternateContactNo,
                password,
                hashedPassword,
                accountBalance
            });

            await newHotelCustomerUser.save();
            return NextResponse.json(
                { message: USER_REGISTERED_SUCCESSFULLY },
                { status: 200 }
            );

        }
    }
    catch(error){
        console.log(error)
        return NextResponse.json(
            { error: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST };