//API Response for Login User information starts

import { IHotelCustomerTransaction } from "../hotelCustomersInterface";

interface ILoginUserDetails  {
    userId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    emailAddress: string;
    contactNo: string;
    alternateContactNo?: string;
    accountBalance: number;
}

export type { ILoginUserDetails };

interface ISuccessLoginUserResponse {
    loginUserDetails: ILoginUserDetails;
}

interface IErrorLoginUserResponse404 {
    errorMessage: string; 
}

interface IErrorLoginUserResponse500 {
    error: string; 
}
 
type LoginUserApiResponse =
    | ISuccessLoginUserResponse
    | IErrorLoginUserResponse404
    | IErrorLoginUserResponse500;

export type { LoginUserApiResponse };

//API Response for Login User information ends



//API Response for Updating User information starts
interface ISuccessUpdateUserResponse {
    message: string;
}

interface IErrorUpdateUserResponse404 {
    errorMessage: string; 
}

interface IErrorUpdateUserResponse500 {
    error: string; 
}

type UpdateUserApiResponse = 
    | ISuccessUpdateUserResponse
    | IErrorUpdateUserResponse404
    | IErrorUpdateUserResponse500;

export type { UpdateUserApiResponse };

//API Response for Updating User information starts



//API Response for View Transaction History starts
interface ISuccessViewTransactionHistoryApiResponse {
    message: string;
    transactionHistory?: IHotelCustomerTransaction[]; 
}

interface IErrorViewTransactionHistoryApiResponse {
    errorMessage: string; // e.g. INTERNAL_SERVER_ERROR
}

type ViewTransactionHistoryApiResponse = 
    | ISuccessViewTransactionHistoryApiResponse
    | IErrorViewTransactionHistoryApiResponse;

export type { ViewTransactionHistoryApiResponse };

//API Response for View Transaction History ends



//API Response for adding new transaction of money add starts
interface IAddTransactionAddMoneySuccessResponse {
    message: string;
}

interface IAddTransactionAddMoneyErrorResponse {
    errorMessage: string; 
}

type AddTransactionAddMoneyApiResponse = 
    | IAddTransactionAddMoneySuccessResponse
    | IAddTransactionAddMoneyErrorResponse;

export type { AddTransactionAddMoneyApiResponse };

//API Response for adding new transaction of money add ends



//API Response for adding money to account starts
interface IAddMoneyToAccountSuccessResponse {
    message: string;
}

interface IAddMoneyToAccountErrorResponse {
    errorMessage: string; 
}

type AddMoneyToAccountApiResponse = 
    | IAddMoneyToAccountSuccessResponse
    | IAddMoneyToAccountErrorResponse;

export type { AddMoneyToAccountApiResponse };

//API Response for adding money to account ends



//API Response for Login the Hotel Customer starts
interface LoginUserDetails {
    userId: string;
    emailAddress: string;
    fullName: string;
}

export type { LoginUserDetails };
  
interface ISuccessLoginResponse {
    message: string; // SUCCESSFUL_LOGIN
    loginUserDetails: LoginUserDetails;
}

interface IErrorLoginResponse {
    errorMessage?: string; // For specific errors like Incorrect Password, Email Does Not Exist
    error?: string; // For internal server errors
}

type LoginResponse = 
    | ISuccessLoginResponse
    | IErrorLoginResponse;

export type { LoginResponse, ISuccessLoginResponse, IErrorLoginResponse }
//API Response for Login the Hotel Customer ends



//API Response for Registration of the Hotel Customer starts
interface ISuccessRegisterResponse {
    message: string;  // "USER_REGISTERED_SUCCESSFULLY"
}

interface IErrorRegisterResponse {
    errorMessage?: string;  // For specific errors like email already exists
    error?: string;         // For internal server errors
}

type RegisterResponse = 
    | ISuccessRegisterResponse 
    | IErrorRegisterResponse;

export type { ISuccessRegisterResponse, IErrorRegisterResponse, RegisterResponse };

//API Response for Registration of the Hotel Customer ends



//API Response for Logout of Hotel Customer starts
interface ISuccessLogoutResponse {
    message: string;
}

interface IErrorLogoutResponse {
    message: string;
}

type LogoutResponse = 
    | ISuccessLogoutResponse
    | IErrorLogoutResponse;

export type { ISuccessLogoutResponse, IErrorLogoutResponse, LogoutResponse };

//API Response for Logout of Hotel Customer ends