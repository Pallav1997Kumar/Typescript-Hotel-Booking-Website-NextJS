'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";

import EventMeetingSingleDateBookingInfo from "./Sub Events Booking/EventMeetingSingleDateBookingInfo";
import EventMeetingMultipleDateContinuousBookingInfo from "./Sub Events Booking/EventMeetingMultipleDateContinuousBookingInfo";
import EventMeetingMultipleDateNonContinuousBookingInfo from "./Sub Events Booking/EventMeetingMultipleDateNonContinuousBookingInfo";

import { IContinousMultipleDatesBookingInfoForCustomer, INonContinousMultipleDatesBookingInfoForCustomer, ISingleDateBookingInfoForCustomer } from '@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse';
import { ITransactionDetailsFrontend } from '@/interface/hotelCustomersInterface';
import { EventMeetingRoomsInfoResponse, MeetingEventArea } from '@/interface/Event Meeting Interface/eventMeetingRoomInterface';


interface IPropsEachEventMeetingBookingInfo {
    eachEventMeetingBookingInfo: ISingleDateBookingInfoForCustomer | IContinousMultipleDatesBookingInfoForCustomer | INonContinousMultipleDatesBookingInfoForCustomer;
    transactionDetails: ITransactionDetailsFrontend;
}


function EachEventMeetingBookingInfo(props: IPropsEachEventMeetingBookingInfo){

    const eachEventMeetingBookingInfo: ISingleDateBookingInfoForCustomer | IContinousMultipleDatesBookingInfoForCustomer | INonContinousMultipleDatesBookingInfoForCustomer = props.eachEventMeetingBookingInfo;
    const transactionDetails: ITransactionDetailsFrontend = props.transactionDetails;

    useEffect(()=>{
        fetchMeetingEventsRoomInformation();
    }, []);

    const [meetingEventsRooms, setMeetingEventsRooms] = useState<MeetingEventArea[]>([]);

    async function fetchMeetingEventsRoomInformation(): Promise<void> {
        try {
            const response: Response = await fetch('/api/hotel-booking-information/events-meeting-room-information/');
            const meetingEventRoomInfo: EventMeetingRoomsInfoResponse = await response.json();
            const meetingEventRoomInformation: MeetingEventArea[] = meetingEventRoomInfo.meetingEventsRooms;
            setMeetingEventsRooms(meetingEventRoomInformation);
        } catch (error) {
            console.log(error);
        }
    }

    const particularEventMeetingBasicInfo: MeetingEventArea | undefined = meetingEventsRooms.find(function(eachEventMeetingInHotel: MeetingEventArea){
        return (eachEventMeetingInHotel.meetingEventAreaTitle == eachEventMeetingBookingInfo.meetingEventsInfoTitle);
    });

    return (
        <div className="flex flex-row p-1 m-1 border-4 border-gray-500">
            
            <div className="w-2/5">
                {(particularEventMeetingBasicInfo != null) &&
                    <Image src={particularEventMeetingBasicInfo.meetingEventAreaImage} alt='meeting-event' width={430} height={210} />
                }
            </div>
            

            {(eachEventMeetingBookingInfo.roomBookingDateType == roomBookingDateTypeConstants.SINGLE_DATE) &&
                <EventMeetingSingleDateBookingInfo 
                    eachEventMeetingBookingInfo={eachEventMeetingBookingInfo} 
                    transactionDetails={transactionDetails} 
                />
            }

            {(eachEventMeetingBookingInfo.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) &&
                <EventMeetingMultipleDateContinuousBookingInfo 
                    eachEventMeetingBookingInfo={eachEventMeetingBookingInfo} 
                    transactionDetails={transactionDetails} 
                />
            }
            {(eachEventMeetingBookingInfo.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) &&
                <EventMeetingMultipleDateNonContinuousBookingInfo 
                    eachEventMeetingBookingInfo={eachEventMeetingBookingInfo} 
                    transactionDetails={transactionDetails} 
                />
            }
        </div>
    );
}

export default EachEventMeetingBookingInfo;