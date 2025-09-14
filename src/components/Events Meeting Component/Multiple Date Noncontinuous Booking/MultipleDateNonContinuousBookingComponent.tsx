'use client'
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from "@/redux store/hooks";
import { addNewBookingToEventMeetingCart } from "@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';

import { getOnlyDate, getOnlyMonth, getOnlyYear, convertDateTextToDate } from "@/functions/date";
import { isAllElementsUniqueInArray } from "@/functions/array";
import { multipleNonContinousDatesEventsMeetingSelectionErrorConstants } from "@/constant string files/eventsMeetingSelectionErrorConstants";

import EachDateBookingComponent from "./EachDateBookingComponent";

import { IPropsEventsMeetingDateTypeBookingComponent, NonContinuousMultipleDatesBookingDetailsInterface, NonContinuousMultipleDatesDateBookingDetailsWithPrice } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';
import { LoginUserDetails } from '@/redux store/features/Auth Features/loginUserDetailsSlice';
import { MeetingEventAreaSeatingCapacity } from '@/interface/Event Meeting Interface/eventMeetingRoomInterface';
import { AddEventMeetingRoomCartApiResponse } from '@/interface/Event Meeting Interface/eventMeetingCartApiResponse';


function MultipleDateNonContinuousBookingComponent(props: IPropsEventsMeetingDateTypeBookingComponent) {

    const loginUserIdDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    const meetingEventsInfoTitle: string = props.meetingEventsInfoTitle;
    const meetingEventsSeatingInfo: MeetingEventAreaSeatingCapacity[] = props.meetingEventsSeatingInfo;
    const roomBookingDateType: string = props.roomBookingDateType;
    const meetingEventAreaPath: string = props.meetingEventAreaPath;

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [noOfDateForBooking, setNoOfDateForBooking] = useState<number>(2);
    const [noOfDateForEventBooking,setNoOfDateForEventBooking] = useState<number>(2);
    const [proceedErrorMessage, setProceedErrorMessage] = useState<string>('');
    const [allDatesBookingInfo, setAllDatesBookingInfo] = useState<NonContinuousMultipleDatesDateBookingDetailsWithPrice[]>([]);
    const [showValidateBlock, setShowValidateBlock] = useState<boolean>(true);
    const [showDateContainer, setShowDateContainer] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string>('');
    const [isDataSavingToCart, setIsDataSavingToCart] = useState<boolean>(false);
    const [showSuccessfullyCartAddedBlock, setShowSuccessfullyCartAddedBlock] = useState<boolean>(false);

    const isRoomAvailable = true;

    const dateNumberArray: number[] = [];
    for(let i = 1; i <= noOfDateForEventBooking; i++){
        dateNumberArray.push(i);
    }

    function proceedClickHandler(){
        if(noOfDateForBooking >= 2){
            setNoOfDateForEventBooking(noOfDateForBooking);
            setShowDateContainer(true);
            setProceedErrorMessage('');
        }
        else{
            setShowDateContainer(false);
            setProceedErrorMessage(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.INPUT_NOT_LESS_THAN_TWO);
        }
    }

    function validateClickHandler() {
        if(noOfDateForEventBooking == allDatesBookingInfo.length){
            const onlyDateFromAllDatesInfo: string[] = allDatesBookingInfo.map(function(eachInfo: NonContinuousMultipleDatesDateBookingDetailsWithPrice){
                const bookingdate: string | Date = eachInfo.meetingEventBookingDate;
                let bookingDateAsDate: Date = new Date();
                if (bookingdate instanceof Date) {
                    bookingDateAsDate = bookingdate;
                } else if (typeof bookingdate === 'string') {
                    bookingDateAsDate = new Date(bookingdate);
                } 
                let dateString = '';
                dateString = `${getOnlyDate(bookingDateAsDate)} ${getOnlyMonth(bookingDateAsDate)} ${getOnlyYear(bookingDateAsDate)}`;
                return dateString;
            });
            const isAllDatesUnique: boolean = isAllElementsUniqueInArray(onlyDateFromAllDatesInfo);
            if(isAllDatesUnique){
                setValidationError('');
                setShowValidateBlock(false);
            }
            else{
                setValidationError(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.MULTIPLE_SAME_DATES_CHOOSEN);
            }
        }
        else{
            setValidationError(multipleNonContinousDatesEventsMeetingSelectionErrorConstants.ALL_DATES_INPUT_NOT_CHOOSEN);
        }
        
        
    }

    function getRoomBookingInfo(newRoomBookingInfo: NonContinuousMultipleDatesDateBookingDetailsWithPrice) {
        const isSameDateNumberPresent: boolean = allDatesBookingInfo.some(function(eachInfo: NonContinuousMultipleDatesDateBookingDetailsWithPrice){
            return (eachInfo.dateNumber == newRoomBookingInfo.dateNumber)
        });
        if(isSameDateNumberPresent){
            const oldRoomBookingInfoDifferentDateNo: NonContinuousMultipleDatesDateBookingDetailsWithPrice[] = allDatesBookingInfo.filter(function(eachInfo: NonContinuousMultipleDatesDateBookingDetailsWithPrice){
                return (eachInfo.dateNumber != newRoomBookingInfo.dateNumber)
            });
            setAllDatesBookingInfo([...oldRoomBookingInfoDifferentDateNo, newRoomBookingInfo]);
        }
        else{
            setAllDatesBookingInfo([...allDatesBookingInfo, newRoomBookingInfo]);
        }        
    }

    function addCartHandler() {
        const allDatesBookingInformation = allDatesBookingInfo.map(function(eachDate: NonContinuousMultipleDatesDateBookingDetailsWithPrice){
            const eachDateInfo = JSON.parse(JSON.stringify(eachDate)) as NonContinuousMultipleDatesDateBookingDetailsWithPrice;
            if(typeof eachDate.meetingEventBookingDate == "string"){
                eachDateInfo.meetingEventBookingDate = convertDateTextToDate(eachDate.meetingEventBookingDate).toString();
            }
            else if(eachDate.meetingEventBookingDate instanceof Date){
                eachDateInfo.meetingEventBookingDate = convertDateTextToDate(eachDate.meetingEventBookingDate.toISOString()).toString();
            }
            return eachDateInfo;
        });
        let totalPriceOfAllDates: number = 0;
        allDatesBookingInformation.forEach(function(eachDate: NonContinuousMultipleDatesDateBookingDetailsWithPrice){
            totalPriceOfAllDates = totalPriceOfAllDates + eachDate.totalPriceEventMeetingRoom;
        });
        setIsDataSavingToCart(true);
        const bookingDetails: NonContinuousMultipleDatesBookingDetailsInterface = {
            eventCartId: Date.now(),
            roomBookingDateType,
            meetingEventsInfoTitle,
            totalPriceOfAllDates,
            allDatesBookingInformation
        }
        console.log(bookingDetails);
        if(loginUserIdDetails === null){
            dispatch(addNewBookingToEventMeetingCart(bookingDetails));
            setShowSuccessfullyCartAddedBlock(true);
            setIsDataSavingToCart(false);
        }
        if(loginUserIdDetails !== null){
            addToDatabaseCartHandler(bookingDetails);
        }
    }

    async function addToDatabaseCartHandler(bookingDetails: NonContinuousMultipleDatesBookingDetailsInterface) {
        try {
            if(loginUserIdDetails != null){
                const loginUserId: string = loginUserIdDetails.userId;
                const response: Response = await fetch(`/api/add-cart/meeting-events/multiple-dates-non-continous/${loginUserId}`, {
                    method: 'POST',
                    body: JSON.stringify(bookingDetails),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const data: AddEventMeetingRoomCartApiResponse = await response.json();
                if(response.status === 200){
                    if('message' in data){
                        if(data.message === 'Cart Information Successfully Added To Cart'){
                            setShowSuccessfullyCartAddedBlock(true);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            setIsDataSavingToCart(false);
        }
    }


    function loginButtonClickHandler(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        const loginPageCalledFrom: string = `Event Meeting Room/ ${meetingEventsInfoTitle} Page`;
        const loginRedirectPage: string = `/meetings-events/${meetingEventAreaPath}`;
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }


    return (
        <div className="my-16 border border-green-500 px-4 py-8">
            <form>

                <div className="flex flex-row">
                    <label htmlFor="no-of-date">
                        <div className="font-semibold text-[1.05rem] mt-6 mb-2">
                            Please Enter for How many Dates you want to Booking Event/Meeting Room
                        </div>
                    </label>
                    <input 
                        id="no-of-date" 
                        type="number"
                        min="2" 
                        className="bg-pink-200 mt-2 ml-16 p-1 border-none"
                        value={noOfDateForBooking} 
                        onChange={(event)=> setNoOfDateForBooking(Number(event.target.value))}
                    />
                </div>

                <div className="flex flex-col items-center justify-center mt-8">
                    {proceedErrorMessage != '' &&
                        <p className="text-orange-600 font-bold tracking-wide leading-tight p-1">
                            {proceedErrorMessage}
                        </p>
                    }
                    <Button onClick={proceedClickHandler}>Proceed</Button>
                </div>
                
                {showDateContainer &&
                    <div>
                        {dateNumberArray.map(function(eachDate){
                            return (
                                <EachDateBookingComponent 
                                    key={eachDate} 
                                    meetingEventsInfoTitle={meetingEventsInfoTitle} 
                                    meetingEventsSeatingInfo={meetingEventsSeatingInfo} 
                                    dateNumber={eachDate} 
                                    onGetRoomBookingInfo={getRoomBookingInfo}
                                />
                            )
                        })}
                    </div>
                }
                {(showValidateBlock && showDateContainer) &&
                    <div className="flex flex-col items-center justify-center mt-12">
                        <p className="text-orange-600 font-bold tracking-wide leading-tight p-1">
                            {validationError}
                        </p>
                        <br />
                        <Button onClick={validateClickHandler} variant="contained">
                            Validate the Choosen Date/Time
                        </Button>
                    </div>
                }
                {(!showValidateBlock && isRoomAvailable && !showSuccessfullyCartAddedBlock) &&
                    <div className="flex flex-col items-center justify-center mt-12">
                        <p className="text-green-600 font-medium tracking-wide leading-tight p-1">
                            The Meeting and Event Room is available in choosen Date and Time Slot.
                        </p>
                        <br />
                        
                        {!isDataSavingToCart &&
                        <Button onClick={addCartHandler} variant="contained">
                            Add to Cart
                        </Button>
                        }

                        {isDataSavingToCart &&
                        <Button variant="contained" disabled>
                            Please Wait
                        </Button>
                        }
                    </div>
                }
                {(!showValidateBlock && !isRoomAvailable) &&
                    <div className="flex flex-col items-center justify-center mt-12">
                        <p className="text-orange-600 font-bold tracking-wide leading-tight p-1">
                            The Meeting and Event Room is not available in choosen Date and Time Slot.
                        </p>
                        <br />
                        <Button variant="contained">Close</Button>
                    </div>
                }
                {showSuccessfullyCartAddedBlock &&
                <div className="flex items-center justify-center m-4">
                    <p className="text-green-600 font-semibold p-4 bg-gray-100">
                        The Event/ Meeting Room Successfully Added to Cart 
                    </p>
                </div>
                }
            </form>

            {(loginUserIdDetails === null) &&
                <div className="flex items-center justify-center mt-10">
                    <Button onClick={loginButtonClickHandler} variant="contained">
                        Proceed to Login
                    </Button>
                </div>
            }

        </div>
    );
}

export default MultipleDateNonContinuousBookingComponent;