'use client'
import React, { useState, useEffect, useReducer, useCallback, useMemo } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';

import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary';

import { useAppDispatch, useAppSelector } from "@/redux store/hooks";
import { addNewBookingToDiningCart } from "@/redux store/features/Booking Features/diningBookingCartSlice";
import { getDiningEachDayPrice } from "@/redux store/features/Price Features/diningEachDayPriceSlice";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from '@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice';

import { convertDateTextToDate } from "@/functions/date";
import { diningSelectionErrorConstants } from "@/constant string files/diningSelectionErrorConstants";
import { DINING_AVAILABLE, INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants";
import { BOOKING_UNAVAILABLE_LOCKED } from '@/constant string files/apiErrorMessageConstants';
import { convertToINR } from '@/functions/currency';

import { Dining, DiningTiming, PriceList } from '@/interface/Dining Interface/hotelDiningInterface';
import { LoginUserDetails } from '@/redux store/features/Auth Features/loginUserDetailsSlice';
import { DiningWithDate, DateDetails, FoodCategoryDetails, DiningEachDayInfoRespone } from '@/interface/Dining Interface/eachDayDiningInfoInterface';
import { TableBookingCountDetails, DiningBookingDetails, DiningDetailsForCart } from '@/interface/Dining Interface/diningBookingInterface';
import { AddDiningCartApiResponse } from '@/interface/Dining Interface/diningCartApiResponse';
import { DiningAvailabilityCheckApiResponse } from '@/interface/Dining Interface/diningAvailabilityCheckApiResponse';


interface TableCountState {
    twoPersonTableCount: number;
    fourPersonTableCount: number;
    sixPersonTableCount: number;
}

interface TableAction {
    type: 'Increment' | 'Decrement';
    payload: {
        tableType: keyof TableCountState;
    };
}

interface IPropsDiningBookingComponent{
    diningRestaurantInfo: Dining;
}

const initialDiningTableCount: TableCountState = {
    twoPersonTableCount: 0,
    fourPersonTableCount: 0,
    sixPersonTableCount: 0
}


function diningTableCounterReducer(state: TableCountState, action: TableAction): TableCountState{
    
    switch (action.type) {
        case 'Increment':
            return {
                ...state,
                [action.payload.tableType]: state[action.payload.tableType] + 1
            }
        case 'Decrement':
            return {
                ...state,
                [action.payload.tableType]: state[action.payload.tableType] - 1
            }
        default:
            return state;
    }
}


function DiningBookingComponentFunctionalComponent(props: IPropsDiningBookingComponent){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserIdDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    const [diningTableCountState, diningTableCountDispatch] = useReducer(diningTableCounterReducer, initialDiningTableCount);
    const tableCountTwoPerson: number = diningTableCountState.twoPersonTableCount;
    const tableCountFourPerson: number = diningTableCountState.fourPersonTableCount;
    const tableCountSixPerson: number = diningTableCountState.sixPersonTableCount;

    useEffect(()=>{
        dispatch(getDiningEachDayPrice());
        fetchDiningEachDayData();
    },[]);

    const diningRestaurantInfo: Dining = props.diningRestaurantInfo;
    const diningRestaurantTitle: string = diningRestaurantInfo.diningAreaTitle;
    const diningPath: string = diningRestaurantInfo.diningPath;

    const [diningEachDayInfo, setDiningEachDayInfo] = useState<DiningWithDate | null>(null);
    // console.log(diningEachDayInfo)

    const todayDate: string = new Date().toISOString().split("T")[0];
    const today: Date = new Date(todayDate);

    // let diningBookingLastDateString = '9999-12-31';
    // if(diningEachDayInfo != null){
    //     diningBookingLastDateString = getDiningBookingLastDate(diningEachDayInfo);
    // }
    const diningBookingLastDateString: string | null = useMemo(function(){
        if (diningEachDayInfo != null) {
            return getDiningBookingLastDate(diningEachDayInfo);
        }
        return '9999-12-31';
    }, [diningEachDayInfo]);
    if(diningBookingLastDateString == null){
        throw new Error("Null value of diningBookingLastDateString");
    }
    const diningBookingLastDate: Date = new Date(diningBookingLastDateString);

    const [tableBookingDate, setTableBookingDate] = useState<Date>(today);
    const [noOfGuests, setNoOfGuests] = useState<number>(1);
    const [mealType, setMealType] = useState<string>("");
    const [tableBookingTime, setTableBookingTime] = useState<string>('');

    const [showValidateBlock, setShowValidateBlock] = useState<boolean>(true);
    const [isDiningSlotAvailable, setIsDiningSlotAvailable] = useState<boolean>(false);
    const [diningSlotUnavailableMessage, setDiningSlotUnavailableMessage] = useState<string>('');
    const [validateErrorMessgae, setValidateErrorMessgae] = useState<string>('');
    const [showAddCartBlock, setAddCartBlock] = useState<boolean>(false);
    const [addedToCart, setAddedToCart] = useState<boolean>(false);
    const [isDataSavingToCart, setIsDataSavingToCart] = useState<boolean>(false);
    const [bookingDetailsForCart, setBookingDetailsForCart] = useState<DiningBookingDetails | null>(null);

    // let priceForBooking = 0;
    // if(bookingDetailsForCart != null && diningEachDayInfo != null){
    //     priceForBooking = getTableBookingPriceForCart(diningEachDayInfo, bookingDetailsForCart)
    // }
    const priceForBooking: number = useMemo(function(){
        if(bookingDetailsForCart != null && diningEachDayInfo != null){
            return getTableBookingPriceForCart(diningEachDayInfo, bookingDetailsForCart)
        }
        return 0;
    }, [diningEachDayInfo, bookingDetailsForCart]);

    // const mealTypeTimeDetails = (diningRestaurantInfo.timing).find(function(element){
    //     return (element.foodCategory === mealType)
    // });
    const mealTypeTimeDetails: DiningTiming | undefined = useMemo(function(){
        const specificMealTimeDetails = (diningRestaurantInfo.timing).find(function(element: DiningTiming){
            return (element.foodCategory === mealType)
        });
        return specificMealTimeDetails;
    }, [mealType]);


    async function fetchDiningEachDayData(): Promise<void>{
        try{
            const response: Response = await fetch('/api/hotel-booking-information/dining-information/each-day-information/');
            const data: DiningEachDayInfoRespone = await response.json(); 
            const allDiningInfo = data.diningWithDate;
            const specificDiningInfoEachDay: DiningWithDate | undefined = fetchSpecificDiningEachDayData(allDiningInfo, diningRestaurantTitle);
            if(!specificDiningInfoEachDay){
                throw new Error("Missing specificDiningInfoEachDay");
            }
            setDiningEachDayInfo(specificDiningInfoEachDay);
        }
        catch(error){
            console.log(error);
        }
    }

    function fetchSpecificDiningEachDayData(allDiningInfo: DiningWithDate[], diningTitle: string): DiningWithDate | undefined{
        const specificDiningInfo: DiningWithDate | undefined = allDiningInfo.find(function(eachDining: DiningWithDate){
            return (eachDining.diningTitle == diningTitle);
        });
        return specificDiningInfo;
    }


    function getDiningBookingLastDate(diningInfoEachDay: DiningWithDate): string | null{
        const dateDetailsForDining: DateDetails[] = diningInfoEachDay.dateDetails;
        if(!dateDetailsForDining.length){
            return null;
        }
        dateDetailsForDining.sort(function(d1, d2){
            const date1 = new Date(d1.date).getTime();
            const date2 = new Date(d2.date).getTime();
            return date2 - date1;
        });

        let lastDate: string | null;
        if (dateDetailsForDining[0] && dateDetailsForDining[0].date) {
            const latestDate = new Date(dateDetailsForDining[0].date);
            lastDate = latestDate.toISOString().split("T")[0];
        } else {
            lastDate = null;
        }
        return lastDate;
    }

    function editDetailsBtnClickHandler(){
        setShowValidateBlock(true);
        setAddCartBlock(false);
    }

    function handleDateChange(value: Date | [Date | null, Date | null] | null): void {
        if (value instanceof Date) {
            setTableBookingDate(value);
        } else if (Array.isArray(value) && value[0] instanceof Date) {
            setTableBookingDate(value[0]);
        }
    }
    


    function tableIncrementDecrementCounter(tableType: 'twoPersonTableCount' | 'fourPersonTableCount' | 'sixPersonTableCount', counterButtonType: 'Increment' | 'Decrement'){
        diningTableCountDispatch({ type: counterButtonType, payload: { tableType } });
    }

    function getTableBookingPriceForCart(diningInfoEachDay: DiningWithDate, bookingDetails: DiningBookingDetails): number {
        let tableBookingDateString: string;
    
        // Always convert Date to string, then use convertDateTextToDate
        if (bookingDetails.tableBookingDate instanceof Date) {
            tableBookingDateString = convertDateTextToDate(bookingDetails.tableBookingDate.toString());
        } else {
            tableBookingDateString = convertDateTextToDate(bookingDetails.tableBookingDate);
        }
    
        const mealBookingType = bookingDetails.mealType;
    
        const twoPersonTableCount = bookingDetails.tableBookingCountDetails.tableCountTwoPerson;
        const fourPersonTableCount = bookingDetails.tableBookingCountDetails.tableCountFourPerson;
        const sixPersonTableCount = bookingDetails.tableBookingCountDetails.tableCountSixPerson;

        const diningDetailsForBookingDate: DateDetails | undefined = diningInfoEachDay.dateDetails.find((eachDate: DateDetails) => {
            const eachDateString = new Date(eachDate.date).toISOString().split("T")[0];
            return eachDateString === tableBookingDateString;
        });
    
        if (!diningDetailsForBookingDate) {
            throw new Error("Missing diningDetailsForBookingDate");
        }
    
        const bookingFoodCategoryDetails: FoodCategoryDetails | undefined = diningDetailsForBookingDate.foodCategoryDetails.find(function(eachCategory: FoodCategoryDetails) {
            return eachCategory.currentFoodCategory === mealBookingType;
        });
    
        if (!bookingFoodCategoryDetails) {
            throw new Error("Missing bookingFoodCategoryDetails");
        }
    
        const priceListOnBookingDateCategory: PriceList = bookingFoodCategoryDetails.currentFoodCategoryPriceList;
        
        const totalPriceForTwo: number = priceListOnBookingDateCategory.priceEachTableForTwoPerson * twoPersonTableCount;
        const totalPriceForFour: number = priceListOnBookingDateCategory.priceEachTableForFourPerson * fourPersonTableCount;
        const totalPriceForSix: number = priceListOnBookingDateCategory.priceEachTableForSixPerson * sixPersonTableCount;
        
        const totalPrice: number = totalPriceForTwo + totalPriceForFour + totalPriceForSix;
        return totalPrice;
    }
    


    async function validateClickHandlerFunction(){
        setIsDiningSlotAvailable(false);
        setDiningSlotUnavailableMessage('');
        const maxGuestForTableSelection = (2 * tableCountTwoPerson) + (4 * tableCountFourPerson) + (6 * tableCountSixPerson);
        if(tableBookingDate != null && noOfGuests >= 1 && mealType != '' && tableBookingTime !=''){
            if(maxGuestForTableSelection >= noOfGuests){
                setValidateErrorMessgae('');
                setShowValidateBlock(false);
                setAddCartBlock(true);
                const tableBookingCountDetails: TableBookingCountDetails  = {
                    tableCountTwoPerson,
                    tableCountFourPerson,
                    tableCountSixPerson
                }
                const bookingDetails: DiningBookingDetails = {
                    diningRestaurantTitle,
                    tableBookingDate,
                    noOfGuests,
                    mealType,
                    tableBookingTime,
                    tableBookingCountDetails
                }
                setBookingDetailsForCart(bookingDetails);
                try {
                    const response: Response = await fetch(`/api/add-cart-availability-check/dining/`, {
                        method: 'POST',
                        body: JSON.stringify(bookingDetails),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                    const data: DiningAvailabilityCheckApiResponse = await response.json();
                    if('message' in data){
                        if(data.message === DINING_AVAILABLE){
                            setIsDiningSlotAvailable(true);
                            setBookingDetailsForCart(bookingDetails);
                        }
                    }
                    if('errorMessage' in data){
                        if(data.errorMessage != ''){
                            let errorMessage = data.errorMessage;
                            if(data.errorMessage === `${BOOKING_UNAVAILABLE_LOCKED.DINING_TABLE_UNAVAILABLE}.`){
                                errorMessage = errorMessage + ` Available slots are for 2 person -> ${data.availableTableCountTwoPerson} tables, 4 person -> ${data.availableTableCountFourPerson} tables, 6 person -> ${data.availableTableCountSixPerson} tables`;
                            }
                            setDiningSlotUnavailableMessage(errorMessage);
                        }
                    }
                } 
                catch (error) {
                    console.log(error);    
                }
            }
            else if(maxGuestForTableSelection < noOfGuests){
                setValidateErrorMessgae(diningSelectionErrorConstants.INSUFFICIENT_TABLES_SELECTED);
            }
        }
        else if(tableBookingDate == null && noOfGuests < 1 && mealType == '' && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_MEAL_TYPE_BOOKING_TIME_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(noOfGuests < 1 && mealType == '' && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.MEAL_TYPE_BOOKING_TIME_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(tableBookingDate == null && mealType == '' && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_MEAL_TYPE_BOOKING_TIME_REQUIRED);
        }
        else if(tableBookingDate == null && noOfGuests < 1 && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_BOOKING_TIME_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(tableBookingDate == null && noOfGuests < 1 && mealType == ''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_MEAL_TYPE_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(tableBookingDate == null && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_BOOKING_TIME_REQUIRED);
        }
        else if(tableBookingDate == null && noOfGuests < 1){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(tableBookingDate == null && mealType ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_MEAL_TYPE_REQUIRED);
        }
        else if(mealType == '' && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.MEAL_TYPE_BOOKING_TIME_REQUIRED);
        }
        else if(noOfGuests < 1 && tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.BOOKING_TIME_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(noOfGuests < 1 && mealType == ''){
            setValidateErrorMessgae(diningSelectionErrorConstants.MEAL_TYPE_REQUIRED_GUEST_NOT_LESS_THAN_ONE);
        }
        else if(tableBookingDate == null){
            setValidateErrorMessgae(diningSelectionErrorConstants.DINING_DATE_REQUIRED);
        }
        else if(noOfGuests < 1){
            setValidateErrorMessgae(diningSelectionErrorConstants.GUEST_NOT_LESS_THAN_ONE);
        }
        else if(mealType == ''){
            setValidateErrorMessgae(diningSelectionErrorConstants.MEAL_TYPE_REQUIRED);
        }
        else if(tableBookingTime ==''){
            setValidateErrorMessgae(diningSelectionErrorConstants.TABLE_BOOKING_TIME_REQUIRED);
        }
    }

    const validateClickHandler = useCallback(validateClickHandlerFunction, [tableBookingDate, noOfGuests, mealType, tableBookingTime, tableCountTwoPerson, tableCountFourPerson, tableCountSixPerson]);

    
    function addCartClickHandlerFunction() {
        if (bookingDetailsForCart != null) {
            const diningBookingDetails = JSON.parse(JSON.stringify(bookingDetailsForCart)) as DiningBookingDetails;
            const tableBookDate: string | Date = bookingDetailsForCart.tableBookingDate;
            if(typeof tableBookDate == "string"){
                diningBookingDetails.tableBookingDate = convertDateTextToDate(tableBookDate).toString();
            }
            else if(tableBookDate instanceof Date){
                diningBookingDetails.tableBookingDate = convertDateTextToDate(tableBookDate.toISOString()).toString();
            }
            
            const diningDetailsForCart: DiningDetailsForCart = {
                diningCartId: Date.now(),
                ...diningBookingDetails,
                priceForBooking
            }
            setIsDataSavingToCart(true);
            if(loginUserIdDetails == null){
                dispatch(addNewBookingToDiningCart(diningDetailsForCart));
                setAddedToCart(true);
                setIsDataSavingToCart(false);
            }
            if(loginUserIdDetails !== null){
                addToCartDatabaseClickHandlerFunction(diningDetailsForCart);
            }
        }
    }

    async function addToCartDatabaseClickHandlerFunction(diningDetailsForCart: DiningDetailsForCart){
        try {
            if(loginUserIdDetails == null){
                throw new Error("Null value of loginUserIdDetails");
            }
            const loginUserId: string = loginUserIdDetails.userId;
            const response: Response = await fetch(`/api/add-cart/dining/${loginUserId}`, {
                method: 'POST',
                body: JSON.stringify(diningDetailsForCart),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data: AddDiningCartApiResponse = await response.json();
            if(response.status === 200){
                if('message' in data){
                    if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                        setAddedToCart(true);
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

    const addCartClickHandler = useCallback(addCartClickHandlerFunction, [dispatch, bookingDetailsForCart, priceForBooking]);

    function loginButtonClickHandler(event: React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        const loginPageCalledFrom = `Dining/ ${diningRestaurantTitle} Page`;
        const loginRedirectPage = `/dining/${diningPath}`;
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }


    return (
        <div className="m-0 mx-[2%] border border-[brown] p-[2%] bg-[beige]">
            <h3 className="text-center italic text-[1.2rem]">Reserve a Table</h3>

            <form>

                <label htmlFor="dining-date">
                    <div className="pt-[2%] pb-[0.7%] font-[Segoe UI] text-[rgb(78,78,78)] text-[1.1rem]">
                        Please Select Date of Dining: 
                    </div>
                    <DatePicker 
                        value={tableBookingDate} 
                        minDate={today}
                        maxDate={diningBookingLastDate}
                        format="dd/MM/y"
                        onChange={handleDateChange} 
                    />
                </label>

                <label htmlFor="no-of-people">
                    <div className="pt-[2%] pb-[0.7%] font-[Segoe UI] text-[rgb(78,78,78)] text-[1.1rem]">
                        Enter Number of People: 
                    </div>
                    <input 
                        id="no-of-people" 
                        type="number" 
                        min="1" 
                        value={noOfGuests}
                        onChange={(event)=>setNoOfGuests(Number(event.target.value))}
                    />
                </label>

                <label htmlFor="meal-type">
                    <div className="pt-[2%] pb-[0.7%] font-[Segoe UI] text-[rgb(78,78,78)] text-[1.1rem]">
                        Select Meal Type: 
                    </div>
                    <select id="meal-type" onChange={(event)=> setMealType(event.target.value)}>
                        <option value="">Please Select</option>
                        {(diningRestaurantInfo.timing).map(function(eachTime){
                            return (
                            <option key={eachTime.foodCategory} 
                                className="capitalize"
                                value={eachTime.foodCategory}
                            >
                                {eachTime.foodCategory}
                            </option>
                            )
                        })}
                    </select>
                </label>

                {mealTypeTimeDetails &&
                    <label htmlFor="meal-time">
                        <div className="pt-[2%] pb-[0.7%] font-[Segoe UI] text-[rgb(78,78,78)] text-[1.1rem]">
                            Select Meal Time: 
                        </div>
                        <div className="flex flex-col">
                        {(mealTypeTimeDetails.foodSlotTime).map(function(eachTime){
                                return (
                                    <div key={eachTime} className="m-[0.1%] h-[10%] w-[30%]">
                                        <input
                                            type="radio" 
                                            id={eachTime}
                                            name="meal-timing"
                                            className="relative h-full w-full cursor-pointer opacity-0"
                                            value={eachTime}
                                            checked={tableBookingTime === eachTime}
                                            onChange={(event)=> setTableBookingTime(event.target.value)}
                                        />
                                        <label
                                            htmlFor={eachTime}
                                            className={tableBookingTime === eachTime
                                                ? "bg-[lightskyblue] px-[6%] py-[3%] rounded-[7.5%] border border-gray-500"
                                                : "bg-[azure] rounded-[7.5%] border border-[blueviolet] px-[6%] py-[3%] text-black hover:bg-[lightcyan] hover:cursor-pointer"}
                                        >
                                            {eachTime}
                                        </label>
                                    </div>
                                )
                        })} 
                        </div> 
                    </label>
                }

                {mealTypeTimeDetails &&
                    <div className="mt-[5%]">
                        <p className="font-[Segoe UI] text-[rgb(78,78,78)] text-[1.1rem]">
                            Select Total Number of Tables
                        </p>
                        
                        <div className="my-[3%] text-[rgb(56,55,55)]">
                            <span className="pr-[2%] font-[Segoe UI]">
                                Tables for Two Guest: 
                            </span>
                            <button 
                                type="button" 
                                disabled={tableCountTwoPerson == 0} 
                                onClick={()=> tableIncrementDecrementCounter('twoPersonTableCount', 'Decrement')} 
                                className="p-[0.25%] text-[0.75rem]"
                            >
                                - 
                            </button>
                            <span className="px-[2%]"> {tableCountTwoPerson} </span>
                            <button 
                                type="button" 
                                onClick={()=> tableIncrementDecrementCounter('twoPersonTableCount', 'Increment')}
                                className="p-[0.25%] text-[0.75rem]"
                            > 
                                + 
                            </button>
                        </div>
                        
                        <div className="my-[3%] text-[rgb(56,55,55)]">
                            <span className="pr-[2%] font-[Segoe UI]">
                                Tables for Four Guest: 
                            </span>
                            <button 
                                type="button" 
                                disabled={tableCountFourPerson == 0} 
                                onClick={()=> tableIncrementDecrementCounter('fourPersonTableCount', 'Decrement')}
                                className="p-[0.25%] text-[0.75rem]"
                            > 
                                - 
                            </button>
                            <span className="px-[2%]"> {tableCountFourPerson} </span>
                            <button 
                                type="button" 
                                onClick={()=> tableIncrementDecrementCounter('fourPersonTableCount', 'Increment')}
                                className="p-[0.25%] text-[0.75rem]"
                            > 
                                + 
                            </button>
                        </div>
                        
                        <div className="my-[3%] text-[rgb(56,55,55)]">
                            <span className="pr-[2%] font-[Segoe UI]">
                                Tables for Six Guest: 
                            </span>
                            <button 
                                type="button" 
                                disabled={tableCountSixPerson == 0} 
                                onClick={()=> tableIncrementDecrementCounter('sixPersonTableCount', 'Decrement')}
                                className="p-[0.25%] text-[0.75rem]"
                            >
                                -
                            </button>
                            <span className="px-[2%]"> {tableCountSixPerson} </span>
                            <button 
                                type="button" 
                                onClick={()=> tableIncrementDecrementCounter('sixPersonTableCount', 'Increment')}
                                className="p-[0.25%] text-[0.75rem]"
                            > 
                                + 
                            </button>
                        </div>
                    </div>
                }

                
                {showValidateBlock &&
                    <div className="mt-[2%] flex flex-col items-center justify-center">
                        <Button onClick={validateClickHandler} variant="contained">Validate</Button>
                        {(validateErrorMessgae != '') &&
                        <p className="m-[1%] text-red-600 font-bold bg-[whitesmoke] p-[1%]">
                            {validateErrorMessgae}
                        </p>
                        }
                    </div>
                }

                {(!addedToCart && showAddCartBlock) &&
                    <div className="mt-[2%] flex flex-col items-center justify-center">

                        <div className="mb-[2%]">
                            <Button onClick={editDetailsBtnClickHandler} variant="contained">
                                Want to Edit Details
                            </Button>
                        </div>

                        {(!isDataSavingToCart && isDiningSlotAvailable) &&
                            <Button onClick={addCartClickHandler} variant="contained">
                                Add to Cart
                            </Button>
                        }

                        {(isDiningSlotAvailable && isDataSavingToCart) &&
                            <Button variant="contained" disabled>
                                Please Wait...
                            </Button>
                        }

                        {(!isDiningSlotAvailable && diningSlotUnavailableMessage !== '') &&
                            <div className="m-4 p-4 bg-red-50 border border-red-300 rounded">
                                <p className="text-center text-red-700 font-semibold text-[1.1rem]">
                                    {diningSlotUnavailableMessage}
                                </p>
                            </div>
                        }

                        {isDiningSlotAvailable &&
                            <div className="m-2.5 p-2.5 font-semibold bg-gray-100">
                                <p className="m-[1%] text-green-600 font-semibold p-[1%] bg-[whitesmoke]">
                                    The Selected Date and Time Slot is available.
                                </p>
                                <p className="m-[1%] text-green-600 font-semibold p-[1%] bg-[whitesmoke]">
                                    Please Pay {convertToINR(priceForBooking)} for Table Booking.
                                </p>
                            </div>
                        }
                    </div>
                }

                {addedToCart &&
                    <div className="m-[1%] flex items-center justify-center">
                        <p className="text-green-600 font-extrabold p-[1%] bg-white">
                            Dining Table Successfully Added to Cart
                        </p>
                    </div>
                }
            </form>

            {(loginUserIdDetails === null) &&
                <div className="mt-[4.5%] mb-[2.5%] flex items-center justify-center">
                    <Button onClick={loginButtonClickHandler} variant="contained">Proceed to Login</Button>
                </div>
            }
        </div>
    );

}


function DiningBookingComponent(props: IPropsDiningBookingComponent){
    const diningRestaurantInfo = props.diningRestaurantInfo;

    return (
        <ErrorBoundary>
            <DiningBookingComponentFunctionalComponent diningRestaurantInfo={diningRestaurantInfo} />
        </ErrorBoundary>
    );
}

export default DiningBookingComponent;