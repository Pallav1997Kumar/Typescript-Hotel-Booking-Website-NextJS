'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useAppDispatch, useAppSelector } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import { utcTimeToISTConvesion } from "@/functions/date";
import { convertToINR } from "@/functions/currency";
import { TRANSACTION_HISTORY_FOUND, NO_TRANSACTION_HISTORY_FOUND } from "@/constant string files/apiSuccessMessageConstants";

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { IHotelCustomerTransaction } from "@/interface/hotelCustomersInterface"; 
import { ILoginUserDetails, LoginUserApiResponse, ViewTransactionHistoryApiResponse } from "@/interface/Hotel User Interface/hotelUsersInterfce";


const tableHeadingStyle = {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    backgroundColor: 'rgb(55, 47, 45)',
    color: 'rgb(232, 219, 216)'
}


function ViewAccountBalanceFunctionalComponent() {
    
    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    useEffect(function() {
        if (loginUserDetails == null) {
            const loginPageCalledFrom = 'View Account Balance Page';
            const loginRedirectPage = '/profile-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/login');
        }
    }, [loginUserDetails, dispatch, router]);

    if(loginUserDetails == null){
        return null;
    }
    const loginUserId: string = loginUserDetails.userId;

    const [loginCustomerInfo, setLoginCustomerInfo] = useState<null | ILoginUserDetails>(null);
    const [showTransaction, setShowTransaction] = useState<boolean>(false);
    const [transactionHistoryFound, setTransactionHistoryFound] = useState<boolean>(false);
    const [transactionHistory, setTransactionHistory] = useState<IHotelCustomerTransaction[] | null>(null);

    if(transactionHistory != null){
        transactionHistory.sort(function(a,b){
            return new Date(b.transactionDateTime).getTime() - new Date(a.transactionDateTime).getTime();
        });
    }
    

    useEffect(()=>{
        fetchLoginUsersDetailsDb(loginUserId);
        fetchUserTransactionHistory(loginUserId);
    }, []);

    async function fetchLoginUsersDetailsDb(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/users-authentication/customers-authenticatication/login-user-information/${loginUserId}`);
            const data: LoginUserApiResponse = await response.json();
            if(response.status == 200){
                if('loginUserDetails' in data){
                    setLoginCustomerInfo(data.loginUserDetails);  
                } 
            }
        } catch (error) {
            console.log(error); 
        }
    }

    async function fetchUserTransactionHistory(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/account-balance-user/view-transaction-history/${loginUserId}`);
            const data: ViewTransactionHistoryApiResponse = await response.json();
            if(response.status === 200){
                if('message' in data){
                    if(data.message === NO_TRANSACTION_HISTORY_FOUND){
                        setTransactionHistoryFound(false);
                    }
                    else if(data.message === TRANSACTION_HISTORY_FOUND){
                        setTransactionHistoryFound(true);
                        if('transactionHistory' in data){
                            const txnHistory: IHotelCustomerTransaction[] | undefined = data.transactionHistory;
                            if(txnHistory){
                                setTransactionHistory(txnHistory);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="m-[4%]">

            {/* Breadcrumb Navigation */}
            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            HOME 
                        </span>
                    </Link> 
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/profile-home-page"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            PROFILE PAGE 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span> 
                    <Link href={`/profile-home-page/view-account-balance/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            VIEW ACCOUNT BALANCE 
                        </span>
                    </Link>
                </p>
            </div>

            {(loginCustomerInfo != null) && 
            <div>
                <div className="flex flex-row my-[2.5%]">
                    <h3 className="pr-[2%] pt-[0.75%] text-[1.5rem] font-sans">Account Balance: </h3>
                    <p className="bg-[lightseagreen] px-[10%] py-[1.5%] text-[1.1rem] font-extrabold text-[beige] rounded-full">
                        {convertToINR(loginCustomerInfo.accountBalance)}
                    </p>
                </div>

                <div className="flex justify-center items-center">
                    <Button onClick={()=> setShowTransaction(true)} variant="outlined" className="mx-2">
                        View Transaction
                    </Button>
                    <Button onClick={()=> setShowTransaction(false)} variant="outlined" className="mx-2">
                        Hide Transaction
                    </Button>
                </div>
            </div>
            }

            {(!transactionHistoryFound && showTransaction) && 
            <div className="flex items-center justify-center mt-[4%] uppercase text-[1.5rem] font-bold tracking-wide font-serif">
                <p>No Transaction Found</p>
            </div>
            }

            {(transactionHistoryFound && showTransaction) && 
            <div className="my-[2%]">
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={tableHeadingStyle}>Transaction Date Time</TableCell>
                                <TableCell sx={tableHeadingStyle}>Transaction Type</TableCell>
                                <TableCell sx={tableHeadingStyle}>Transaction Amount</TableCell>
                                <TableCell sx={tableHeadingStyle}>Updated Account Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionHistory != null && transactionHistory.map(function(eachTransaction: IHotelCustomerTransaction){
                                return (
                                    <TableRow>
                                        <TableCell>{utcTimeToISTConvesion(eachTransaction.transactionDateTime.toString())}</TableCell>
                                        <TableCell>{eachTransaction.transactionType}</TableCell>
                                        <TableCell>{convertToINR(eachTransaction.transactionAmount)}</TableCell>
                                        <TableCell>{convertToINR(eachTransaction.updatedAccountBalance)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            }
            
        </div>
    );
}


function ViewAccountBalance(){
    return (
        <ErrorBoundary>
            <ViewAccountBalanceFunctionalComponent />
        </ErrorBoundary>
    );
}


export default ViewAccountBalance;