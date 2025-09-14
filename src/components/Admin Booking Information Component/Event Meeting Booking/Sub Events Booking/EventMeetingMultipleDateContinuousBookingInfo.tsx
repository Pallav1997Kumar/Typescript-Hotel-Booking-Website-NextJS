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
import { getCommaAndSeperatedArray } from "@/functions/array";
import { wantFoodServiceConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";
import { convertToINR } from '@/functions/currency';


import EventMeetingFoodServices from "./Food Services Of Event/EventMeetingFoodServices";


import { IContinousMultipleDatesBookingInfoForAdmin } from '@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse';

import { 
    IHotelCustomersDetailsFrontend, 
    ITransactionDetailsFrontend 
} from '@/interface/hotelCustomersInterface';


const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 1000,
    bgcolor: 'background.paper',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #000',
    p: 2.5
}

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


interface IPropsEventMeetingMultipleDateContinuousBookingInfo {
    eachEventMeetingBookingInfo: IContinousMultipleDatesBookingInfoForAdmin;
}


function EventMeetingMultipleDateContinuousBookingInfo(
    props: IPropsEventMeetingMultipleDateContinuousBookingInfo
){

    const eachEventMeetingBookingInfo: IContinousMultipleDatesBookingInfoForAdmin = 
        props.eachEventMeetingBookingInfo;


    const transactionDetails: ITransactionDetailsFrontend = 
        eachEventMeetingBookingInfo.transactionDetails;
    
    const customerDetails: IHotelCustomersDetailsFrontend = 
        eachEventMeetingBookingInfo.customerDetails;


    const [viewFoodItems, setViewFoodItems] = useState<boolean>(false);

    const [viewMoreBookingDetails, setViewMoreBookingDetails] = useState<boolean>(false);


    return (
        <div className="w-3/5 p-0">
            
            <p className="font-serif text-xl font-bold mb-1">
                Meeting / Event Area Name: {eachEventMeetingBookingInfo.meetingEventsInfoTitle}
            </p>
            
            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Meeting / Event Start Booking Date: </span>
                {getDateTextFromFullDate(eachEventMeetingBookingInfo.meetingEventStartBookingDate.toString())}
            </p>
            
            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Meeting / Event End Booking Date: </span>
                {getDateTextFromFullDate(eachEventMeetingBookingInfo.meetingEventEndBookingDate.toString())}
            </p>
            
            {(eachEventMeetingBookingInfo.meetingEventBookingTime.length > 1) &&
                <p className="font-sans mb-2 capitalize">
                    <span className="font-semibold">Meeting / Event Booking Time: </span>
                    {getCommaAndSeperatedArray(eachEventMeetingBookingInfo.meetingEventBookingTime)}
                </p>
            }
            
            {(eachEventMeetingBookingInfo.meetingEventBookingTime.length == 1) &&
                <p className="font-sans mb-2 capitalize">
                    <span className="font-semibold">Meeting / Event Booking Time: </span>
                    {eachEventMeetingBookingInfo.meetingEventBookingTime[0]}
                </p>
            }
            
            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Meeting / Event Seating Arrangement: </span>
                {eachEventMeetingBookingInfo.meetingEventSeatingArrangement}
            </p>
            
            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Number of Guests Attending: </span>
                {eachEventMeetingBookingInfo.maximumGuestAttending}
            </p>
            
            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Food Services Included: </span>
                {eachEventMeetingBookingInfo.wantFoodServices}
            </p>
            
            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Total Price of Event/Meeting Room: </span>
                {convertToINR(eachEventMeetingBookingInfo.totalPriceEventMeetingRoom)}
            </p>
            

            {/* Button Group */}
            <div className="flex flex-row justify-center items-center mr-3">

                <Button variant='contained' onClick={()=> setViewMoreBookingDetails(true)}>
                    View Booking Details
                </Button>

                {(eachEventMeetingBookingInfo.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES) &&
                <React.Fragment>
                    
                    <Button onClick={()=>setViewFoodItems(true)} variant="outlined" sx={{ mx: 2 }}>
                        View Food Items
                    </Button>
                    <Modal
                        open={viewFoodItems}
                        onClose={()=>setViewFoodItems(false)}
                    >
                        <Box sx={boxStyle}>
                            <EventMeetingFoodServices eachEventMeetingBookingInfo={eachEventMeetingBookingInfo} />
                            <Button onClick={()=>setViewFoodItems(false)} variant="contained">
                                Ok
                            </Button>
                        </Box>
                    </Modal>

                </React.Fragment>
                }
            </div>

            {/* Booking Details Modal */}
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
    );

}

export default EventMeetingMultipleDateContinuousBookingInfo;