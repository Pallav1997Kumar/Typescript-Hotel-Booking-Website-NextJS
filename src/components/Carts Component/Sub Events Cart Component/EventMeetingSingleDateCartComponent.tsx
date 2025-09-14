'use client'
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { useAppDispatch } from "@/redux store/hooks";
import { deleteParticularBookingFromEventMeetingCart } from "@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice";

import { getDateTextFromFullDate } from "@/functions/date";
import { getCommaAndSeperatedArray } from "@/functions/array";
import { wantFoodServiceConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";
import { convertToINR } from '@/functions/currency';

import EventMeetingFoodServices from "./Food Services Of Event/EventMeetingFoodServices";

import { SingleDateEventBookingDetailsWithPriceInterface } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';


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


interface IPropsEventMeetingSingleDateCartComponent {
    eachEventMeetingInCart: SingleDateEventBookingDetailsWithPriceInterface;
}


function EventMeetingSingleDateCartComponent(props: IPropsEventMeetingSingleDateCartComponent){

    const eachEventMeetingInCart: SingleDateEventBookingDetailsWithPriceInterface = props.eachEventMeetingInCart;

    const [viewFoodItems, setViewFoodItems] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    function removeCartHandler(eventCartId: number){
        dispatch(deleteParticularBookingFromEventMeetingCart(eventCartId));
    }


    return (
        <div>
            
            <p className="font-serif text-lg font-bold mb-2">
                Meeting / Event Area Name: {eachEventMeetingInCart.meetingEventsInfoTitle}
            </p>
            
            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Meeting / Event Booking Date: </span>
                {getDateTextFromFullDate(typeof eachEventMeetingInCart.meetingEventBookingDate === 'string' ? eachEventMeetingInCart.meetingEventBookingDate : eachEventMeetingInCart.meetingEventBookingDate.toISOString())}
            </p>
            
            {(eachEventMeetingInCart.meetingEventBookingTime.length > 1) &&
                <p className="font-sans mb-2 capitalize">
                    <span className="font-semibold">Meeting / Event Booking Time: </span>
                    {getCommaAndSeperatedArray(eachEventMeetingInCart.meetingEventBookingTime)}
                </p>
            }
            
            {(eachEventMeetingInCart.meetingEventBookingTime.length == 1) &&
                <p className="font-sans mb-2 capitalize">
                    <span className="font-semibold">Meeting / Event Booking Time: </span>
                    {eachEventMeetingInCart.meetingEventBookingTime[0]}
                </p>
            }
            
            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Meeting / Event Seating Arrangement: </span>
                {eachEventMeetingInCart.meetingEventSeatingArrangement}
            </p>
            
            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Number of Guests Attending: </span>
                {eachEventMeetingInCart.maximumGuestAttending}
            </p>

            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Food Services Included: </span>
                {eachEventMeetingInCart.wantFoodServices}
            </p>

            <p className="font-sans mb-2 capitalize">
                <span className="font-semibold">Total Price of Event/Meeting Room: </span>
                {convertToINR(eachEventMeetingInCart.totalPriceEventMeetingRoom)}
            </p>
            
            <div className="flex flex-row justify-center items-center mr-12">
                <Button onClick={()=>removeCartHandler(eachEventMeetingInCart.eventCartId)} variant="contained">
                    Remove From Cart
                </Button>
            
                {(eachEventMeetingInCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES) &&
                <div className="ml-4">
                    <Button onClick={()=>setViewFoodItems(true)} variant="outlined">View Food Items</Button>
                    <Modal
                        open={viewFoodItems}
                        onClose={()=>setViewFoodItems(false)}
                    >
                        <Box sx={boxStyle}>
                            <EventMeetingFoodServices eachEventMeetingInCart={eachEventMeetingInCart} />
                            <Button  onClick={()=>setViewFoodItems(false)} variant="contained">Ok</Button>
                        </Box>
                    </Modal>
                </div>
                }
            
            </div>
        </div>
    );
}

export default EventMeetingSingleDateCartComponent;