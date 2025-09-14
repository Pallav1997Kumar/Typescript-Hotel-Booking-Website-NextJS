import { NextRequest, NextResponse } from 'next/server';

import Connection from "@/database config/config";

import HotelCustomersTransaction from "@/database models/hotelCustomersTransaction";

import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants";
import { 
    TRANSACTION_HISTORY_FOUND, 
    NO_TRANSACTION_HISTORY_FOUND 
} from "@/constant string files/apiSuccessMessageConstants";


Connection();

async function GET(request: NextRequest){
    try{

        const url: URL = new URL(request.url);
        const currentPageNumber: string | null = url.searchParams.get("page");
        const page: number = parseInt(currentPageNumber || "1", 10);

        const totalCount: number = await HotelCustomersTransaction.countDocuments();

        const minElementsPerPage: number = Math.floor(totalCount/7);
        
        const limit: number = Math.min(minElementsPerPage, 10);
        const skip: number = (page - 1) * limit;   

        const transactionHistory = await HotelCustomersTransaction.aggregate([
            {
                $sort: {
                    transactionDateTime: -1,
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
                    _id: "$_id",
                    customerId: "$customerId",
                    transactionAmount: "$transactionAmount",
                    transactionType: "$transactionType",
                    transactionDescription: "$transactionDescription",
                    transactionDateTime: "$transactionDateTime",
                    updatedAccountBalance: "$updatedAccountBalance",
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
        ]);
        
        if(transactionHistory){
            if(transactionHistory.length > 0){
                return NextResponse.json(
                    { 
                        message: TRANSACTION_HISTORY_FOUND, 
                        transactionHistory: transactionHistory,
                        pagination: {
                            currentPage: page,
                            totalPages: Math.ceil(totalCount / limit),
                            totalItems: totalCount,
                        },
                    },
                    { status: 200 }
                );
            }
            else{
                return NextResponse.json(
                    { message: NO_TRANSACTION_HISTORY_FOUND },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { message: NO_TRANSACTION_HISTORY_FOUND },
                { status: 200 }
            );
        }
    }
    catch(error){
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { GET };