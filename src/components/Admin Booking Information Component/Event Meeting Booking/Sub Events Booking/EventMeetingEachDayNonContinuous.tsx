'use client'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import React, { useState } from 'react';


import { getDateTextFromFullDate } from "@/functions/date";
import { getCommaAndSeperatedArray } from "@/functions/array";
import { convertToINR } from '@/functions/currency';
import { 
    wantFoodServiceConstants, 
    eventMeetingTimingConstants 
} from "@/constant string files/eventsMeetingRoomImportantConstants";


import { IDateBooking } from '@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse';
import { MeetingEventBookingTime } from '@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface';


const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '45%',
    width: 1000,
    bgcolor: 'background.paper',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #000',
    p: 2.5
}


interface IPropsEventMeetingEachDayNonContinuous {
    eachBookingDate: IDateBooking;
}

function EventMeetingEachDayNonContinuous(props: IPropsEventMeetingEachDayNonContinuous){

    const eachBookingDate: IDateBooking = props.eachBookingDate;

    const meetingEventBookingTime: MeetingEventBookingTime[] = 
        eachBookingDate.meetingEventBookingTime;


    const isMorningSlotBooked: boolean = 
        meetingEventBookingTime.includes(eventMeetingTimingConstants.MORNING_TIME);

    const isAfternoonSlotBooked: boolean =
        meetingEventBookingTime.includes(eventMeetingTimingConstants.AFTERNOON_TIME);

    const isEveningSlotBooked: boolean = 
        meetingEventBookingTime.includes(eventMeetingTimingConstants.EVENING_TIME);
    
    const isNightSlotBooked: boolean = 
        meetingEventBookingTime.includes(eventMeetingTimingConstants.NIGHT_TIME);
    
    const isMidNightSlotBooked: boolean = 
        meetingEventBookingTime.includes(eventMeetingTimingConstants.MID_NIGHT_TIME);


    let morningFoodItems: string[] = [];
    let afternoonFoodItems: string[] = [];
    let eveningFoodItems: string[] = [];
    let nightFoodItems: string[] = [];
    let midNightFoodItems: string[] = [];


    if(eachBookingDate.selectedMealsOnBookingDate){
        const mealsObj = eachBookingDate.selectedMealsOnBookingDate;
        const mealsMap = new Map(Object.entries(mealsObj));
        morningFoodItems = mealsMap.get("morning") ?? [];
        afternoonFoodItems = mealsMap.get("afternoon") ?? [];
        eveningFoodItems = mealsMap.get("evening") ?? [];
        nightFoodItems = mealsMap.get("night") ?? [];
        midNightFoodItems = mealsMap.get("midNight") ?? [];
    }


    function getFoodList(foodArrayList: string[]){
        const foodArray = foodArrayList.map(function(eachItem: string){
            return eachItem.split(" (")[0];
        })
        if(foodArray.length == 1){
            return foodArray[0];
        }
        else if(foodArray.length > 1){
            return getCommaAndSeperatedArray(foodArray);
        }
    }

    
    const [viewDateDetails, setViewDateDetails] = useState<boolean>(false);


    return (
        <div className="flex flex-row py-2">
            <p className="w-[70%]">
                <span className="font-semibold">Date: </span>                                            
                {getDateTextFromFullDate(eachBookingDate.meetingEventBookingDate.toString())}
            </p>
            <Button onClick={()=>setViewDateDetails(true)} variant="outlined">
                View Details
            </Button>
            <Modal
                open={viewDateDetails}
                onClose={()=>setViewDateDetails(false)}
            >
                <Box sx={boxStyle}>
                    <div>
                        
                        <p className="w-full p-2 font-sans">
                            <span className="font-semibold">Meeting / Event Seating Arrangement: </span>
                            {eachBookingDate.meetingEventSeatingArrangement}
                        </p>
                        
                        {(eachBookingDate.meetingEventBookingTime.length > 1) &&
                            <p className="w-full p-2 font-sans">
                                <span className="font-semibold">Meeting / Event Booking Time: </span>
                                {getCommaAndSeperatedArray(eachBookingDate.meetingEventBookingTime)}
                            </p>
                        }
                        
                        {(eachBookingDate.meetingEventBookingTime.length == 1) &&
                            <p className="w-full p-2 font-sans">
                                <span className="font-semibold">Meeting / Event Booking Time: </span>
                                {eachBookingDate.meetingEventBookingTime[0]}
                            </p>
                        }
                        
                        <p className="w-full p-2 font-sans">
                            <span className="font-semibold">Number of Guests Attending: </span>
                            {eachBookingDate.maximumGuestAttending}
                        </p>
                        
                        <p className="w-full p-2 font-sans">
                            <span className="font-semibold">Food Services Included: </span>
                            {eachBookingDate.wantFoodServices}
                        </p>
                        
                        <p className="w-full p-2 font-sans">
                            <span className="font-semibold">Price of Event/Meeting Room: </span>
                            {convertToINR(eachBookingDate.totalPriceEventMeetingRoom)}
                        </p>
                        
                        {(eachBookingDate.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && Object.hasOwn(eachBookingDate,'selectedMealsOnBookingDate')) &&
                            <div>
                                
                                {isMorningSlotBooked &&
                                    <div className="w-full p-2">
                                        <span className="font-semibold">Morning Food Items: </span>
                                        {(morningFoodItems.length == 0) && <span>N/A</span>}
                                        {(morningFoodItems.length > 0) && getFoodList(morningFoodItems)}
                                    </div>
                                }
                                
                                {isAfternoonSlotBooked &&
                                    <div className="w-full p-2">
                                        <span className="font-semibold">Afternoon Food Items: </span>
                                        {(afternoonFoodItems.length == 0) && <span>N/A</span>}
                                        {(afternoonFoodItems.length > 0) && getFoodList(afternoonFoodItems)}
                                    </div>
                                }
                                
                                {isEveningSlotBooked &&
                                    <div className="w-full p-2">
                                        <span className="font-semibold">Evening Food Items: </span>
                                        {(eveningFoodItems.length == 0) && <span>N/A</span>}
                                        {(eveningFoodItems.length > 0) && getFoodList(eveningFoodItems)}
                                    </div>
                                }
                                
                                {isNightSlotBooked &&
                                    <div className="w-full p-2">
                                        <span className="font-semibold">Night Food Items: </span>
                                        {(nightFoodItems.length == 0) && <span>N/A</span>}
                                        {(nightFoodItems.length > 0) && getFoodList(nightFoodItems)}
                                    </div>
                                }
                                
                                {isMidNightSlotBooked &&
                                    <div className="w-full p-2">
                                        <span className="font-semibold">Mid Night Food Items: </span>
                                        {(midNightFoodItems.length == 0) && <span>N/A</span>}
                                        {(midNightFoodItems.length > 0) && getFoodList(midNightFoodItems)}
                                    </div>
                                }

                            </div>
                        }
                        <Button onClick={()=>setViewDateDetails(false)} variant="outlined">
                            Ok
                        </Button>
                    </div>
                </Box>                                    
            </Modal>                                
        </div>
    );
}

export default EventMeetingEachDayNonContinuous;