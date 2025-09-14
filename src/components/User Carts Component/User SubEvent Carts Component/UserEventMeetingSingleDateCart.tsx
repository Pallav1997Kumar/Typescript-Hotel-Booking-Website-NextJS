'use client'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import React, { useState } from 'react';

import { getDateTextFromFullDate } from "@/functions/date";
import { getCommaAndSeperatedArray } from "@/functions/array";
import { wantFoodServiceConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";
import { convertToINR } from '@/functions/currency';

import UserEventMeetingFoodServices from './Food Services Of Event/UserEventMeetingFoodServices';

import { IEventMeetingRoomSingleDateCartInformation } from '@/interface/Event Meeting Interface/eventMeetingCartApiResponse';


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


interface IPropsUserEventMeetingSingleDateCart {
    eachEventMeetingInCart: IEventMeetingRoomSingleDateCartInformation;
    onRemoveEventMeetingItemFromCart: (id: string, bookingType: string) => void;
}


function UserEventMeetingSingleDateCart(props: IPropsUserEventMeetingSingleDateCart){
    const eachEventMeetingInCart: IEventMeetingRoomSingleDateCartInformation = props.eachEventMeetingInCart;
    const [viewFoodItems, setViewFoodItems] = useState<boolean>(false);

    function removeEventMeetingSingleDateItemFromCart(id: string, bookingType: string){
        props.onRemoveEventMeetingItemFromCart(id, bookingType);
    }


    return (
        <div className="w-[100%] p-0">
            
            <p className="font-serif text-[1.3rem] font-bold mb-[1%]">
                Meeting / Event Area Name: {eachEventMeetingInCart.meetingEventsInfoTitle}
            </p>
            
            <p className="font-sans mb-[0.7%] capitalize">
                <span className="font-semibold">Meeting / Event Booking Date: </span>
                {getDateTextFromFullDate(eachEventMeetingInCart.meetingEventBookingDate.toString())}
            </p>
            
            {(eachEventMeetingInCart.meetingEventBookingTime.length > 1) &&
                <p className="font-sans mb-[0.7%] capitalize">
                    <span className="font-semibold">Meeting / Event Booking Time: </span>
                    {getCommaAndSeperatedArray(eachEventMeetingInCart.meetingEventBookingTime as string[])}
                </p>
            }
            
            {(eachEventMeetingInCart.meetingEventBookingTime.length == 1) &&
                <p className="font-sans mb-[0.7%] capitalize">
                    <span className="font-semibold">Meeting / Event Booking Time: </span>
                    {eachEventMeetingInCart.meetingEventBookingTime[0]}
                </p>
            }
            
            <p className="font-sans mb-[0.7%] capitalize">
                <span className="font-semibold">Meeting / Event Seating Arrangement: </span>
                {eachEventMeetingInCart.meetingEventSeatingArrangement}
            </p>
            
            <p className="font-sans mb-[0.7%] capitalize">
                <span className="font-semibold">Number of Guests Attending: </span>
                {eachEventMeetingInCart.maximumGuestAttending}
            </p>
            
            <p className="font-sans mb-[0.7%] capitalize">
                <span className="font-semibold">Food Services Included: </span>
                {eachEventMeetingInCart.wantFoodServices}
            </p>
            
            <p className="font-sans mb-[0.7%] capitalize">
                <span className="font-semibold">Total Price of Event/Meeting Room: </span>
                {convertToINR(eachEventMeetingInCart.totalPriceEventMeetingRoom)}
            </p>
            
            <div className="flex flex-row justify-center items-center mr-[3%]">
                
                <Button 
                    onClick={()=>removeEventMeetingSingleDateItemFromCart(eachEventMeetingInCart._id, eachEventMeetingInCart.roomBookingDateType)} 
                    variant="contained"
                >
                    Remove From Cart
                </Button>
                
                {(eachEventMeetingInCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES) &&
                <div className="ml-[2%]">
                    <Button onClick={()=>setViewFoodItems(true)} variant="outlined">View Food Items</Button>
                    <Modal
                        open={viewFoodItems}
                        onClose={()=>setViewFoodItems(false)}
                    >
                        <Box sx={boxStyle}>
                            <UserEventMeetingFoodServices eachEventMeetingInCart={eachEventMeetingInCart} />
                            <Button onClick={()=>setViewFoodItems(false)} variant="contained">Ok</Button>
                        </Box>
                    </Modal>
                </div>
                }

            </div>
        </div>
    );
}

export default UserEventMeetingSingleDateCart;