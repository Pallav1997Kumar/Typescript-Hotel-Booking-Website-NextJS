'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Link from 'next/link';

import { useAppSelector } from '@/redux store/hooks';
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";

import EventMeetingSingleDateCartComponent from "./Sub Events Cart Component/EventMeetingSingleDateCartComponent";
import EventMeetingMultipleDateContinuousCartComponent from "./Sub Events Cart Component/EventMeetingMultipleDateContinuousCartComponent";
import EventMeetingMultipleDateNonContinuousCartComponent from "./Sub Events Cart Component/EventMeetingMultipleDateNonContinuousCartComponent";

import { MultipleContinuousDatesBookingDetailsWithPriceInterface, NonContinuousMultipleDatesBookingDetailsInterface, SingleDateEventBookingDetailsWithPriceInterface } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';
import { EventMeetingRoomsInfoResponse, MeetingEventArea } from '@/interface/Event Meeting Interface/eventMeetingRoomInterface';



function EventMeetingRoomBookingCartComponent(){
    const allEventMeetingBookingCart: (NonContinuousMultipleDatesBookingDetailsInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface | SingleDateEventBookingDetailsWithPriceInterface)[] = useAppSelector((reduxStore) => reduxStore.eventMeetingCartSlice.eventMeetingCart);

    useEffect(()=>{
        fetchMeetingEventsRoomInformation();
    }, []);

    const [meetingEventsRooms, setMeetingEventsRooms] = useState<MeetingEventArea[]>([]);

    async function fetchMeetingEventsRoomInformation(){
        try {
            const response: Response = await fetch('/api/hotel-booking-information/events-meeting-room-information/');
            const meetingEventRoomInfo: EventMeetingRoomsInfoResponse = await response.json();
            const meetingEventsRoom: MeetingEventArea[] = meetingEventRoomInfo.meetingEventsRooms;
            setMeetingEventsRooms(meetingEventsRoom);
        } catch (error) {
            console.log(error);
        }
    }


    if(allEventMeetingBookingCart.length == 0){
        return (
            <div className="bg-sky-100 flex flex-col items-center justify-center py-20">
                <p className="uppercase underline text-2xl font-extrabold font-sans pb-5">
                    Event and Meeting Room Cart is Empty
                </p>
                <p className="uppercase underline text-2xl font-extrabold font-sans pb-5">
                    Click on Below Button to Add Items
                </p>
                <Link href={`/meetings-events/`} passHref>
                    <Button variant="contained">Event and Meeting Room Page</Button>
                </Link>
            </div>
        );
    }


    return (
        <div className="border border-black m-2">
            {(allEventMeetingBookingCart.length > 0) && allEventMeetingBookingCart.map(function(eachEventMeetingInCart: NonContinuousMultipleDatesBookingDetailsInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface | SingleDateEventBookingDetailsWithPriceInterface){
                const particularEventMeetingBasicInfo: MeetingEventArea | undefined = meetingEventsRooms.find(function(eachEventMeetingInHotel: MeetingEventArea){
                    return (eachEventMeetingInHotel.meetingEventAreaTitle == eachEventMeetingInCart.meetingEventsInfoTitle);
                });
                
                return (
                    <div key={eachEventMeetingInCart.eventCartId} className="flex flex-row p-4 m-4 border-4 border-gray-500">
                        
                        <div className="w-2/5">
                            {(particularEventMeetingBasicInfo) &&
                            <Image 
                                src={particularEventMeetingBasicInfo.meetingEventAreaImage} 
                                alt='meeting-event' 
                                width={400} 
                                height={200} 
                            />
                            }
                        </div>
                        
                        <div className="w-3/5 pl-4">
                            {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.SINGLE_DATE) &&
                                <EventMeetingSingleDateCartComponent eachEventMeetingInCart={eachEventMeetingInCart as SingleDateEventBookingDetailsWithPriceInterface}  />
                            }

                            {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) &&
                                <EventMeetingMultipleDateContinuousCartComponent eachEventMeetingInCart={eachEventMeetingInCart as MultipleContinuousDatesBookingDetailsWithPriceInterface} />
                            }
                            {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) &&
                                <EventMeetingMultipleDateNonContinuousCartComponent eachEventMeetingInCart={eachEventMeetingInCart as NonContinuousMultipleDatesBookingDetailsInterface} />
                            }
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default EventMeetingRoomBookingCartComponent;