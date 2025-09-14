'use client'
import {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { getDatesInRange, getDateTextFromFullDate, convertDateTextToDate } from "@/functions/date";
import { convertToINR } from '@/functions/currency';

import { RoomWithDateDetails, DateDetail, RoomSuitesEachDayInfoRespone } from "@/interface/Rooms and Suites Interface/eachDayRoomSuitesInfoInterface";
import { DateInfoInterface, RoomsSuitesBookingDetailsInterface, ParticularRoomInfoInterface } from '@/interface/Rooms and Suites Interface/roomsSuitesBookingInterface';


interface IPropsBookingPriceDetails{
    roomDetailsForCart: RoomsSuitesBookingDetailsInterface | undefined;
    setTotalPriceOfRoom: (totalPriceOfAllRooms: number) => void
}


const tableHeaderRowStyle = { 
    backgroundColor: 'cadetblue' 
}

const tableHeaderCellStyle = {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: 'rgb(196, 20, 20)',
}

const tableRowCellStyle = {
    fontSize: '1.05rem',
    borderBottom: '1px dashed blue',
    borderRight: '1px ridge lightblue'
}

const tableRowStyleForTotal = {
    border: '2px double blue'
}

const tableRowCellStyleForTotal ={
    fontSize: '1.07rem',
    fontWeight: 'bold'
}

const tableRowCellStyleForTotalAmount = {
    borderLeft: '1px solid lightblue',
    fontSize: '1.07rem',
    fontWeight: 'bold'
}


function BookingPriceDetails(props: IPropsBookingPriceDetails) {
    const roomDetailsForCart: RoomsSuitesBookingDetailsInterface | undefined = props.roomDetailsForCart;

    if(!roomDetailsForCart){
        throw new Error("roomDetailsForCart is missing");
    }

    let checkinDateString: string = "";
    let checkoutDateString: string = "";

    if(roomDetailsForCart.checkinDate instanceof Date){
        checkinDateString = convertDateTextToDate(roomDetailsForCart.checkinDate.toLocaleDateString()).toString();
    }
    else{
        checkinDateString = convertDateTextToDate(roomDetailsForCart.checkinDate).toString();
    }

    if(roomDetailsForCart.checkoutDate instanceof Date){
        checkoutDateString= convertDateTextToDate(roomDetailsForCart.checkoutDate.toLocaleDateString()).toString();
    }
    else{
        checkoutDateString = convertDateTextToDate(roomDetailsForCart.checkoutDate).toString();
    }  
    
    const roomTitle: string = roomDetailsForCart.roomTitle;
    const checkinDate: Date = new Date(checkinDateString);
    const checkoutDate: Date = new Date(checkoutDateString);
    const noOfRooms: number = roomDetailsForCart.totalRooms;


    useEffect(()=>{
        fetchRoomsSuitesEachDayData();
    },[]);

    const [roomWithDateInformation, setRoomWithDateInformation] = useState<null | RoomWithDateDetails>(null);

    async function fetchRoomsSuitesEachDayData(){
        try{
            const response: Response = await fetch('/api/hotel-booking-information/room-and-suites-information/each-day-information/');
            const data: RoomSuitesEachDayInfoRespone = await response.json();
            const allRoomsWithDate: RoomWithDateDetails[] = data.roomsWithDate;
            const particularRoomEachDayInfo: RoomWithDateDetails | undefined = allRoomsWithDate.find(function(eachRoomWithDate: RoomWithDateDetails){
                return eachRoomWithDate.roomTitle == roomTitle
            });
            if(!particularRoomEachDayInfo){
                throw new Error("particularRoomEachDayInfo missing");
            }
            setRoomWithDateInformation(particularRoomEachDayInfo);
        }
        catch(error){
            console.log(error);
        }
    }

    const datesArrayList: Date[] = getDatesInRange(checkinDate,checkoutDate);
    

    const roomsInfoArray: DateDetail[] = [];
    if(roomWithDateInformation!= null){
        datesArrayList.forEach(function(eachDate: Date){
            const eachDateInArray = eachDate.toISOString();
            const dateDetailsOfRoom = roomWithDateInformation.dateDetails;
            const currentDateRoomInfo = (dateDetailsOfRoom).find(function(eachDateDetails: DateDetail){
                let eachDateInRoom: string | Date = eachDateDetails.date.toString().split("T")[0].toString();
                eachDateInRoom = new Date(eachDateInRoom);
                eachDateInRoom = eachDateInRoom.toISOString();
                return (eachDateInRoom == eachDateInArray);
            });
            if(!currentDateRoomInfo){
                throw new Error("currentDateRoomInfo is missing");
            }
            roomsInfoArray.push(currentDateRoomInfo);
        })
    }
    
    let bookingRoomsPriceDetails: DateInfoInterface[] | undefined;
    if(roomsInfoArray.length > 0){
        bookingRoomsPriceDetails = roomsInfoArray.map(function(eachDateInfo: DateDetail){
            const date: Date | string = eachDateInfo.date;
            let dateInOrdinal: string = "";
            if(date instanceof Date){
                dateInOrdinal = getDateTextFromFullDate(date.toISOString());
            } 
            else if(typeof date == "string"){
                dateInOrdinal = getDateTextFromFullDate(date);
            }       
            const priceOnDate: number = eachDateInfo.price;
            const totalPriceOnDate: number = priceOnDate * noOfRooms;
            const currentDateInfo: DateInfoInterface = {
                key: date,
                dateInOrdinal,
                priceOnDate,
                noOfRooms,
                totalPriceOnDate
            }
            return currentDateInfo;
        });
    }

    let totalPriceOfRoom: number = 0;
    if(bookingRoomsPriceDetails){
        if(Array.isArray(bookingRoomsPriceDetails)){
            bookingRoomsPriceDetails.forEach(function(eachDate: DateInfoInterface){
                totalPriceOfRoom = totalPriceOfRoom + eachDate.totalPriceOnDate;
            });
        }
    }    

    //props.setTotalPriceOfRoom(totalPriceOfRoom);
    useEffect(() => {
        props.setTotalPriceOfRoom(totalPriceOfRoom);
    }, [totalPriceOfRoom]);

    

    return (
        <div className="my-4">
            {(Array.isArray(bookingRoomsPriceDetails)) &&
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={tableHeaderRowStyle}>
                            <TableCell sx={tableHeaderCellStyle}>Date</TableCell>
                            <TableCell sx={tableHeaderCellStyle}>Price Of Room</TableCell>
                            <TableCell sx={tableHeaderCellStyle}>No Of Rooms</TableCell>
                            <TableCell sx={tableHeaderCellStyle}>Total Price Of Room</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookingRoomsPriceDetails.map(function(eachDate: DateInfoInterface){
                            return (
                                <TableRow key={eachDate.dateInOrdinal}>
                                    <TableCell sx={tableRowCellStyle}>{eachDate.dateInOrdinal}</TableCell>
                                    <TableCell sx={tableRowCellStyle}>{convertToINR(eachDate.priceOnDate)}</TableCell>
                                    <TableCell sx={tableRowCellStyle}>{eachDate.noOfRooms}</TableCell>
                                    <TableCell sx={tableRowCellStyle}>{convertToINR(eachDate.totalPriceOnDate)}</TableCell>
                                </TableRow>
                            )
                        })}
                        <TableRow sx={tableRowStyleForTotal}>
                            <TableCell sx={tableRowCellStyleForTotal}>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell sx={tableRowCellStyleForTotalAmount}>{convertToINR(totalPriceOfRoom)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            }
        </div>
    );

}

export default BookingPriceDetails;