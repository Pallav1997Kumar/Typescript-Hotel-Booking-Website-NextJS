'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';


import { convertToINR } from "@/functions/currency";

import { 
    calculateAgeFromDob, 
    getDateTextFromFullDate, 
    getDateTextFromOnlyDate 
} from "@/functions/date";


import { 
    IRoomsSuitesBookingInfoForAdmin, 
    IGuestRoomDetails 
} from "@/interface/Rooms and Suites Interface/viewRoomSuiteBookingApiResponse";

import { 
    IHotelCustomersDetailsFrontend, 
    ITransactionDetailsFrontend 
} from "@/interface/hotelCustomersInterface";

import { 
    RoomSuitesInfoResponse, 
    Room 
} from "@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface";


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


interface IPropsEachAdminRoomBookingInfo {
    eachRoomBookingInfo: IRoomsSuitesBookingInfoForAdmin;
}


function EachAdminRoomBookingInfo(props: IPropsEachAdminRoomBookingInfo){
    
    const eachRoomBookingInfo: IRoomsSuitesBookingInfoForAdmin = props.eachRoomBookingInfo;

    const transactionDetails: ITransactionDetailsFrontend = eachRoomBookingInfo.transactionDetails;
    const customerDetails: IHotelCustomersDetailsFrontend = eachRoomBookingInfo.customerDetails;

    useEffect(()=>{
        fetchRoomsSuitesInformation();
    }, []);

    const [roomsSuites, setRoomsSuites] = useState<Room[]>([]);

    const [displayGuestDetails, setDisplayGuestDetails] = useState<boolean>(false);
    const [viewMoreBookingDetails, setViewMoreBookingDetails] = useState<boolean>(false);

    async function fetchRoomsSuitesInformation(){
        try {
            const response: Response = await fetch(
                '/api/hotel-booking-information/room-and-suites-information/'
            );
            
            const roomSuitesInfo: RoomSuitesInfoResponse = await response.json();
            const roomSuitesInformation: Room[] = roomSuitesInfo.rooms;
            setRoomsSuites(roomSuitesInformation);
        } catch (error) {
            console.log(error);
        }
    }   

    const particularRoomBasicInfo: Room | undefined = 
        roomsSuites.find(function(eachRoomInHotel: Room){
            return (eachRoomInHotel.title == eachRoomBookingInfo.bookingRoomTitle);
        });

    return (
        <div className="flex flex-col p-1 m-1 border-4 border-gray-500">
            <div className="flex flex-row">
                
                <div className="w-2/5">
                    {(particularRoomBasicInfo != null) && 
                        <Image 
                            src={particularRoomBasicInfo.photos[0]} 
                            alt="room-image" 
                            width={400} 
                            height={200} 
                        />
                    }
                </div>
                
                <div className="w-3/5 p-0">
                    
                    <p className="font-serif text-xl font-bold mb-1">
                        Room Title: {eachRoomBookingInfo.bookingRoomTitle} 
                    </p>
                    
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Room CheckIn Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomBookingInfo.bookingCheckinDate.toString())}  
                    </p>
                    
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Room CheckOut Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomBookingInfo.bookingCheckoutDate.toString())} 
                    </p>
                    
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Total Number of Rooms: </span> 
                        {eachRoomBookingInfo.totalRooms} 
                    </p>
                    
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Total Number of Guests: </span> 
                        {eachRoomBookingInfo.totalGuest} 
                    </p>
                    
                    <p className="font-sans mb-2">
                        <span className="font-semibold">Total Price Of Room: </span>
                        {convertToINR(eachRoomBookingInfo.totalPriceOfAllRooms)} 
                    </p>
                    
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

                            <Typography 
                                id="modal-modal-title" 
                                variant="h6" 
                                component="h2" 
                                sx={{ mt: 3 }}
                            >
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
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button 
                        onClick={()=>setDisplayGuestDetails(true)} 
                        variant="outlined"
                    >
                        View Guest Details
                    </Button>
                </div>
                
            </div>
            

            {displayGuestDetails && 
            <div className="flex flex-col bg-bisque border-2 border-green-500">
                
                <div className="p-1.5 m-0.5 border-dotted border-blue-500">
                    {(eachRoomBookingInfo.guestRoomsDetails).map(function(
                        eachRoomForGuest: IGuestRoomDetails
                    ){
                        return (
                            <div key={eachRoomForGuest.roomNo} className="mb-2">
                                <p>
                                    <span className="font-semibold">Room: </span>
                                    {eachRoomForGuest.roomNo} 
                                </p>
                                <p>
                                    <span className="font-semibold">Number of Adults: </span> 
                                    {eachRoomForGuest.noOfAdult} 
                                </p>
                                <p>
                                    <span className="font-semibold">Number of Children: </span> 
                                    {eachRoomForGuest.noOfChildren} 
                                </p>
                                <p>
                                    <span className="font-semibold">Total Guests in Room: </span>
                                    {eachRoomForGuest.total}
                                </p>
                            </div>
                        )
                    })}
                </div>

                <div className="flex items-center justify-center m-1">
                    <Button 
                        onClick={()=>setDisplayGuestDetails(false)} 
                        variant="contained"
                    >
                        CLOSE
                    </Button>
                </div>

            </div>
            }
        </div>
    );
}

export default EachAdminRoomBookingInfo;