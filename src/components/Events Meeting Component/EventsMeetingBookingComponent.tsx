'use client'
import React, { useState, useEffect } from 'react';

import SingleDateBookingComponent from "./Single Room Booking/SingleDateBookingComponent";
import MultipleDateContinuousBookingComponent from "./Multiple Date Continuous Booking/MultipleDateContinuousBookingComponent";
import MultipleDateNonContinuousBookingComponent from "./Multiple Date Noncontinuous Booking/MultipleDateNonContinuousBookingComponent";
import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary';

import { useAppDispatch } from "@/redux store/hooks";
import { getEventsFoodPrice } from "@/redux store/features/Price Features/Event Meeting Features/eachDayFoodPriceSlice";
import { getEventsEachDayPrice } from "@/redux store/features/Price Features/Event Meeting Features/eachDayInformationSlice";
import { getEventsSeatingArrangementPrice } from "@/redux store/features/Price Features/Event Meeting Features/eachDaySeatingArrangementSlice";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";

import { IPropsEventsMeetingBookingComponent } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';


function EventsMeetingBookingComponent(props: IPropsEventsMeetingBookingComponent) {
    return (
        <ErrorBoundary>
            <EventsMeetingBookingComponentFunctionalComponent 
                meetingEventsInfoTitle={props.meetingEventsInfoTitle} 
                meetingEventsSeatingInfo={props.meetingEventsSeatingInfo} 
                meetingEventAreaPath ={props.meetingEventAreaPath} 
            />
        </ErrorBoundary>
    );
}


function EventsMeetingBookingComponentFunctionalComponent(props: IPropsEventsMeetingBookingComponent) {
    const meetingEventsInfoTitle = props.meetingEventsInfoTitle;
    const meetingEventsSeatingInfo = props.meetingEventsSeatingInfo;
    const meetingEventAreaPath = props.meetingEventAreaPath;

    const [roomBookingDateType, setRoomBookingDateType] = useState("");

    const dispatch = useAppDispatch();

    useEffect(()=>{
        dispatch(getEventsFoodPrice());
        dispatch(getEventsEachDayPrice());
        dispatch(getEventsSeatingArrangementPrice());
    }, []);

    function roomBookingDateTypeChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        setRoomBookingDateType(event.target.value);
    }

    return(
        <div className="bg-orange-50 p-8">
            <h3 className="text-center text-2xl font-semibold mb-6">
                Book the Event and Meeting Room
            </h3>

            <form>
                <p className="font-medium text-base mb-2">
                    Please Select in which category of Date you want to Book the Event and Meeting Room
                </p>

                {/* Single Date */}
                <div className="mb-2">
                    <input 
                        id="single-date" 
                        type="radio" 
                        className="mr-2"
                        name="booking-date-type"
                        value={roomBookingDateTypeConstants.SINGLE_DATE}
                        checked={roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE}
                        onChange={roomBookingDateTypeChangeHandler}
                    />
                    <label htmlFor="single-date">Single Date  [eg. 12 Feb 2024]</label>
                </div>
                
                {/* Multiple Dates Non-Continuous */}
                <div className="mb-2">
                    <input 
                        id="multiple-date-non-continuous" 
                        type="radio" 
                        className="mr-2"
                        name="booking-date-type"
                        value={roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS}
                        checked={roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS}
                        onChange={roomBookingDateTypeChangeHandler}
                    />
                    <label htmlFor="multiple-date-non-continuous">Multiple Dates (Non Continuous)   [eg. 12 Feb 2024, 15 Feb 2024, 18 Feb 2024]</label>
                </div>

                {/* Multiple Dates Continuous */}
                <div className="mb-2">
                    <input 
                        id="multiple-date-continuous" 
                        type="radio" 
                        className="mr-2"
                        name="booking-date-type"
                        value={roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS}
                        checked={roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS}
                        onChange={roomBookingDateTypeChangeHandler}
                    />
                    <label htmlFor="multiple-date-continuous">Multiple Dates (Continuous Date)  [eg. 12 Feb 2024 - 18 Feb 2024]</label>
                </div>

            </form>


            <div className="mt-6">
                {(roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) &&
                    <SingleDateBookingComponent 
                        meetingEventsInfoTitle={meetingEventsInfoTitle} 
                        meetingEventsSeatingInfo={meetingEventsSeatingInfo} 
                        roomBookingDateType={roomBookingDateType}
                        meetingEventAreaPath={meetingEventAreaPath}
                    />
                }
                {(roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) &&
                    <MultipleDateContinuousBookingComponent 
                        meetingEventsInfoTitle={meetingEventsInfoTitle} 
                        meetingEventsSeatingInfo={meetingEventsSeatingInfo}
                        roomBookingDateType={roomBookingDateType} 
                        meetingEventAreaPath={meetingEventAreaPath}
                    />
                }
                {(roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) &&
                    <MultipleDateNonContinuousBookingComponent 
                        meetingEventsInfoTitle={meetingEventsInfoTitle} 
                        meetingEventsSeatingInfo={meetingEventsSeatingInfo} 
                        roomBookingDateType={roomBookingDateType}
                        meetingEventAreaPath={meetingEventAreaPath}
                    />
                }
            </div>
        </div>
    );
}

export default EventsMeetingBookingComponent;