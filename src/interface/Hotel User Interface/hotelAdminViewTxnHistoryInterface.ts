import { IHotelCustomersDetailsFrontend } from "../hotelCustomersInterface";

interface ITransactionDetailsForAdmin {
    _id: string;
    customerId: string;
    transactionAmount: number;
    transactionType: string;
    transactionDescription: string;
    transactionDateTime: Date; 
    updatedAccountBalance: number;
    customerDetails: IHotelCustomersDetailsFrontend;
}


export type { ITransactionDetailsForAdmin };


interface IAdminViewTransactionHistorySuccessResponse {
    message: string;
    transactionHistory: ITransactionDetailsForAdmin[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    }
}

interface IAdminViewTransactionHistoryErrorResponse {
    errorMessage: string;
}

type AdminViewTransactionHistoryResponse = 
    | IAdminViewTransactionHistorySuccessResponse
    | IAdminViewTransactionHistoryErrorResponse;

export type { 
    AdminViewTransactionHistoryResponse, 
    IAdminViewTransactionHistoryErrorResponse, 
    IAdminViewTransactionHistorySuccessResponse 
};