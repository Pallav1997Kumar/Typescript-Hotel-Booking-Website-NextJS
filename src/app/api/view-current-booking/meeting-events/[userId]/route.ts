import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Connection from "@/database config/config";

import HotelCustomersUsers from "@/database models/hotelCustomersUsers";
import SingleDateBookingInfo from "@/database models/booking models/events meetings models/singleDateBookingInfo";
import NonContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesBookingInfo";
import ContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/continousMultipleDatesBookingInfo";


import { 
    INTERNAL_SERVER_ERROR, 
    USER_NOT_FOUND 
} from "@/constant string files/apiErrorMessageConstants";

import { 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";


import { IContextUserId } from "@/interface/contextInterface";
import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";
import { IOptions } from "@/interface/timeZoneInterface";

import { 
    ISingleDateBookingInfo, 
    IContinousMultipleDatesBookingInfo, 
    INonContinousMultipleDatesBookingInfo 
} from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";


Connection();


interface ISingleDateBookingUser {
    bookingInfo: ISingleDateBookingInfo;
    transactionDetails: {
      _id: mongoose.Types.ObjectId;
      transactionAmount: number;
      transactionType: string;
      transactionDescription: string;
      transactionDateTime: Date;
    };
}

interface INonContinousMultipleDatesBookingUser {
    bookingInfo: INonContinousMultipleDatesBookingInfo;
    transactionDetails: {
      _id: mongoose.Types.ObjectId;
      transactionAmount: number;
      transactionType: string;
      transactionDescription: string;
      transactionDateTime: Date;
    };
}

interface IContinousMultipleDatesBookingUser {
    bookingInfo: IContinousMultipleDatesBookingInfo;
    transactionDetails: {
      _id: mongoose.Types.ObjectId;
      transactionAmount: number;
      transactionType: string;
      transactionDescription: string;
      transactionDateTime: Date;
    };
}

async function GET(request: NextRequest, context: IContextUserId){
    try {
        const params = context.params;
        const loginUserIdString: string = params.userId;
        const loginUserId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(loginUserIdString); 

        const currentDate: Date = new Date();
        const options: IOptions = { timeZone: 'Asia/Kolkata' };
        const currentIstDate: Date = new Date(currentDate.toLocaleString('en-US', options));

        const hotelUser: IHotelCustomersUser | null = await HotelCustomersUsers.findById(loginUserId);

        if(hotelUser){

            const eventMeetingSingleDateUserBookingInfo: ISingleDateBookingUser[] = await SingleDateBookingInfo.aggregate([
                {
                    $match: {
                        customerId: loginUserId,
                        meetingEventBookingDate: { $gte: currentIstDate }
                    }
                },
                {
                    $lookup: {
                        from: 'hotelcustomerstransactions', 
                        localField: 'transactionId',
                        foreignField: '_id',
                        as: 'transactionDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$transactionDetails',
                        preserveNullAndEmptyArrays: true 
                    }
                },
                {
                    $project: {
                        bookingInfo: "$$ROOT",
                    }
                }
            ]);

            const eventMeetingMultipleContinousDatesUserBookingInfo: IContinousMultipleDatesBookingUser[] = await ContinousMultipleDatesBookingInfo.aggregate([
                {
                    $match: {
                        customerId: loginUserId,
                        meetingEventEndBookingDate: { $gte: currentIstDate }
                    }
                },
                {
                    $lookup: {
                        from: 'hotelcustomerstransactions', 
                        localField: 'transactionId',
                        foreignField: '_id',
                        as: 'transactionDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$transactionDetails',
                        preserveNullAndEmptyArrays: true 
                    }
                },
                {
                    $project: {
                        bookingInfo: "$$ROOT",
                    }
                }
            ]);

            const eventMeetingMultipleNonContinousDatesUserBookingInfo: INonContinousMultipleDatesBookingUser[] = await NonContinousMultipleDatesBookingInfo.aggregate([
                {
                    $match: {
                        customerId: loginUserId,
                        'allDatesBookingInformation.meetingEventBookingDate': { $gte: currentIstDate }
                    }
                },
                {
                    $lookup: {
                        from: 'hotelcustomerstransactions', 
                        localField: 'transactionId',
                        foreignField: '_id',
                        as: 'transactionDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$transactionDetails',
                        preserveNullAndEmptyArrays: true 
                    }
                },
                {
                    $project: {
                        bookingInfo: "$$ROOT",
                    }
                }
            ]);

            if(eventMeetingSingleDateUserBookingInfo.length == 0 
                && eventMeetingMultipleContinousDatesUserBookingInfo.length == 0
                && eventMeetingMultipleNonContinousDatesUserBookingInfo.length == 0){
                    return NextResponse.json(
                        { message: EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY },
                        { status: 200 }
                    );
            }

            if(eventMeetingMultipleNonContinousDatesUserBookingInfo.length == 0){
                if(eventMeetingSingleDateUserBookingInfo.length > 0 
                    || eventMeetingMultipleContinousDatesUserBookingInfo.length > 0) {
                        const eventMeetingBookingInfo = [
                            ...eventMeetingSingleDateUserBookingInfo,
                            ...eventMeetingMultipleContinousDatesUserBookingInfo
                        ]

                        return NextResponse.json(
                            { 
                                message: EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, 
                                eventMeetingBookingInfo 
                            },
                            { status: 200 }
                        );
                    }
                
            }
            else if(eventMeetingMultipleNonContinousDatesUserBookingInfo.length > 0){
                if(eventMeetingSingleDateUserBookingInfo.length > 0 
                    || eventMeetingMultipleContinousDatesUserBookingInfo.length > 0) {
                        const eventMeetingBookingInfo = [
                            ...eventMeetingSingleDateUserBookingInfo,
                            ...eventMeetingMultipleContinousDatesUserBookingInfo,
                            ...eventMeetingMultipleNonContinousDatesUserBookingInfo
                        ]

                        return NextResponse.json(
                            { 
                                message: EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, 
                                eventMeetingBookingInfo 
                            },
                            { status: 200 }
                        );
                    }
            }

        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET };