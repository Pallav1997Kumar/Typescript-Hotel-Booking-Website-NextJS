'use client'
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { calculateAgeFromDob, getDateTextFromFullDate } from "@/functions/date";
import { convertToINR } from '@/functions/currency';

import EventMeetingEachDayNonContinuous from './EventMeetingEachDayNonContinuous';


import { 
    INonContinousMultipleDatesBookingInfoForAdmin, 
    IDateBooking 
} from '@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse';

import { 
    IHotelCustomersDetailsFrontend, 
    ITransactionDetailsFrontend 
} from '@/interface/hotelCustomersInterface';


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


interface IPropsEventMeetingMultipleDateNonContinuousBookingInfo {
    eachEventMeetingBookingInfo: INonContinousMultipleDatesBookingInfoForAdmin;
}


function EventMeetingMultipleDateNonContinuousBookingInfo(
    props: IPropsEventMeetingMultipleDateNonContinuousBookingInfo
){

    const eachEventMeetingBookingInfo: INonContinousMultipleDatesBookingInfoForAdmin = 
        props.eachEventMeetingBookingInfo;


    const transactionDetails: ITransactionDetailsFrontend = 
        eachEventMeetingBookingInfo.transactionDetails;

    const customerDetails: IHotelCustomersDetailsFrontend = 
        eachEventMeetingBookingInfo.customerDetails;

        
    const [viewMoreBookingDetails, setViewMoreBookingDetails] = useState<boolean>(false);

    return (
        <div className="w-3/5 p-0">
            
            <p className="font-serif text-xl font-bold mb-1">
                Meeting / Event Area Name: {eachEventMeetingBookingInfo.meetingEventsInfoTitle}
            </p>
            
            {(eachEventMeetingBookingInfo.allDatesBookingInformation && (Object.hasOwn(eachEventMeetingBookingInfo, 'allDatesBookingInformation'))) &&
                <div className="mb-4">
                    {(eachEventMeetingBookingInfo.allDatesBookingInformation).map(function(eachBookingDate: IDateBooking){
                        return(
                            <EventMeetingEachDayNonContinuous 
                                key={eachBookingDate._id}
                                eachBookingDate={eachBookingDate} 
                            />
                        )
                   })} 
                </div>
            }
            
            <p>
                <span className="font-semibold pb-2">Total Price All Rooms: </span>
                {convertToINR(eachEventMeetingBookingInfo.totalPriceOfAllDates)}
            </p>

            <div className="flex flex-row justify-center items-center mt-[2%]">
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

export default EventMeetingMultipleDateNonContinuousBookingInfo;