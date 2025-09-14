'use client'
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';

import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import { useAppSelector, useAppDispatch } from "@/redux store/hooks";

import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";


import { 
    TRANSACTION_HISTORY_FOUND, 
    NO_TRANSACTION_HISTORY_FOUND 
} from "@/constant string files/apiSuccessMessageConstants";


import ViewPracticularTransactionDetails from "./ViewPracticularTransactionDetails";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";


import { LoginUserDetails } from "@/interface/Hotel User Interface/hotelUsersInterfce";

import { 
    AdminViewTransactionHistoryResponse, 
    ITransactionDetailsForAdmin 
} from "@/interface/Hotel User Interface/hotelAdminViewTxnHistoryInterface";


const tableHeadingStyle = {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    backgroundColor: 'rgb(55, 47, 45)',
    color: 'rgb(232, 219, 216)',
    border: '2.5px solid rgb(233, 206, 200)'
}


function ViewTransactionHistory(){
    return (
        <ErrorBoundary>
            <ViewTransactionHistoryFunctionalComponent />
        </ErrorBoundary>
    );
}


function ViewTransactionHistoryFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const loginUserDetails: LoginUserDetails | null = 
        useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    let loginUserId: string | undefined;
    let loginUserFullName: string | undefined;
    let loginEmailAddress: string | undefined;

    if(loginUserDetails != null){
        loginUserId = loginUserDetails.userId;
        loginEmailAddress = loginUserDetails.emailAddress;
        loginUserFullName = loginUserDetails.fullName;
    }
    
    if(loginUserDetails == null){
        const loginPageCalledFrom = 
            'Admin Past Dining, Rooms Suites and Event Meeting Rooms Page';
        const loginRedirectPage = '/admin-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/admin-login');
        return ;
    }
    
    if(loginUserDetails != null && 
        loginEmailAddress && !loginEmailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 
                'Admin Past Dining, Rooms Suites and Event Meeting Rooms Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
    }

    const pageNumber: string | null = searchParams.get('page')

    const currentPage: number = Number(pageNumber) || 1;

    const [transactionDetails, setTransactionDetails] = 
        useState<null | ITransactionDetailsForAdmin[]>(null);
        
    const [loadingTransactionDetails, setLoadingTransactionDetails] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);


    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchCurrentPageTransactionDetails();
        }
    }, [currentPage]);

    async function fetchCurrentPageTransactionDetails(){
        try{
            setLoadingTransactionDetails(true);
            const response: Response = await fetch(`/api/all-users-view-transaction-history?page=${currentPage}`);
            const data: AdminViewTransactionHistoryResponse = await response.json();
            console.log(data);

            if(response.status === 200){
                if('message' in data){
                    if(data.message === TRANSACTION_HISTORY_FOUND){
                        const transactionHistoryInfo: ITransactionDetailsForAdmin[] = data.transactionHistory;
                        setTransactionDetails(transactionHistoryInfo);
                        setTotalPages(data.pagination.totalPages);
                    }
                    else if(data.message === NO_TRANSACTION_HISTORY_FOUND){
                        const transactionHistoryInfo: ITransactionDetailsForAdmin[] = [];
                        setTransactionDetails(transactionHistoryInfo);
                    }
                }
            }
        }
        catch(error){
            console.log(error)
        }
        finally{
            setLoadingTransactionDetails(false);
        }
    }

    function handlePageChange(page: number) {
        router.push(`/admin-home-page/view-transaction-history?page=${page}`);
    }

    function renderPagination(){
        if(totalPages <= 1){
            return null;
        }

        let buttons = [];

        //First Page
        buttons.push(
            <Button 
                key={1} 
                color="success"
                variant={currentPage === 1 ? "contained" : "outlined"} 
                onClick={()=>handlePageChange(1)}
                sx={{ mx: 1 }}
            >
                1
            </Button>
        );

        let startPage: number = Math.max(2, currentPage - 1);
        let endPage: number = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 2) {
            startPage = 2;
            endPage = Math.min(4, totalPages - 1); 
        }

        if (currentPage >= totalPages - 1) {
            startPage = Math.max(totalPages - 3, 2);
            endPage = totalPages - 1;
        }

        if (startPage > 2) {
            buttons.push(
                <span key="ellipsis-start" className="mx-2 text-lg">...</span>
            );
        }

        for(let i = startPage; i <= endPage; i++){
            buttons.push(
                <Button
                    key={i}
                    color="success"
                    variant={currentPage === i ? "contained" : "outlined"}
                    onClick={()=>handlePageChange(i)}
                    sx={{ mx: 1 }}
                >
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages - 1) {
            buttons.push(
                <span key="ellipsis-end" className="mx-2 text-lg">...</span>
            );
        }

        if(totalPages > 1){
            buttons.push(
                <Button
                    key={totalPages}
                    color="success"
                    variant={currentPage === totalPages ? "contained" : "outlined"}
                    onClick={()=>handlePageChange(totalPages)}
                    sx={{ mx: 1 }}
                >
                    {totalPages}
                </Button>
            );
        }

        return <div className="my-8 flex items-center justify-center">{buttons}</div>;
    }

    return(
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            {/* Breadcrumb Navigation */}
            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            HOME 
                        </span>
                    </Link> 
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/admin-home-page"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            ADMIN HOME PAGE 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span> 
                    <Link href={`/admin-home-page/view-transaction-history?page=${currentPage}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            VIEW TRANSACTION HISTORY 
                        </span>
                    </Link>
                </p>
            </div>

            {/* Transaction Table */}
            {(!loadingTransactionDetails && 
            transactionDetails != null && transactionDetails.length > 0) && 
                <div className="mx-[3%] my-[1%]">
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeadingStyle}>Customer Full Name</TableCell>
                                    <TableCell sx={tableHeadingStyle}>Customer Email Address</TableCell>
                                    <TableCell sx={tableHeadingStyle}>Transaction Date Time</TableCell>
                                    <TableCell sx={tableHeadingStyle}>Transaction Type</TableCell>
                                    <TableCell sx={tableHeadingStyle}>Transaction Amount</TableCell>
                                    <TableCell sx={tableHeadingStyle}>Transaction Description</TableCell>
                                    <TableCell sx={tableHeadingStyle}>View Customer's Full Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactionDetails.map(function(eachTransactionDetails: ITransactionDetailsForAdmin){
                                    return(
                                        <ViewPracticularTransactionDetails 
                                            key={eachTransactionDetails._id}
                                            eachTransactionDetails={eachTransactionDetails} 
                                        />
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination Logic */}
                    {renderPagination()}

                </div>
            }
        </div>
    );
}

export default ViewTransactionHistory;