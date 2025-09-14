'use client'
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from "@/redux store/hooks";
import { addNewBookingToEventMeetingCart } from "@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';

import { convertDateTextToDate, nextDay } from "@/functions/date";
import { multipleContinousDatesEventsMeetingSelectionErrorConstants } from "@/constant string files/eventsMeetingSelectionErrorConstants";
import { wantFoodServiceConstants, eventMeetingTimingConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";

import EventMeetingBookingsDetailsConfirmation from '@/components/Events Meeting Component/Common Components/EventMeetingBookingsDetailsConfirmation';
import PriceDetailsAllDates from './PriceDetailsAllDates';

import { IPropsEventsMeetingDateTypeBookingComponent, MultipleContinuousDatesBookingDetailsInterface, MultipleContinuousDatesBookingDetailsWithPriceInterface, SelectedMealsType } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';
import { DateDetailsForFoodPrice, EventTimingDetailsForFoodPrice } from '@/interface/Event Meeting Interface/eachDayEventMeetingInfoInterface';
import { LoginUserDetails } from '@/redux store/features/Auth Features/loginUserDetailsSlice';
import { FoodServicePricePerGuest, MeetingEventAreaSeatingCapacity } from '@/interface/Event Meeting Interface/eventMeetingRoomInterface';
import { AddEventMeetingRoomCartApiResponse } from '@/interface/Event Meeting Interface/eventMeetingCartApiResponse';
import { HotelEventMeetingRoomAvailabilityCheckApiResponse } from '@/interface/Event Meeting Interface/eventMeetingRoomAvailabilityCheckApiResponse';


function MultipleDateContinuousBookingComponent(props: IPropsEventsMeetingDateTypeBookingComponent) {

    const eachDayFoodPrice: DateDetailsForFoodPrice[] = useAppSelector((reduxStore) => reduxStore.eventMeetingEachDayFoodPriceSliceName.eachDayFoodPrice);
    const loginUserIdDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    const meetingEventsInfoTitle: string = props.meetingEventsInfoTitle;
    const meetingEventsSeatingInfo: MeetingEventAreaSeatingCapacity[] = props.meetingEventsSeatingInfo;
    const roomBookingDateType: string = props.roomBookingDateType;
    const meetingEventAreaPath: string = props.meetingEventAreaPath;

    const dispatch = useAppDispatch();
    const router = useRouter();


    const todayDate: string = new Date().toISOString().split("T")[0];
    const today: Date = new Date(todayDate);
    const tomorrow: Date = nextDay(new Date(today));

    const [meetingEventStartBookingDate, setMeetingEventStartBookingDate] = useState<Date>(today);
    const defaultEventEndDate: Date = nextDay(new Date(meetingEventStartBookingDate));
    const [meetingEventEndBookingDate, setMeetingEventEndBookingDate] = useState<Date>(defaultEventEndDate);
    const [meetingEventBookingTime, setMeetingEventBookingTime] = useState<string[]>([]);
    const [meetingEventSeatingArrangement, setMeetingEventSeatingArrangement] = useState<string>('');
    const [maximumGuestAttending, setMaximumGuestAttending] = useState<number>(1);
    const [wantFoodServices, setWantFoodServices] = useState<string>(wantFoodServiceConstants.WANT_FOOD_SERVICE_NO);

    const [selectedMeals, setSelectedMeals] = useState<SelectedMealsType>({
        midNight: [],
        morning: [],
        afternoon: [],
        evening: [],
        night: []
    });
    const [totalPriceEventMeetingRoom, setTotalPriceEventMeetingRoom] = useState<number>(0);

    const meetingEventDateFoodDetails: EventTimingDetailsForFoodPrice[] = fetchDateFoodDetails(eachDayFoodPrice);

    const [checkAvailabiltyBlockDisplay, setCheckAvailabiltyBlockDisplay] = useState<boolean>(true);
    const [incorrectInput, setIncorrectInput] = useState<boolean>(false);
    const [incorrectInputMessage, setIncorrectInputMessage] = useState<string>('');
    const [isRoomDetailsEditable, setRoomDetailsEditable] = useState<boolean>(true);
    const [isDataSavingToCart, setIsDataSavingToCart] = useState<boolean>(false);
    const [showSuccessfullyCartAddedBlock, setShowSuccessfullyCartAddedBlock] = useState<boolean>(false);
    const [bookingDetailsForCart, setBookingDetailsForCart] = useState<MultipleContinuousDatesBookingDetailsInterface | null>(null);
    const [isEventMeetingRoomAvailable, setIsEventMeetingRoomAvailable] = useState<boolean>(false);
    const [eventMeetingUnavailbleMessage, setEventMeetingUnavailbleMessage] = useState<string>('');


    const isMidNightChecked: boolean = meetingEventBookingTime.some(function (eachTime: string){
        return (eachTime === eventMeetingTimingConstants.MID_NIGHT_TIME)
    });

    const isMorningChecked: boolean = meetingEventBookingTime.some(function (eachTime: string){
        return (eachTime === eventMeetingTimingConstants.MORNING_TIME)
    });

    const isAfternoonChecked: boolean = meetingEventBookingTime.some(function (eachTime: string){
        return (eachTime === eventMeetingTimingConstants.AFTERNOON_TIME)
    });

    const isEveningChecked: boolean = meetingEventBookingTime.some(function (eachTime: string){
        return (eachTime === eventMeetingTimingConstants.EVENING_TIME)
    });

    const isNightChecked: boolean = meetingEventBookingTime.some(function (eachTime: string){
        return (eachTime === eventMeetingTimingConstants.NIGHT_TIME)
    });

    const onlyMeetingEventsSeatingInfoWhereSeatingPresent: MeetingEventAreaSeatingCapacity[] = meetingEventsSeatingInfo.filter(function(eachSeatingArrangement: MeetingEventAreaSeatingCapacity){
        return (eachSeatingArrangement.meetingEventAreaSeatingCapacity != 'N/A');
    });

    let showFoodOptions: boolean = false;
    if(wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && meetingEventStartBookingDate != null && meetingEventEndBookingDate != null && meetingEventBookingTime.length > 0){
        showFoodOptions = true;
    }

    const midNightFoodArray: string[] = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, eventMeetingTimingConstants.MID_NIGHT_TIME);
    const morningFoodArray: string[] = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, eventMeetingTimingConstants.MORNING_TIME);
    const afternoonFoodArray: string[] = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, eventMeetingTimingConstants.AFTERNOON_TIME);
    const eveningFoodArray: string[] = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, eventMeetingTimingConstants.EVENING_TIME);
    const nightFoodArray: string[] = getFoodListOfCurrentMeal(meetingEventDateFoodDetails, eventMeetingTimingConstants.NIGHT_TIME);

    let maximumGuestAllowedForSeatingArrangement: number = 0;
    if(meetingEventSeatingArrangement != ''){
        const selectedMeetingAreaInfo: MeetingEventAreaSeatingCapacity | undefined = meetingEventsSeatingInfo.find(function(eachSeatingArrangement: MeetingEventAreaSeatingCapacity){
            return meetingEventSeatingArrangement == eachSeatingArrangement.meetingEventAreaSeatingTitle;
        });
        if(selectedMeetingAreaInfo){
            maximumGuestAllowedForSeatingArrangement = Number(selectedMeetingAreaInfo.meetingEventAreaSeatingCapacity);
        }
    }

    useEffect(function(){
        const newDefaultEndDate = nextDay(new Date(meetingEventStartBookingDate));
        setMeetingEventEndBookingDate(newDefaultEndDate);
    }, [meetingEventStartBookingDate]);

    

    function fetchDateFoodDetails(eachDayFoodPrice: DateDetailsForFoodPrice[]): EventTimingDetailsForFoodPrice[]{
        const allDayFoodDetails: DateDetailsForFoodPrice[] = eachDayFoodPrice;
        let bookingDate: string = "";
        if(typeof meetingEventStartBookingDate == "string"){
            bookingDate = convertDateTextToDate(meetingEventStartBookingDate).toString();
        }
        else if(meetingEventStartBookingDate instanceof Date){
            bookingDate = convertDateTextToDate(meetingEventStartBookingDate.toISOString()).toString();
        }
        const bookingDateFoodDetails: DateDetailsForFoodPrice | undefined = allDayFoodDetails.find(function(eachDate){
            const eachDateString: string = eachDate.date.split("T")[0];
            return bookingDate == eachDateString;
        });
        if(!bookingDateFoodDetails){
            throw new Error("bookingDateFoodDetails is missing");
        }
        return (bookingDateFoodDetails.eventTimingDetails);
    }

    function getFoodListOfCurrentMeal(foodDetailsOfDate: EventTimingDetailsForFoodPrice[], foodCategory: string): string[] {
        const currentMealFoodDetail: EventTimingDetailsForFoodPrice | undefined = foodDetailsOfDate.find(function(eachFoodCategory: EventTimingDetailsForFoodPrice){
            return eachFoodCategory.meetingEventCurrentTiming == foodCategory;
        });
        if(!currentMealFoodDetail){
            throw new Error("currentMealFoodDetail is missing");
        }
        const currentMealFoodList:  FoodServicePricePerGuest[] = currentMealFoodDetail.meetingEventCurrentTimingFoodPrice;
        const currentMealFoodArray: string[] = currentMealFoodList.map(function(eachFoodList: FoodServicePricePerGuest){
            return eachFoodList.foodTitle
        })
        return currentMealFoodArray;
    }

    function meetingEventTimeChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked;
        const newClickedValue = event.target.value;
        if(checked){
            const updatedMeetingEventBookingTime = [...meetingEventBookingTime, newClickedValue]
            setMeetingEventBookingTime(updatedMeetingEventBookingTime);
        }
        else{
            const updatedMeetingEventBookingTime = meetingEventBookingTime.filter(function(eachTime){
                return (newClickedValue !== eachTime);
            });
            setMeetingEventBookingTime(updatedMeetingEventBookingTime);
        }
    }

    function meetingEventSeatingArrangementChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        setMeetingEventSeatingArrangement(event.target.value);
    }

    function mealSelectionChangeHandler(event: React.ChangeEvent<HTMLInputElement>, foodCategory: keyof SelectedMealsType) {
        const value: string = event.target.value;
        const checked: boolean = event.target.checked;
        if(checked){
            setSelectedMeals(function(previousState){
                return {
                    ...previousState,
                    [foodCategory]: [...previousState[foodCategory], value]
                }
            });
        }
        else{
            setSelectedMeals(function(previousState){
                return {
                    ...previousState,
                    [foodCategory]: (previousState[foodCategory]).filter(function(item){
                        return item !== value;
                    })
                }
            });
        }
    }

    function getTotalPriceOfRoom(totalPriceOfAllRooms: number){
        setTotalPriceEventMeetingRoom(totalPriceOfAllRooms);
    }

    function editDetailsClickHandler(){
        setRoomDetailsEditable(true);
        setCheckAvailabiltyBlockDisplay(true);
    }
    
    async function checkAvailabilityClickHandler(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        setCheckAvailabiltyBlockDisplay(false);
        if(meetingEventStartBookingDate != null && meetingEventEndBookingDate != null && meetingEventBookingTime.length > 0 && meetingEventSeatingArrangement != ''){
            if(maximumGuestAttending >= 1){
                if(maximumGuestAttending > maximumGuestAllowedForSeatingArrangement){
                    setIncorrectInput(true);
                    setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.GUEST_COUNT_GREATER_THAN_CAPACITY);
                }
                else if(maximumGuestAttending <= maximumGuestAllowedForSeatingArrangement){
                    if(wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_NO){
                        setIncorrectInput(false);
                        setIncorrectInputMessage('');
                        const bookingDetails: MultipleContinuousDatesBookingDetailsInterface = {
                            roomBookingDateType,
                            meetingEventsInfoTitle,
                            meetingEventStartBookingDate,
                            meetingEventEndBookingDate,
                            meetingEventBookingTime,
                            meetingEventSeatingArrangement,
                            maximumGuestAttending,
                            wantFoodServices
                        }

                        try {
                           const response: Response = await fetch("/api/add-cart-availability-check/event-meeting/multiple-dates-continous", {
                                method: "POST",
                                body: JSON.stringify(bookingDetails),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            });
                            const data: HotelEventMeetingRoomAvailabilityCheckApiResponse = await response.json();
                            if(response.status === 200){
                                setIsEventMeetingRoomAvailable(true);
                                setBookingDetailsForCart(bookingDetails);
                            }
                            if(response.status !== 200){
                                setIsEventMeetingRoomAvailable(false);
                                if('errorMessage' in data){
                                    setEventMeetingUnavailbleMessage(data.errorMessage);
                                }
                            } 
                        } 
                        catch (error) {
                            console.log(error);
                        }    
                    }
                    else if(wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES){
                        const midNightSelectedMeals: string[] = selectedMeals.midNight;
                        const morningSelectedMeals: string[] = selectedMeals.morning;
                        const afternoonSelectedMeals: string[] = selectedMeals.afternoon;
                        const eveningSelectedMeals: string[] = selectedMeals.evening;
                        const nightSelectedMeals: string[] = selectedMeals.night;
                        if(midNightSelectedMeals.length == 0 && morningSelectedMeals.length == 0 && afternoonSelectedMeals.length == 0 && eveningSelectedMeals.length == 0 && nightSelectedMeals.length == 0){
                            setIncorrectInput(true);
                            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.SELECT_FOOD_ITEM);
                        }
                        else if(midNightSelectedMeals.length > 0 || morningSelectedMeals.length > 0 || afternoonSelectedMeals.length > 0 || eveningSelectedMeals.length > 0 || nightSelectedMeals.length > 0){
                            setIncorrectInput(false);
                        setIncorrectInputMessage('');
                        const bookingDetails: MultipleContinuousDatesBookingDetailsInterface = {
                            roomBookingDateType,
                            meetingEventsInfoTitle,
                            meetingEventStartBookingDate,
                            meetingEventEndBookingDate,
                            meetingEventBookingTime,
                            meetingEventSeatingArrangement,
                            maximumGuestAttending,
                            wantFoodServices,
                            selectedMealsOnBookingDate: selectedMeals
                        }

                        try {
                           const response: Response = await fetch("/api/add-cart-availability-check/event-meeting/multiple-dates-continous", {
                                method: "POST",
                                body: JSON.stringify(bookingDetails),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            });
                            const data: HotelEventMeetingRoomAvailabilityCheckApiResponse = await response.json();
                            if(response.status === 200){
                                setIsEventMeetingRoomAvailable(true);
                                setBookingDetailsForCart(bookingDetails);
                            }
                            if(response.status !== 200){
                                setIsEventMeetingRoomAvailable(false);
                                if('errorMessage' in data){
                                    setEventMeetingUnavailbleMessage(data.errorMessage);
                                }
                            } 
                        } 
                        catch (error) {
                            console.log(error);
                        }
                        }
                    }
                }
            }
            else if(maximumGuestAttending < 1){
                setIncorrectInput(true);
                setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.GUEST_NOT_LESS_THAN_ONE);
            }
        }
        else if(meetingEventStartBookingDate == null && meetingEventEndBookingDate == null && meetingEventBookingTime.length == 0 && meetingEventSeatingArrangement == ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_START_DATE_BOOKING_END_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventStartBookingDate == null && meetingEventEndBookingDate == null && meetingEventBookingTime.length == 0){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_START_DATE_BOOKING_END_DATE_BOOKING_TIME_REQUIRED);
        }
        else if(meetingEventStartBookingDate == null && meetingEventEndBookingDate == null && meetingEventSeatingArrangement == ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_START_DATE_BOOKING_END_DATE_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventStartBookingDate == null && meetingEventBookingTime.length == 0 && meetingEventSeatingArrangement == ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_START_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventEndBookingDate == null && meetingEventBookingTime.length == 0 && meetingEventSeatingArrangement == ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_END_DATE_BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventBookingTime.length == 0 && meetingEventSeatingArrangement == ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventEndBookingDate == null && meetingEventSeatingArrangement == ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_END_DATE_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventEndBookingDate == null && meetingEventBookingTime.length == 0){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_END_DATE_BOOKING_TIME_REQUIRED);
        }
        else if(meetingEventStartBookingDate == null && meetingEventSeatingArrangement == ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_START_DATE_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventStartBookingDate == null && meetingEventBookingTime.length == 0){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_START_DATE_BOOKING_TIME_REQUIRED);
        }
        else if(meetingEventBookingTime.length == 0 && meetingEventSeatingArrangement == ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_TIME_SEATING_ARRANGEMENT_REQUIRED);
        }
        else if(meetingEventStartBookingDate == null){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_START_DATE_REQUIRED);
        }
        else if(meetingEventEndBookingDate == null){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_END_DATE_REQUIRED);
        }
        else if(meetingEventBookingTime.length == 0){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.BOOKING_TIME_REQUIRED);
        }
        else if(meetingEventSeatingArrangement === ''){
            setIncorrectInput(true);
            setIncorrectInputMessage(multipleContinousDatesEventsMeetingSelectionErrorConstants.SEATING_ARRANGEMENT_REQUIRED);
        }
    }

    function addCartClickHandler(){
        if(bookingDetailsForCart != null){
            const eventBookingDetails = JSON.parse(JSON.stringify(bookingDetailsForCart)) as MultipleContinuousDatesBookingDetailsInterface;

            if(typeof bookingDetailsForCart.meetingEventStartBookingDate == "string"){
                eventBookingDetails.meetingEventStartBookingDate = convertDateTextToDate(bookingDetailsForCart.meetingEventStartBookingDate).toString();
            }
            else if(bookingDetailsForCart.meetingEventStartBookingDate instanceof Date){
                eventBookingDetails.meetingEventStartBookingDate = convertDateTextToDate(bookingDetailsForCart.meetingEventStartBookingDate.toISOString()).toString();
            }

            if(typeof bookingDetailsForCart.meetingEventEndBookingDate == "string"){
                eventBookingDetails.meetingEventEndBookingDate = convertDateTextToDate(bookingDetailsForCart.meetingEventEndBookingDate).toString();
            }
            else if(bookingDetailsForCart.meetingEventEndBookingDate instanceof Date){
                eventBookingDetails.meetingEventEndBookingDate = convertDateTextToDate(bookingDetailsForCart.meetingEventEndBookingDate.toISOString()).toString();
            }
            
            const bookingDetailsWithPrice: MultipleContinuousDatesBookingDetailsWithPriceInterface = {
                eventCartId: Date.now(),
                ...eventBookingDetails,
                totalPriceEventMeetingRoom
            }
            setIsDataSavingToCart(true);
            console.log(bookingDetailsWithPrice);
            if(loginUserIdDetails === null){
                dispatch(addNewBookingToEventMeetingCart(bookingDetailsWithPrice));
                setShowSuccessfullyCartAddedBlock(true);
                setIsDataSavingToCart(false);
            }
            if(loginUserIdDetails !== null){
                addToDatabaseCartClickHandler(bookingDetailsWithPrice);
            }    
        }
    }

    async function addToDatabaseCartClickHandler(bookingDetailsWithPrice: MultipleContinuousDatesBookingDetailsWithPriceInterface) {
        try {
            if(loginUserIdDetails == null){
                throw new Error("loginUserIdDetails is null");
            }
            const loginUserId: string = loginUserIdDetails.userId;
            const response: Response = await fetch(`/api/add-cart/meeting-events/multiple-dates-continous/${loginUserId}`, {
                method: 'POST',
                body: JSON.stringify(bookingDetailsWithPrice),
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

    function handleMeetingEventStartBookingDateChange(value: Date | [Date | null, Date | null] | null): void {
        if (value instanceof Date) {
            setMeetingEventStartBookingDate(value);
        } else if (Array.isArray(value) && value[0] instanceof Date) {
            // If using range picker but only interested in start date
            setMeetingEventStartBookingDate(value[0]);
        }
    }

    function handleMeetingEventEndBookingDateChange(value: Date | [Date | null, Date | null] | null): void {
        if (value instanceof Date) {
            setMeetingEventEndBookingDate(value);
        } else if (Array.isArray(value) && value[0] instanceof Date) {
            // If using range picker but only interested in start date
            setMeetingEventEndBookingDate(value[0]);
        }
    }


    return (
        <div className="my-8 border border-blue-500 p-8">
            <form>
                
                {isRoomDetailsEditable &&
                <label htmlFor="meeting-event-start-date">
                    <div className="font-sans text-[1.05rem] mt-[2.5%] mb-[0.6%]">
                        Please Select Start Date of Meeting/Event: 
                    </div>
                    <DatePicker 
                        value={meetingEventStartBookingDate} 
                        minDate={today}
                        format="dd/MM/y"
                        onChange={handleMeetingEventStartBookingDateChange} 
                    />
                </label>
                }
                
                {(meetingEventStartBookingDate != null && isRoomDetailsEditable) &&
                <label htmlFor="meeting-event-end-date">
                    <div className="font-sans text-[1.05rem] mt-[2.5%] mb-[0.6%]">
                        Please Select End Date of Meeting/Event: 
                    </div>
                    <DatePicker 
                        value={meetingEventEndBookingDate} 
                        minDate={defaultEventEndDate}
                        format="dd/MM/y"
                        onChange={handleMeetingEventEndBookingDateChange} 
                    />
                </label>
                }
                
                {(meetingEventStartBookingDate == null && isRoomDetailsEditable) &&
                <label htmlFor="meeting-event-end-date">
                    <div className="font-sans text-[1.05rem] mt-[2.5%] mb-[0.6%]">
                        Please Select End Date of Meeting/Event: 
                    </div>
                    <DatePicker 
                        value={meetingEventEndBookingDate} 
                        minDate={tomorrow}
                        format="dd/MM/y"
                        onChange={handleMeetingEventEndBookingDateChange} 
                    />
                </label>
                }
                
                {isRoomDetailsEditable &&
                <label htmlFor="meeting-event-time">
                    <div className="font-sans text-[1.05rem] mt-[2.5%] mb-[0.6%]">
                        Please Select Time of Meeting/Event: 
                    </div>
                    
                    <input 
                        type="checkbox" 
                        id="morning" 
                        className="m-1"
                        name="meeting-event-time-check"
                        value={eventMeetingTimingConstants.MORNING_TIME}
                        checked={isMorningChecked}
                        onChange={meetingEventTimeChangeHandler}
                    />
                    <label className="mr-8" htmlFor="morning"> Morning (8AM - 12PM) </label>
                    
                    <input 
                        type="checkbox" 
                        id="afternoon" 
                        className="m-1"
                        name="meeting-event-time-check"
                        value={eventMeetingTimingConstants.AFTERNOON_TIME}
                        checked={isAfternoonChecked}
                        onChange={meetingEventTimeChangeHandler}
                    />
                    <label className="mr-8" htmlFor="afternoon"> Afternoon (12PM-4PM) </label>
                    
                    <input 
                        type="checkbox" 
                        id="evening" 
                        className="m-1"
                        name="meeting-event-time-check"
                        checked={isEveningChecked}
                        value={eventMeetingTimingConstants.EVENING_TIME}
                        onChange={meetingEventTimeChangeHandler}
                    />
                    <label className="mr-8" htmlFor="evening"> Evening (4PM-8PM) </label>
                    
                    <input
                        type="checkbox" 
                        id="night"
                        className="m-1" 
                        name="meeting-event-time-check"
                        value={eventMeetingTimingConstants.NIGHT_TIME}
                        checked={isNightChecked}
                        onChange={meetingEventTimeChangeHandler}
                    />
                    <label className="mr-8" htmlFor="night"> Night (8PM-12AM) </label>
                    
                    <input 
                        type="checkbox" 
                        id="mid-night" 
                        className="m-1"
                        name="meeting-event-time-check"
                        value={eventMeetingTimingConstants.MID_NIGHT_TIME}
                        checked={isMidNightChecked}
                        onChange={meetingEventTimeChangeHandler}
                    />
                    <label className="mr-8" htmlFor="mid-night"> Mid Night (12AM-4AM) </label>

                </label>
                }
                

                {isRoomDetailsEditable &&
                <label>
                    <div className="font-sans text-[1.05rem] mt-[2.5%] mb-[0.6%]">
                        Please Select Seating Arrangement of Meeting/Event: 
                    </div>
                    
                    <div className="flex flex-row">
                        {onlyMeetingEventsSeatingInfoWhereSeatingPresent.map(function(eachSeatingArrangement: MeetingEventAreaSeatingCapacity){
                            return (
                                <div className="w-[15%]" key={eachSeatingArrangement.meetingEventAreaSeatingTitle}>
                                    <input 
                                        type="radio"
                                        id={eachSeatingArrangement.meetingEventAreaSeatingTitle}
                                        className="m-1"
                                        name="seating-arrangement-type"
                                        value={eachSeatingArrangement.meetingEventAreaSeatingTitle}
                                        checked={meetingEventSeatingArrangement === eachSeatingArrangement.meetingEventAreaSeatingTitle}
                                        onChange={meetingEventSeatingArrangementChangeHandler}
                                    />
                                    <label className="pl-4" htmlFor={eachSeatingArrangement.meetingEventAreaSeatingTitle}>
                                        {eachSeatingArrangement.meetingEventAreaSeatingTitle}
                                    </label>
                                </div>
                            )
                        })}
                    </div>

                </label>
                }

                {isRoomDetailsEditable &&
                <label>
                    <div className="font-sans text-[1.05rem] mt-[2.5%] mb-[0.6%]">
                        Enter Maximum Number of Guest Attending the Function: 
                    </div>
                    <input 
                        type="number"
                        value={maximumGuestAttending}
                        min="1"
                        onChange={(event)=> setMaximumGuestAttending(Number(event.target.value))}
                    />
                </label>
                }

                {isRoomDetailsEditable &&
                <label>
                    <div className="font-sans text-[1.05rem] mt-[2.5%] mb-[0.6%]">
                        Do you want to include the Food Services? 
                    </div>
                    
                    <input 
                        type="radio" 
                        name="food-service-selector" 
                        id="yes-food" 
                        className="m-1"
                        value={wantFoodServiceConstants.WANT_FOOD_SERVICE_YES}
                        checked={wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES}
                        onChange={(event)=>setWantFoodServices(event.target.value)}
                    />
                    <label className="mr-12" htmlFor="yes-food">Yes</label>
                    
                    <input 
                        type="radio"
                        name="food-service-selector" 
                        id="no-food" 
                        className="m-1"
                        value={wantFoodServiceConstants.WANT_FOOD_SERVICE_NO}
                        checked={wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_NO}
                        onChange={(event)=>setWantFoodServices(event.target.value)}
                    />
                    <label className="mr-12" htmlFor="no-food">No</label>
                </label>
                }

                {(showFoodOptions && isRoomDetailsEditable) &&
                <label>
                    <div className="font-sans text-[1.05rem] mt-[2.5%] mb-[0.6%]">
                        Please Select Food Options
                    </div>
                    
                    {isMidNightChecked &&
                    <div className="flex flex-row w-full my-2">
                        <div className="font-bold w-[30%]">
                            Select Mid Night Meals: 
                        </div>
                        <div className="flex flex-row flex-wrap w-[80%]">
                            {midNightFoodArray.map(function(eachFoodItem: string) {
                                return (
                                    <div key={eachFoodItem} className="m-1">
                                        <input 
                                            type='checkbox' 
                                            id={eachFoodItem.replace(/ /g, '-')}
                                            value={eachFoodItem}
                                            className="m-1"
                                            name="mid-night-food-selection"
                                            checked={selectedMeals.midNight.includes(eachFoodItem)}
                                            onChange={(event) => mealSelectionChangeHandler(event, 'midNight')}
                                        />
                                        <label className="ml-2" htmlFor={eachFoodItem.replace(/ /g, '-')}>
                                            {eachFoodItem.split("(")[0]}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }
                    
                    {isMorningChecked &&
                    <div className="flex flex-row w-full my-2">
                        <div className="font-bold w-[30%]">
                            Select Morning Meals: 
                        </div>
                        <div className="flex flex-row flex-wrap w-[80%]">
                            {morningFoodArray.map(function(eachFoodItem: string){
                                return (
                                    <div key={eachFoodItem} className="m-1">
                                        <input 
                                            type='checkbox' 
                                            id={eachFoodItem.replace(/ /g, '-')}
                                            value={eachFoodItem}
                                            className="m-1"
                                            name="morning-food-selection"
                                            checked={selectedMeals.morning.includes(eachFoodItem)}
                                            onChange={(event) => mealSelectionChangeHandler(event, 'morning')}
                                        />
                                        <label className="ml-2" htmlFor={eachFoodItem.replace(/ /g, '-')}>
                                            {eachFoodItem.split("(")[0]}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }
                    
                    {isAfternoonChecked &&
                    <div className="flex flex-row w-full my-2">
                        <div className="font-bold w-[30%]">
                            Select Afternoon Meals: 
                        </div>
                        <div className="flex flex-row flex-wrap w-[80%]">
                            {afternoonFoodArray.map(function(eachFoodItem: string){
                                return (
                                    <div key={eachFoodItem} className="m-1">
                                        <input 
                                            type='checkbox' 
                                            id={eachFoodItem.replace(/ /g, '-')}
                                            value={eachFoodItem}
                                            className="m-1"
                                            name="afternoon-food-selection"
                                            checked={selectedMeals.afternoon.includes(eachFoodItem)}
                                            onChange={(event) => mealSelectionChangeHandler(event, 'afternoon')}
                                        />
                                        <label className="ml-2" htmlFor={eachFoodItem.replace(/ /g, '-')}>
                                            {eachFoodItem.split("(")[0]}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }
                    
                    {isEveningChecked &&
                    <div className="flex flex-row w-full my-2">
                        <div className="font-bold w-[30%]">
                            Select Evening Meals: 
                        </div>
                        <div className="flex flex-row flex-wrap w-[80%]">
                            {eveningFoodArray.map(function(eachFoodItem: string){
                                return (
                                    <div key={eachFoodItem} className="m-1">
                                        <input 
                                            type='checkbox' 
                                            id={eachFoodItem.replace(/ /g, '-')}
                                            value={eachFoodItem}
                                            className="m-1"
                                            name="evening-food-selection"
                                            checked={selectedMeals.evening.includes(eachFoodItem)}
                                            onChange={(event) => mealSelectionChangeHandler(event, 'evening')}
                                        />
                                        <label className="ml-2" htmlFor={eachFoodItem.replace(/ /g, '-')}>
                                            {eachFoodItem.split("(")[0]}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }
                    
                    {isNightChecked &&
                    <div className="flex flex-row w-full my-2">
                        <div className="font-bold w-[30%]">
                            Select Night Meals: 
                        </div>
                        <div className="flex flex-row flex-wrap w-[80%]">
                            {nightFoodArray.map(function(eachFoodItem: string){
                                return (
                                    <div key={eachFoodItem} className="m-1">
                                        <input 
                                            type='checkbox' 
                                            id={eachFoodItem.replace(/ /g, '-')}
                                            value={eachFoodItem}
                                            className="m-1"
                                            name="night-food-selection"
                                            checked={selectedMeals.night.includes(eachFoodItem)}
                                            onChange={(event) => mealSelectionChangeHandler(event, 'night')}
                                        />
                                        <label className="ml-2" htmlFor={eachFoodItem.replace(/ /g, '-')}>
                                            {eachFoodItem.split("(")[0]}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    }

                </label>
                }
                
                {(checkAvailabiltyBlockDisplay && isRoomDetailsEditable) && 
                    <div className="mt-3 flex items-center justify-center flex-col">
                        <Button variant="contained" onClick={checkAvailabilityClickHandler}>
                            Check Availability
                        </Button>
                    </div>
                }
                
                {(!checkAvailabiltyBlockDisplay && incorrectInput && isRoomDetailsEditable) &&
                    <div className="mt-3 flex items-center justify-center flex-col">
                        <p className="text-red-600 font-bold text-xl tracking-wide word-spacing-2 bg-yellow-100 p-2">
                            {incorrectInputMessage}
                        </p>
                        <br />
                        <Button onClick={()=> setCheckAvailabiltyBlockDisplay(true)} variant="contained">
                            Select Again
                        </Button>
                    </div>
                }
                
                {(!checkAvailabiltyBlockDisplay && isEventMeetingRoomAvailable  && !incorrectInput && isRoomDetailsEditable) &&
                    <div className="mt-3 flex items-center justify-center flex-col">
                        <p className="text-green-600 font-semibold text-xl bg-yellow-100 p-2">
                            The Meeting and Event Room is available in choosen Date and Time Slot.
                        </p>
                        <br />
                        <Button onClick={()=> setRoomDetailsEditable(false)} variant="contained">
                            Proceed
                        </Button>
                    </div>
                }
                
                {(!checkAvailabiltyBlockDisplay && !isEventMeetingRoomAvailable  && !incorrectInput && isRoomDetailsEditable) &&
                    <div className="mt-3 flex items-center justify-center flex-col">
                        <p className="text-red-600 font-bold tracking-wide p-1 text-sm">
                            {eventMeetingUnavailbleMessage}
                        </p>
                        <br />
                        <Button variant="contained" onClick={()=> setCheckAvailabiltyBlockDisplay(true)}>
                            Close
                        </Button>
                    </div>
                }
                
                {(!isRoomDetailsEditable && !showSuccessfullyCartAddedBlock) &&
                <div className="mt-3 flex items-center justify-center flex-col">
                    <p className="text-green-600 font-semibold text-lg bg-yellow-100 p-2">
                        Room Details added Successfully
                    </p>
                    <div className="bg-blanchedalmond p-3 mt-2">
                        <EventMeetingBookingsDetailsConfirmation 
                            bookingDetailsForCart={bookingDetailsForCart} 
                            totalPriceEventMeetingRoom = {totalPriceEventMeetingRoom}
                        />
                        <br />
                        <PriceDetailsAllDates 
                            bookingDetailsForCart={bookingDetailsForCart} 
                            setTotalPriceOfRoom={getTotalPriceOfRoom} 
                        />
                    </div>
                    <br />
                    <Button variant="contained" onClick={editDetailsClickHandler}>
                        Want to Edit details
                    </Button>
                    <br />

                    {!isDataSavingToCart &&
                    <Button variant="contained" onClick={addCartClickHandler}>
                        Add to Cart
                    </Button>
                    }

                    {isDataSavingToCart &&
                    <Button variant="contained" disabled>
                        Please Wait...
                    </Button>
                    }
                </div>
                }
                
                {showSuccessfullyCartAddedBlock &&
                <div className="flex items-center justify-center mt-4 bg-green-100 p-4 rounded-lg shadow-md">
                    <p className="text-green-600 font-semibold text-lg">
                        The Event/ Meeting Room Successfully Added to Cart 
                    </p>
                </div>
                }

            </form>

            {(loginUserIdDetails === null) &&
                <div className="flex items-center justify-center mt-6">
                    <Button onClick={loginButtonClickHandler} variant="contained">
                        Proceed to Login
                    </Button>
                </div>
            }

        </div>
    );
}

export default MultipleDateContinuousBookingComponent;