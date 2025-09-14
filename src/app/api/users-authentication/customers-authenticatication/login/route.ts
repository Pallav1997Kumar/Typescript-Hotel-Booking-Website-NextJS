import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookies } from 'next/headers';

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";


import { 
    INTERNAL_SERVER_ERROR, 
    LOGIN_ERROR_MESSAGE 
} from "@/constant string files/apiErrorMessageConstants";

import { SUCCESSFUL_LOGIN } from "@/constant string files/apiSuccessMessageConstants";


import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";


Connection();

const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

interface LoginRequestBody {
    email: string;
    password: string;
}


async function POST(request: NextRequest): Promise<NextResponse> {
    try{
        const body: LoginRequestBody = await request.json();
        const email: string = body.email;
        const password: string = body.password;

        const hotelUser: IHotelCustomersUser | null = 
            await HotelCustomersUsers.findOne( { emailAddress: email } );

        if(hotelUser){
            const hotelUserPasswordMatch: IHotelCustomersUser | null = 
                await HotelCustomersUsers.findOne({ 
                    $and: [{ emailAddress: email }, { password: password }] 
                });

            if(hotelUserPasswordMatch){

                const isHashedPasswordMatch: boolean = await bcrypt.compare(password, hotelUser.hashedPassword);

                if(isHashedPasswordMatch){

                    const tokenData = {
                        id: hotelUserPasswordMatch._id,
                        emailAddress: hotelUserPasswordMatch.emailAddress,
                    }

                    const loginUserDetails = {
                        userId: hotelUserPasswordMatch._id,
                        emailAddress: hotelUserPasswordMatch.emailAddress,
                        fullName: hotelUserPasswordMatch.fullName
                    }

                    const token: string = jwt.sign(tokenData, jwtSecretKey, { expiresIn: '1d' });

                    (await cookies()).set({
                        name: 'jwt-token',
                        value: token,
                        httpOnly: true,
                        path: '/',
                        maxAge: 60 * 60 * 24, // 1 day
                        secure: process.env.NODE_ENV === 'production',
                    });

                    return NextResponse.json(
                        { 
                            message: SUCCESSFUL_LOGIN, 
                            loginUserDetails: loginUserDetails 
                        },
                        { status: 200 }
                    );

                }
                else{
                    return NextResponse.json(
                        { errorMessage: LOGIN_ERROR_MESSAGE.INCORRECT_PASSWORD },
                        { status: 404 }
                    );
                }             
            }
            else{
                return NextResponse.json(
                    { errorMessage: LOGIN_ERROR_MESSAGE.INCORRECT_PASSWORD },
                    { status: 404 }
                ); 
            }
        }
        else{
            return NextResponse.json(
                { errorMessage: LOGIN_ERROR_MESSAGE.EMAIL_ADDRESS_DOES_NOT_EXIST },
                { status: 404 }
            );
        }
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            { error: INTERNAL_SERVER_ERROR }, 
            { status: 500 })
        ;
    }
}

export { POST };