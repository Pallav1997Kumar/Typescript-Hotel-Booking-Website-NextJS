'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { calculateAgeFromDob, getDateTextFromFullDate } from "@/functions/date";
import { convertToINR } from '@/functions/currency';


import { IDiningBookingInfoForAdmin } from '@/interface/Dining Interface/viewDiningBookingApiResponse';

import { 
    IHotelCustomersDetailsFrontend, 
    ITransactionDetailsFrontend 
} from '@/interface/hotelCustomersInterface';

import { 
    Dining, 
    DiningInfoResponse 
} from '@/interface/Dining Interface/hotelDiningInterface';


const style = {
    position: 'absolute',
    top: '50%',
    left: '40%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    boxShadow: 24,
    px: 4,
    py: 2,
    fontSize: '0.8rem'
};


interface IPropsEachAdminDiningBookingInfo{
    eachDiningBookingInfo: IDiningBookingInfoForAdmin;
}


function EachAdminDiningBookingInfo(props: IPropsEachAdminDiningBookingInfo){

    const eachDiningBookingInfo: IDiningBookingInfoForAdmin = props.eachDiningBookingInfo;

    const transactionDetails: ITransactionDetailsFrontend = eachDiningBookingInfo.transactionDetails;
    const customerDetails: IHotelCustomersDetailsFrontend = eachDiningBookingInfo.customerDetails;
    

    useEffect(()=>{
        fetchDiningInformation();
    }, []);

    const [dining, setDining] = useState<Dining[]>([]);

    const [viewMoreBookingDetails, setViewMoreBookingDetails] = useState<boolean>(false);

    async function fetchDiningInformation(){
        try {
            const response: Response = await fetch(
                '/api/hotel-booking-information/dining-information/'
            );

            const diningInfo: DiningInfoResponse = await response.json();
            const diningInfomation: Dining[] = diningInfo.dining;
            setDining(diningInfomation);
        } catch (error) {
            console.log(error);
        }
    }

    const particularDiningBasicInfo: Dining | undefined = 
        dining.find(function(eachDiningInHotel: Dining){
            return (eachDiningInHotel.diningAreaTitle == eachDiningBookingInfo.diningRestaurantTitle);
        });


    return (
        <div className="flex flex-row p-4 m-4 border-4 border-gray-500">
            
            {/* Image Section */}
            <div className="w-[40%]">
                {(particularDiningBasicInfo != null) && 
                    <Image 
                        src={particularDiningBasicInfo.photo} 
                        alt='dining-image' 
                        width={430} 
                        height={210} 
                    />
                }
            </div>
            

            {/* Information Section */}
            <div className="w-[60%] p-0 pl-4">
                
                <p className="font-[700] text-[1.3rem] mb-2 font-serif">
                    Dining Restaurant Name: {eachDiningBookingInfo.diningRestaurantTitle} 
                </p>
                
                <p className="mb-2 capitalize font-sans">
                    <span className="font-semibold">Table Dining Date: </span>
                    {getDateTextFromFullDate(eachDiningBookingInfo.tableBookingDate.toString())}
                </p>
                
                <p className="mb-2 capitalize font-sans">
                    <span className="font-semibold">Meal Type: </span>
                    {eachDiningBookingInfo.mealType}
                </p>
                
                <p className="mb-2 capitalize font-sans">
                    <span className="font-semibold">Table Booking Time: </span>
                    {eachDiningBookingInfo.tableBookingTime}
                </p>
                
                <p className="mb-2 capitalize font-sans">
                    <span className="font-semibold">Total Number Of Guest: </span>
                    {eachDiningBookingInfo.noOfGuests}
                </p>
                
                <p className="mb-2 capitalize font-sans">
                    <span className="font-semibold">Total Booking Price: </span>
                    {convertToINR(eachDiningBookingInfo.priceForBooking)}
                </p>
                
                <p className="font-semibold">Total Number Of Tables</p>

                <div className="flex flex-row pb-4">
                    
                    <p className="pr-6 font-sans capitalize mb-1">
                        <span className="font-semibold">Two Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountTwoPerson}
                    </p>
                    
                    <p className="pr-6 font-sans capitalize mb-1">
                        <span className="font-semibold">Four Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountFourPerson}
                    </p>
                    
                    <p className="pr-6 font-sans capitalize mb-1">
                        <span className="font-semibold">Six Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountSixPerson}
                    </p>
                </div>

                <Button variant='contained' onClick={()=> setViewMoreBookingDetails(true)}>
                    View Booking Details
                </Button>
                <Modal
                    open={viewMoreBookingDetails}
                    onClose={()=> setViewMoreBookingDetails(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Transaction Details
                        </Typography>
                        <Typography id="modal-modal-description" component="div">
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table" size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Transaction Date Time</TableCell>
                                            <TableCell>{getDateTextFromFullDate(transactionDetails.transactionDateTime.toString())}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Transaction Amount</TableCell>
                                            <TableCell>{transactionDetails.transactionAmount}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Transaction Description</TableCell>
                                            <TableCell>{transactionDetails.transactionDescription}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Typography>

                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 3 }}>
                            Customer Details
                        </Typography>
                        <Typography id="modal-modal-description" component="div">
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table" size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>{customerDetails.fullName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>{customerDetails.gender}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Email Address</TableCell>
                                            <TableCell>{customerDetails.emailAddress}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Contact Number</TableCell>
                                            <TableCell>{customerDetails.contactNo}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Alternate Contact Number</TableCell>
                                            <TableCell>{customerDetails.alternateContactNo || 'N/A'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Age</TableCell>
                                            <TableCell>{calculateAgeFromDob(customerDetails.dateOfBirth.toString())}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Typography>

                    </Box>
                </Modal>
                
            </div>
        </div>
    );

}

export default EachAdminDiningBookingInfo;