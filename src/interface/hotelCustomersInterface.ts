import  { Document, Types } from "mongoose";


interface IHotelCustomerTransaction extends Document {
    customerId: Types.ObjectId; 
    transactionAmount: number;
    transactionType: string;
    transactionDescription: string;
    transactionDateTime: Date;
    updatedAccountBalance: number;
}

interface IHotelCustomersUser extends Document{
    firstName: string;
    middleName?: string; 
    lastName: string;
    fullName: string;
    gender: string;
    dateOfBirth: Date;
    emailAddress: string;
    contactNo: number;
    alternateContactNo?: number;
    password: string;
    hashedPassword: string;
    accountBalance: number;
}


export type { IHotelCustomersUser, IHotelCustomerTransaction };


//For Frontend

interface ITransactionDetailsFrontend {
    _id: string;
  customerId: string;
  transactionAmount: number;
  transactionType: string;
  transactionDescription: string;
  transactionDateTime: Date; 
  updatedAccountBalance: number;
  __v: number;
}


interface IHotelCustomersDetailsFrontend {
    _id: string;
    firstName: string;
    middleName: string; 
    lastName: string;
    fullName: string;
    gender: string;
    dateOfBirth: Date;
    emailAddress: string;
    contactNo: number;
    alternateContactNo?: number;
    accountBalance: number;
}

export type { ITransactionDetailsFrontend, IHotelCustomersDetailsFrontend }; 