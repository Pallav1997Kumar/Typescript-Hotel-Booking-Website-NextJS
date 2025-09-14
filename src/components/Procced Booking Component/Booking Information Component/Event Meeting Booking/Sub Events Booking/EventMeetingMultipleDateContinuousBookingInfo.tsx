'use client'
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { getDateTextFromFullDate } from "@/functions/date";
import { getCommaAndSeperatedArray } from "@/functions/array";

import { wantFoodServiceConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";
import { convertToINR } from '@/functions/currency';

import EventMeetingFoodServices from "./Food Services Of Event/EventMeetingFoodServices";

import { IEventMeetingRoomContinousMultipleDatesCartInformation } from '@/interface/Event Meeting Interface/eventMeetingCartApiResponse';


interface IPropsEventMeetingMultipleDateContinuousBookingInfo {
    eachEventMeetingBookingInfo: IEventMeetingRoomContinousMultipleDatesCartInformation;
}


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


function EventMeetingMultipleDateContinuousBookingInfo(props: IPropsEventMeetingMultipleDateContinuousBookingInfo){

    const eachEventMeetingBookingInfo: IEventMeetingRoomContinousMultipleDatesCartInformation = props.eachEventMeetingBookingInfo;

    const [viewFoodItems, setViewFoodItems] = useState<boolean>(false);

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
            
            <div className="flex flex-row justify-center items-center mr-3">
                {(eachEventMeetingBookingInfo.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES) &&
                <div className="ml-2">
                    <Button onClick={()=>setViewFoodItems(true)} variant="outlined">
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
                </div>
                }
            </div>

        </div>
    );

}

export default EventMeetingMultipleDateContinuousBookingInfo;