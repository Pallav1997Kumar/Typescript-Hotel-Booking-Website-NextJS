import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import SingleDateBookingInfo from "@/database models/booking models/events meetings models/singleDateBookingInfo";
import NonContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesBookingInfo";
import ContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/continousMultipleDatesBookingInfo";


import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants";

import { 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";


import { IOptions } from "@/interface/timeZoneInterface";


Connection();


async function GET(request: NextRequest){
    try {

        const currentDate: Date = new Date();
        const options: IOptions = { timeZone: 'Asia/Kolkata' };
        const currentIstDate: Date = new Date(currentDate.toLocaleString('en-US', options));

        // === 1. Fetch and prepare all bookings from 3 collections ===

        // Single Date
        const eventMeetingSingleDateBookingInfo = await SingleDateBookingInfo.aggregate([
            {
                $match: {
                    meetingEventBookingDate: { $lt: currentIstDate }
                }
            },
            {
                $addFields: {
                    sortDate: "$meetingEventBookingDate"
                }
            },
            {
                $lookup: {
                    from: "hotelcustomerstransactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "transactionDetails"
                }
            },
            {
                $unwind: {
                    path: "$transactionDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "hotelcustomersusers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    bookingInfo: "$$ROOT",
                    sortDate: 1
                }
            }
        ]);

        // Continous Dates
        const eventMeetingMultipleContinousDatesBookingInfo = await ContinousMultipleDatesBookingInfo.aggregate([
            {
                $match: {
                    meetingEventEndBookingDate: { $lt: currentIstDate }
                }
            },
            {
                $addFields: {
                    sortDate: "$meetingEventEndBookingDate"
                }
            },
            {
                $lookup: {
                    from: "hotelcustomerstransactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "transactionDetails"
                }
            },
            {
                $unwind: {
                    path: "$transactionDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "hotelcustomersusers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    bookingInfo: "$$ROOT",
                    sortDate: 1
                }
            }
        ]);

        // Non-Continous Dates
        const eventMeetingMultipleNonContinousDatesBookingInfo = await NonContinousMultipleDatesBookingInfo.aggregate([
            {
                $match: {
                    "allDatesBookingInformation.meetingEventBookingDate": { $lt: currentIstDate }
                }
            },
            {
                $addFields: {
                    sortDate: { $min: "$allDatesBookingInformation.meetingEventBookingDate" }
                }
            },
            {
                $lookup: {
                    from: "hotelcustomerstransactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "transactionDetails"
                }
            },
            {
                $unwind: {
                    path: "$transactionDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "hotelcustomersusers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    bookingInfo: "$$ROOT",
                    sortDate: 1
                }
            }
        ]);


        // === 2. Combine all bookings ===
        const combinedEventMeetingBookingsInfo = [
            ...eventMeetingSingleDateBookingInfo,
            ...eventMeetingMultipleContinousDatesBookingInfo,
            ...eventMeetingMultipleNonContinousDatesBookingInfo
        ];

        // === 3. Sort by sortDate (ascending)
        combinedEventMeetingBookingsInfo.sort(function(a, b){
            return new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime();
        });

        const totalEventMeetingBookingCount: number = combinedEventMeetingBookingsInfo.length;

        if (totalEventMeetingBookingCount === 0) {
            return NextResponse.json(
                { message: EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY },
                { status: 200 }
            );
        }

        const combinedSanitizedEventMeetingBookingsInfo = 
            combinedEventMeetingBookingsInfo.map(function(booking){
                const sanitizedBooking = { ...booking };

                // Remove top-level sortDate
                delete sanitizedBooking.sortDate;

                // Remove __v, hashedPassword, password and sortDate from customerDetails
                if (sanitizedBooking.bookingInfo?.customerDetails) {
                    const { __v, hashedPassword, password, sortDate, ...safeCustomerDetails } = sanitizedBooking.bookingInfo.customerDetails;
                    sanitizedBooking.bookingInfo.customerDetails = safeCustomerDetails;
                }

                // Remove sortDate from bookingInfo as well
                if (sanitizedBooking.bookingInfo?.sortDate) {
                    delete sanitizedBooking.bookingInfo.sortDate;
                }

                return sanitizedBooking;
            });


        return NextResponse.json(
            {
                message: EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT,
                eventMeetingBookingInfo: combinedSanitizedEventMeetingBookingsInfo,
            },
            { status: 200 }
        );


    } 
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET }