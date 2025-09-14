import { NextRequest, NextResponse } from "next/server";

import Connection from "@/database config/config";

import RoomsSuitesBookingInfo from "@/database models/booking models/room suites models/roomsSuitesBookingInfo";


import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants";

import { 
    ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, 
    ROOMS_SUITES_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants";


import { IOptions } from "@/interface/timeZoneInterface";


Connection();


async function GET(request: NextRequest){
    try {
        const url: URL = new URL(request.url);
        const currentPageNumber: string | null = url.searchParams.get("page");
        const page: number = parseInt(currentPageNumber || "1", 10);
        const limit: number = 5;
        const skip: number = (page - 1) * limit;

        const currentDate: Date = new Date();
        const options: IOptions = { timeZone: 'Asia/Kolkata' };
        const currentIstDate: Date = new Date(currentDate.toLocaleString('en-US', options));

        // Get total count of bookings (for pagination metadata)
        const totalCountAgg = await RoomsSuitesBookingInfo.aggregate([
            { 
                $match: { 
                    bookingCheckoutDate: { $lt: currentIstDate } 
                } 
            },
            { $count: "totalCount" }
        ]);

        let totalCount: number;
        if (totalCountAgg.length > 0 && totalCountAgg[0].totalCount !== undefined) {
            totalCount = totalCountAgg[0].totalCount;
        } else {
            totalCount = 0;
        }

            
        const roomSuiteUserBooking = await RoomsSuitesBookingInfo.aggregate([
            {
                $match: {
                    bookingCheckoutDate: { $lt: currentIstDate }
                }
            },
            { 
                $sort: { 
                    bookingCheckoutDate: -1 
                } 
            },
            { 
                $skip: skip 
            },
            { 
                $limit: limit 
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
                $lookup: {
                from: 'hotelcustomersusers', 
                localField: 'customerId',
                foreignField: '_id',
                as: 'customerDetails'
                }
            },
            {
                $unwind: {
                path: '$customerDetails',
                preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    //bookingInfo: "$$ROOT",
                    bookingInfo: {
                        _id: "$_id",
                        customerId: "$customerId",
                        transactionId: "$transactionId",
                        bookingRoomTitle: "$bookingRoomTitle",
                        bookingCheckinDate: "$bookingCheckinDate",
                        bookingCheckoutDate: "$bookingCheckoutDate",
                        totalRooms: "$totalRooms",
                        totalGuest: "$totalGuest",
                        guestRoomsDetails: "$guestRoomsDetails",
                        totalPriceOfAllRooms: "$totalPriceOfAllRooms",
                        transactionDetails: "$transactionDetails",
                        customerDetails: {
                            _id: "$customerDetails._id",
                            firstName: "$customerDetails.firstName",
                            middleName: "$customerDetails.middleName",
                            lastName: "$customerDetails.lastName",
                            fullName: "$customerDetails.fullName",
                            gender: "$customerDetails.gender",
                            dateOfBirth: "$customerDetails.dateOfBirth",
                            emailAddress: "$customerDetails.emailAddress",
                            contactNo: "$customerDetails.contactNo",
                            alternateContactNo: "$customerDetails.alternateContactNo",
                            accountBalance: "$customerDetails.accountBalance"
                        }
                    }
                }
            }
        ]);

        const hasMore = skip + limit < totalCount;

        
        if(roomSuiteUserBooking){
            if(roomSuiteUserBooking.length > 0){
                return NextResponse.json(
                    { 
                        message: ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, 
                        roomSuitesBookingInfo: roomSuiteUserBooking,
                        pagination: {
                            currentPage: page,
                            hasMore,
                            totalCount
                        }
                    },
                    { status: 200 }
                );
            }
            else{
                return NextResponse.json(
                    { message: ROOMS_SUITES_BOOKING_INFO_IS_EMPTY },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { message: ROOMS_SUITES_BOOKING_INFO_IS_EMPTY },
                { status: 200 }
            );
        }
               
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET };