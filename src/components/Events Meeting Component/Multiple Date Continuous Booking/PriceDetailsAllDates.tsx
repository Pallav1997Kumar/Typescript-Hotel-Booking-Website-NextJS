'use client'
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { getDatesInRangeInclusiveBothDate, convertDateTextToDate } from '@/functions/date';
import { convertToINR } from '@/functions/currency';

import PriceDetailsEachDate from './PriceDetailsEachDate';

import { DateWithPriceInterface, MultipleContinuousDatesBookingDetailsEachDayInfoInterface, MultipleContinuousDatesBookingDetailsInterface, SelectedMealsType } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';



interface IPropsPriceDetailsMultipleContinousDates{
    bookingDetailsForCart: MultipleContinuousDatesBookingDetailsInterface | null;
    setTotalPriceOfRoom: (totalPriceOfAllRooms: number) => void;
}


function PriceDetailsAllDates(props: IPropsPriceDetailsMultipleContinousDates){

    const bookingDetails: MultipleContinuousDatesBookingDetailsInterface | null = props.bookingDetailsForCart;
    const [eachDateTotalPrice, setEachDateTotalPrice] = useState<DateWithPriceInterface[]>([]);
    if(bookingDetails == null){
        throw new Error("bookingDetails is null");
    }

    const bookingDetailsEachDayInfo: MultipleContinuousDatesBookingDetailsEachDayInfoInterface = {};
    bookingDetailsEachDayInfo.meetingEventsInfoTitle = bookingDetails.meetingEventsInfoTitle;
    bookingDetailsEachDayInfo.meetingEventBookingTime = bookingDetails.meetingEventBookingTime;
    bookingDetailsEachDayInfo.meetingEventSeatingArrangement = bookingDetails.meetingEventSeatingArrangement;
    bookingDetailsEachDayInfo.maximumGuestAttending = bookingDetails.maximumGuestAttending;
    bookingDetailsEachDayInfo.wantFoodServices = bookingDetails.wantFoodServices;
    if(Object.hasOwn(bookingDetails, 'selectedMealsOnBookingDate')){
        bookingDetailsEachDayInfo.selectedMealsOnBookingDate = bookingDetails.selectedMealsOnBookingDate;
    }

    let eventMeetingRoomBookingStartDateString: string = "";
    let eventMeetingRoomBookingEndDateString: string = "";

    if(typeof bookingDetails.meetingEventStartBookingDate == "string"){
        eventMeetingRoomBookingStartDateString = convertDateTextToDate(bookingDetails.meetingEventStartBookingDate).toString();
    }
    else if(bookingDetails.meetingEventStartBookingDate instanceof Date){
        eventMeetingRoomBookingStartDateString = convertDateTextToDate(bookingDetails.meetingEventStartBookingDate.toISOString()).toString();
    }

    if(typeof bookingDetails.meetingEventEndBookingDate == "string"){
        eventMeetingRoomBookingEndDateString = convertDateTextToDate(bookingDetails.meetingEventEndBookingDate).toString();
    }
    else if(bookingDetails.meetingEventEndBookingDate instanceof Date){
        eventMeetingRoomBookingEndDateString = convertDateTextToDate(bookingDetails.meetingEventEndBookingDate.toISOString()).toString();
    }
    
    const eventMeetingRoomBookingStartDate: Date = new Date(eventMeetingRoomBookingStartDateString);
    const eventMeetingRoomBookingEndDate: Date = new Date(eventMeetingRoomBookingEndDateString);

    const eventMeetingBookingDatesArrayList: Date[] = getDatesInRangeInclusiveBothDate(eventMeetingRoomBookingStartDate, eventMeetingRoomBookingEndDate);
    const eventMeetingBookingDatesStringArrayList: string[] = eventMeetingBookingDatesArrayList.map(function(eachDate: Date){
        return convertDateTextToDate(eachDate.toISOString()).toString();
    });
    //console.log(eventMeetingBookingDatesStringArrayList);

    function getEachDateTotalPrice(dateWithPrice: DateWithPriceInterface) {
    setEachDateTotalPrice(function (previousState: DateWithPriceInterface[]): DateWithPriceInterface[] {
        let updatedEachDateTotalPrice: DateWithPriceInterface[] = [];
        const isSameDateInPreviousDate = previousState.filter(function (eachDate: DateWithPriceInterface) {
            return eachDate.currentDate === dateWithPrice.currentDate;
        });
        if (isSameDateInPreviousDate.length === 0) {
            updatedEachDateTotalPrice = [...previousState, dateWithPrice];
        } else if (isSameDateInPreviousDate.length > 0) {
            updatedEachDateTotalPrice = previousState;
        }
        return updatedEachDateTotalPrice;
    });
}


    let totalPriceForAllDay: number = 0;
    if(eachDateTotalPrice.length > 0){
        eachDateTotalPrice.forEach(function(eachDate: DateWithPriceInterface){
            totalPriceForAllDay = totalPriceForAllDay + eachDate.fullDayTotalPrice;
        });
    }

    useEffect(()=>{
        props.setTotalPriceOfRoom(totalPriceForAllDay);
    }, [totalPriceForAllDay])
    //props.setTotalPriceOfRoom(totalPriceForAllDay);

    
    const tableHeadingStyling = {
        fontWeight: 'bold',
        fontSize: '1.03rem',
        backgroundColor: '#92645B'
    }

    const totalStyling = {
        fontWeight: 'bold'
    }

    
    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={tableHeadingStyling}>Date</TableCell>
                            <TableCell sx={tableHeadingStyling}>Time Slot</TableCell>
                            <TableCell sx={tableHeadingStyling} align="right">Room Basic Price</TableCell>
                            <TableCell sx={tableHeadingStyling} align="right">Equipments Total Price</TableCell>
                            <TableCell sx={tableHeadingStyling} align="right">Food Service Total Price</TableCell>
                            <TableCell sx={tableHeadingStyling} align="right">Total Price</TableCell>
                        </TableRow>
                    </TableHead>
                    {eventMeetingBookingDatesStringArrayList.map(function(eachDate){
                        return (
                            <PriceDetailsEachDate 
                                key={eachDate}
                                currentDate={eachDate} 
                                bookingDetailsEachDayInfo={bookingDetailsEachDayInfo}
                                onEachDateTotalPrice={getEachDateTotalPrice}
                            />
                        )
                    })}
                    <TableBody>
                        <TableRow>
                            <TableCell sx={totalStyling}>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell sx={totalStyling} align="right">{convertToINR(totalPriceForAllDay)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default PriceDetailsAllDates;