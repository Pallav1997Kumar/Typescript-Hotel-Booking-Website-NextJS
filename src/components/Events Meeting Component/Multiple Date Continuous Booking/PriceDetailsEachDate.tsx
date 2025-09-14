'use client'
import React, { useState, useEffect } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import { useAppSelector } from "@/redux store/hooks";
import { getDateText } from "@/functions/date";
import { wantFoodServiceConstants, eventMeetingTimingConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";
import { convertToINR } from '@/functions/currency';

import EquipmentsPriceBreakup from '@/components/Events Meeting Component/Common Components/EquipmentsPriceBreakup';
import MealsPriceBreakup from '@/components/Events Meeting Component/Common Components/MealsPriceBreakup';

import { DateDetailsBasicPrice, DateDetailsForFoodPrice, EventTimingDetailsBasicPrice, EventTimingDetailsForFoodPrice, MeetingEventDetails } from '@/interface/Event Meeting Interface/eachDayEventMeetingInfoInterface';
import { EventMeetingPriceForSeatingArrangement, FoodServicePricePerGuest, PriceForEquipments, SeatingArrangement } from '@/interface/Event Meeting Interface/eventMeetingRoomInterface';
import { DateWithPriceInterface, FinalPriceList, MultipleContinuousDatesBookingDetailsEachDayInfoInterface, SeatingArrangementPriceList } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';


interface IPropsEachDatePriceDetails {
    currentDate: string;
    bookingDetailsEachDayInfo: MultipleContinuousDatesBookingDetailsEachDayInfoInterface;
    onEachDateTotalPrice: (dateWithPrice: DateWithPriceInterface) => void;
}


function PriceDetailsEachDate(props: IPropsEachDatePriceDetails){

    const eachDayFoodPrice: DateDetailsForFoodPrice[] = useAppSelector((reduxStore) => reduxStore.eventMeetingEachDayFoodPriceSliceName.eachDayFoodPrice);
    const eachDayInfomation: MeetingEventDetails[] = useAppSelector((reduxStore) => reduxStore.eventMeetingEachDayInformationSliceName.eachDayInfomation);
    const eachDaySeatingArrangement: EventMeetingPriceForSeatingArrangement[] = useAppSelector((reduxStore) => reduxStore.eventMeetingEachDaySeatingArrangementSliceName.eachDaySeatingArrangement);

    const currentDate: string = props.currentDate;
    const bookingDetailsEachDayInfo: MultipleContinuousDatesBookingDetailsEachDayInfoInterface = props.bookingDetailsEachDayInfo;
    
    const meetingEventAreaTitle = bookingDetailsEachDayInfo.meetingEventsInfoTitle;
    const meetingEventBookingSlots = bookingDetailsEachDayInfo.meetingEventBookingTime;
    const meetingEventSeatingArrangement = bookingDetailsEachDayInfo.meetingEventSeatingArrangement;
    const maximumGuestAttending = bookingDetailsEachDayInfo.maximumGuestAttending;

    if(!meetingEventAreaTitle){
        throw new Error("meetingEventAreaTitle is missing");
    }
    if(!meetingEventBookingSlots){
        throw new Error("meetingEventBookingSlots is missing");
    }
    if(!meetingEventSeatingArrangement){
        throw new Error("meetingEventSeatingArrangement is missing");
    }
    if(!maximumGuestAttending){
        throw new Error("maximumGuestAttending is missing");
    }

    const [fullDayTotalPriceCurrentDate, setFullDayTotalPriceCurrentDate] = useState(null);

    const basicPriceDetailsInformation: DateDetailsBasicPrice = fetchCurrentDateBasicPrice(eachDayInfomation);
    const seatingArrangementPriceInformation: SeatingArrangement = fetchCurrentRoomSeatingArrangementPrice(eachDaySeatingArrangement);
    const foodServicePriceInformation: DateDetailsForFoodPrice = fetchCurrentDayFoodServicePrice(eachDayFoodPrice);

    let isMorningSlotSelected: boolean = false;
    let isAfternoonSlotSelected: boolean = false;
    let isEveningSlotSelected: boolean = false;
    let isNightSlotSelected: boolean = false;
    let isMidNightSlotSelected: boolean = false;

    if(meetingEventBookingSlots){
        isMorningSlotSelected = meetingEventBookingSlots.includes(eventMeetingTimingConstants.MORNING_TIME);
        isAfternoonSlotSelected = meetingEventBookingSlots.includes(eventMeetingTimingConstants.AFTERNOON_TIME);
        isEveningSlotSelected = meetingEventBookingSlots.includes(eventMeetingTimingConstants.EVENING_TIME);
        isNightSlotSelected = meetingEventBookingSlots.includes(eventMeetingTimingConstants.NIGHT_TIME);
        isMidNightSlotSelected = meetingEventBookingSlots.includes(eventMeetingTimingConstants.MID_NIGHT_TIME);
    }

    const bookingDateEventArray: EventTimingDetailsBasicPrice[] = basicPriceDetailsInformation.eventTimingDetails;
    const morningSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, eventMeetingTimingConstants.MORNING_TIME);
    const afternoonSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, eventMeetingTimingConstants.AFTERNOON_TIME);
    const eveningSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, eventMeetingTimingConstants.EVENING_TIME);
    const nightSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, eventMeetingTimingConstants.NIGHT_TIME);
    const midNightSlotBasicPrice = getBasicPriceOfRoomForSlot(bookingDateEventArray, eventMeetingTimingConstants.MID_NIGHT_TIME);


    const priceList: PriceForEquipments = seatingArrangementPriceInformation.priceForEquipments;
    const priceOfEachSeat: number = priceList.priceForEachSeat;
    const totalPriceOfAllSeats: number = maximumGuestAttending * priceOfEachSeat;

    const finalPriceList: FinalPriceList = { 
        ...priceList, 
        totalPriceOfAllSeats 
    };
    if(Object.hasOwn(priceList, 'priceForEachCircularTable') && Object.hasOwn(priceList, 'noOfGuestInEachCircularTable')){
        const noOfGuestInEachCircularTable = priceList.noOfGuestInEachCircularTable;
        const priceForEachCircularTable = priceList.priceForEachCircularTable;
        if(noOfGuestInEachCircularTable && priceForEachCircularTable){
            const numberOfCircularTableRequired = Math.ceil(maximumGuestAttending/noOfGuestInEachCircularTable);
            const totalPriceOfAllCircularTables = priceForEachCircularTable * numberOfCircularTableRequired;
            finalPriceList.totalPriceOfAllCircularTables = totalPriceOfAllCircularTables;
            finalPriceList.numberOfCircularTableRequired = numberOfCircularTableRequired;
        }
    }
        
    const priceListNameArray: string[] = Object.keys(finalPriceList);
    const priceListArrayObj: SeatingArrangementPriceList[] = priceListNameArray.map(function(eachName: string){
        const eachPrice: SeatingArrangementPriceList = {};
        let propertyName =  eachName;
        propertyName = propertyName.replace(/([A-Z])/g, ' $1');
        propertyName = propertyName.charAt(0).toUpperCase() + propertyName.substr(1);
        eachPrice.priceNameProperty = propertyName;
        eachPrice.priceOfProperty = finalPriceList[eachName as keyof FinalPriceList];
        return eachPrice;
    });
    const seatingArrangementPriceList: SeatingArrangementPriceList[] = priceListArrayObj;
    //console.log(seatingArrangementPriceList);

    let totalPriceOfRoomAppliance = 0;
    seatingArrangementPriceList.forEach(function(eachPriceList) {
        const commonPriceIncludedForTotal = ['Price For Stage', 'Price For Projector', 'Price For Electrical Appliance', 'Total Price Of All Seats'];
        const specialPriceIncludedForTotal = ['Price For U Shape Table', 'Price Of Boardroom Table', 'Total Price Of All Circular Tables'];
        if(eachPriceList.priceNameProperty && eachPriceList.priceOfProperty){
            if(commonPriceIncludedForTotal.includes(eachPriceList.priceNameProperty) || specialPriceIncludedForTotal.includes(eachPriceList.priceNameProperty)){
                totalPriceOfRoomAppliance = totalPriceOfRoomAppliance + eachPriceList.priceOfProperty;
            }
        }
    });

    let morningSlotTotalFoodPrice: number = 0;
    let afternoonSlotTotalFoodPrice: number = 0;
    let eveningSlotTotalFoodPrice: number = 0;
    let nightSlotTotalFoodPrice: number = 0;
    let midNightSlotTotalFoodPrice: number = 0;

    let morningSlotTotalFoodPricePerGuest: number = 0;
    let afternoonSlotTotalFoodPricePerGuest: number = 0;
    let eveningSlotTotalFoodPricePerGuest: number = 0;
    let nightSlotTotalFoodPricePerGuest: number = 0;
    let midNightSlotTotalFoodPricePerGuest: number = 0;

    let selectedMorningMeals;
    let selectedAfternoonMeals;
    let selectedEveningMeals;
    let selectedNightMeals;
    let selectedMidNightMeals;
    
    const allMorningMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, eventMeetingTimingConstants.MORNING_TIME);
    const allAfternoonMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, eventMeetingTimingConstants.AFTERNOON_TIME);
    const allEveningMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, eventMeetingTimingConstants.EVENING_TIME);
    const allNightMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, eventMeetingTimingConstants.NIGHT_TIME);
    const allMidNightMealsInformation = getSpecificMealAllFoodService(foodServicePriceInformation, eventMeetingTimingConstants.MID_NIGHT_TIME);

    if(bookingDetailsEachDayInfo.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && Object.hasOwn(bookingDetailsEachDayInfo, 'selectedMealsOnBookingDate')){
        const mealsBookingDetails = bookingDetailsEachDayInfo.selectedMealsOnBookingDate;
        if(mealsBookingDetails){
            if(mealsBookingDetails.morning.length > 0){
                selectedMorningMeals = mealsBookingDetails.morning;
                morningSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, eventMeetingTimingConstants.MORNING_TIME, selectedMorningMeals);
                morningSlotTotalFoodPrice = morningSlotTotalFoodPricePerGuest * maximumGuestAttending;
            }
            if(mealsBookingDetails.afternoon.length > 0){
                selectedAfternoonMeals = mealsBookingDetails.afternoon;
                afternoonSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, eventMeetingTimingConstants.AFTERNOON_TIME, selectedAfternoonMeals);
                afternoonSlotTotalFoodPrice = afternoonSlotTotalFoodPricePerGuest * maximumGuestAttending;
            }
            if(mealsBookingDetails.evening.length > 0){
                selectedEveningMeals = mealsBookingDetails.evening;
                eveningSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, eventMeetingTimingConstants.EVENING_TIME, selectedEveningMeals);
                eveningSlotTotalFoodPrice = eveningSlotTotalFoodPricePerGuest * maximumGuestAttending;
            }
            if(mealsBookingDetails.night.length > 0){
                selectedNightMeals = mealsBookingDetails.night;
                nightSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, eventMeetingTimingConstants.NIGHT_TIME, selectedNightMeals);
                nightSlotTotalFoodPrice = nightSlotTotalFoodPricePerGuest * maximumGuestAttending;
            }
            if(mealsBookingDetails.midNight.length > 0){
                selectedMidNightMeals = mealsBookingDetails.midNight;
                midNightSlotTotalFoodPricePerGuest = getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation, eventMeetingTimingConstants.MID_NIGHT_TIME, selectedMidNightMeals);
                midNightSlotTotalFoodPrice = midNightSlotTotalFoodPricePerGuest * maximumGuestAttending;
            }
        }
    }


    let morningSlotTotalPrice: number = 0;
    let afternoonSlotTotalPrice: number = 0;
    let eveningSlotTotalPrice: number = 0;
    let nightSlotTotalPrice: number = 0;
    let midNightSlotTotalPrice: number = 0;
    let fullDayTotalPrice: number = 0;

    if(basicPriceDetailsInformation != null && seatingArrangementPriceInformation != null && foodServicePriceInformation != null){
        if(isMorningSlotSelected){
            morningSlotTotalPrice = morningSlotBasicPrice + totalPriceOfRoomAppliance + morningSlotTotalFoodPrice;
        }
        if(isAfternoonSlotSelected){
            afternoonSlotTotalPrice = afternoonSlotBasicPrice + totalPriceOfRoomAppliance + afternoonSlotTotalFoodPrice;
        }
        if(isEveningSlotSelected){
            eveningSlotTotalPrice = eveningSlotBasicPrice + totalPriceOfRoomAppliance + eveningSlotTotalFoodPrice;
        }
        if(isNightSlotSelected){
            nightSlotTotalPrice = nightSlotBasicPrice + totalPriceOfRoomAppliance + nightSlotTotalFoodPrice;
        }
        if(isMidNightSlotSelected){
            midNightSlotTotalPrice = midNightSlotBasicPrice + totalPriceOfRoomAppliance + midNightSlotTotalFoodPrice;
        }
    
        fullDayTotalPrice = morningSlotTotalPrice + afternoonSlotTotalPrice + eveningSlotTotalPrice + nightSlotTotalPrice + midNightSlotTotalPrice;
    }

    useEffect(function(){
        if(fullDayTotalPrice > 0){
            const currentDateWithPrice: DateWithPriceInterface = {
                currentDate,
                fullDayTotalPrice
            }
            props.onEachDateTotalPrice(currentDateWithPrice);
        }
    }, [fullDayTotalPrice]);
    
    

    function fetchCurrentDateBasicPrice(eachDayInfomation: MeetingEventDetails[]): DateDetailsBasicPrice {
        const allRoomBasicPriceData: MeetingEventDetails[] = eachDayInfomation
        const bookingRoomBasicPriceData: MeetingEventDetails | undefined = allRoomBasicPriceData.find(function(eachRoom: MeetingEventDetails){
            return meetingEventAreaTitle == eachRoom.meetingEventTitle;
        });
        if(!bookingRoomBasicPriceData){
            throw new Error("bookingRoomBasicPriceData is missing");
        }
        const bookingRoomAllDateBasicPriceData: DateDetailsBasicPrice[] = bookingRoomBasicPriceData.dateDetails;
        const bookingDateBasicPriceData: DateDetailsBasicPrice | undefined = bookingRoomAllDateBasicPriceData.find(function(eachDate: DateDetailsBasicPrice){
            const eachDateString = (eachDate.date).split("T")[0];
            return eachDateString == currentDate;
        });
        if(!bookingDateBasicPriceData){
            throw new Error("bookingDateBasicPricData is missing");
        }
        return bookingDateBasicPriceData;
    }

    function fetchCurrentRoomSeatingArrangementPrice(eachDaySeatingArrangement: EventMeetingPriceForSeatingArrangement[]): SeatingArrangement {
        const allEventMeetingRoomData: EventMeetingPriceForSeatingArrangement[] = eachDaySeatingArrangement;
        const selectedEventMeetingRoomData: EventMeetingPriceForSeatingArrangement | undefined = allEventMeetingRoomData.find(function(eachRoom: EventMeetingPriceForSeatingArrangement){
            return eachRoom.meetingEventAreaTitle == meetingEventAreaTitle;
        });
        if(!selectedEventMeetingRoomData){
            throw new Error("selectedEventMeetingRoomData is missing");
        }
        const allSeatingArrangementData: SeatingArrangement[] = selectedEventMeetingRoomData.seatingArrangement;
        const selectedSeatingArrangementData: SeatingArrangement | undefined = allSeatingArrangementData.find(function(eachArrangement: SeatingArrangement){
            return meetingEventSeatingArrangement == eachArrangement.meetingEventAreaSeatingTitle;
        });
        if(!selectedSeatingArrangementData){
            throw new Error("selectedSeatingArrangementData is missing");
        }
        return selectedSeatingArrangementData;
    }

    function fetchCurrentDayFoodServicePrice(eachDayFoodPrice: DateDetailsForFoodPrice[]): DateDetailsForFoodPrice {
        const allDateFoodServicePrice: DateDetailsForFoodPrice[] = eachDayFoodPrice;
        const bookingDateFoodServicePrice: DateDetailsForFoodPrice | undefined = allDateFoodServicePrice.find(function(eachDate: DateDetailsForFoodPrice){
            const eachDateString: string = (eachDate.date).split("T")[0];
            return eachDateString == currentDate;
        });
        if(!bookingDateFoodServicePrice){
            throw new Error("bookingDateFoodServicePrice is missing");
        }
        return bookingDateFoodServicePrice;
            
    }
    

    function getBasicPriceOfRoomForSlot(dateEvent: EventTimingDetailsBasicPrice[], timeSlot: string): number {
        const getDateEventSlotDetails: EventTimingDetailsBasicPrice | undefined = dateEvent.find(function(eachSlot: EventTimingDetailsBasicPrice){
            return eachSlot.currentMeetingEventTiming == timeSlot
        });
        if(!getDateEventSlotDetails){
            throw new Error("getDateEventSlotDetails is missing");
        }
        const basicPriceOfSlot: number = getDateEventSlotDetails.currentMeetingEventTimingBasicPrice;
        return basicPriceOfSlot;
    }

    function getSpecificMealFoodServiceTotalPricePerGuest(foodServicePriceInformation: DateDetailsForFoodPrice, selectedFoodServiceSlot: string, selectedMeals: string[]): number{
        let currentFoodTotalPricePerGuest: number = 0;
        const currentTimeFoodDetails: EventTimingDetailsForFoodPrice | undefined = foodServicePriceInformation.eventTimingDetails.find(function(eachFoodTime: EventTimingDetailsForFoodPrice){
            return eachFoodTime.meetingEventCurrentTiming == selectedFoodServiceSlot;
        });
        if(!currentTimeFoodDetails){
            throw new Error("currentTimeFoodDetails is missing");
        }
        const currentTimeFoodPriceDetails: FoodServicePricePerGuest[] = currentTimeFoodDetails.meetingEventCurrentTimingFoodPrice;
        currentTimeFoodPriceDetails.forEach(function(eachFoodItem: FoodServicePricePerGuest){
            const foodItemName: string = eachFoodItem.foodTitle;
            const foodItemPrice: number = eachFoodItem.pricePerGuest;
            selectedMeals.forEach(function(selectedEachFoodItem: string){
                if(foodItemName == selectedEachFoodItem){
                    currentFoodTotalPricePerGuest = currentFoodTotalPricePerGuest + foodItemPrice;
                }
            })
        });
        return currentFoodTotalPricePerGuest;
    }

    function getSpecificMealAllFoodService(foodServicePriceInformation: DateDetailsForFoodPrice, mealName: string): EventTimingDetailsForFoodPrice {
        const currentTimeFoodDetails: EventTimingDetailsForFoodPrice | undefined = foodServicePriceInformation.eventTimingDetails.find(function(eachFoodTime: EventTimingDetailsForFoodPrice){
            return eachFoodTime.meetingEventCurrentTiming == mealName;
        });
        if(!currentTimeFoodDetails){
            throw new Error("currentTimeFoodDetails is missing");
        }
        return currentTimeFoodDetails;
    }


    return (
        <TableBody>
            {(isMorningSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Morning</TableCell>
                <TableCell align="right">{convertToINR(morningSlotBasicPrice)}</TableCell>
                <TableCell align="right">
                    {convertToINR(totalPriceOfRoomAppliance)}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {convertToINR(morningSlotTotalFoodPrice)} 
                    {(morningSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedMorningMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allMorningMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{convertToINR(morningSlotTotalPrice)}</TableCell>
            </TableRow>
            }

            {(isAfternoonSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Afternoon</TableCell>
                <TableCell align="right">{convertToINR(afternoonSlotBasicPrice)}</TableCell>
                <TableCell align="right">
                    {convertToINR(totalPriceOfRoomAppliance)}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {convertToINR(afternoonSlotTotalFoodPrice)} 
                    {(afternoonSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedAfternoonMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allAfternoonMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{convertToINR(afternoonSlotTotalPrice)}</TableCell>
            </TableRow>
            }

            {(isEveningSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Evening</TableCell>
                <TableCell align="right">{convertToINR(eveningSlotBasicPrice)}</TableCell>
                <TableCell align="right">
                    {convertToINR(totalPriceOfRoomAppliance)}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {convertToINR(eveningSlotTotalFoodPrice)} 
                    {(eveningSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedEveningMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allEveningMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{convertToINR(eveningSlotTotalPrice)}</TableCell>
            </TableRow>
            }

            {(isNightSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Night</TableCell>
                <TableCell align="right">{convertToINR(nightSlotBasicPrice)}</TableCell>
                <TableCell align="right">
                    {convertToINR(totalPriceOfRoomAppliance)}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {convertToINR(nightSlotTotalFoodPrice)} 
                    {(nightSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedNightMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allNightMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{convertToINR(nightSlotTotalPrice)}</TableCell>
            </TableRow>
            }

            {(isMidNightSlotSelected) &&
            <TableRow>
                <TableCell>{getDateText(new Date(currentDate))}</TableCell>
                <TableCell>Mid Night</TableCell>
                <TableCell align="right">{convertToINR(midNightSlotBasicPrice)}</TableCell>
                <TableCell align="right">
                    {convertToINR(totalPriceOfRoomAppliance)}
                    <EquipmentsPriceBreakup 
                        maximumGuestAttending={maximumGuestAttending} 
                        seatingArrangementPriceList={seatingArrangementPriceList} 
                    />
                </TableCell>
                <TableCell align="right">
                    {convertToINR(midNightSlotTotalFoodPrice)} 
                    {(midNightSlotTotalFoodPrice > 0) &&
                    <MealsPriceBreakup 
                        selectedMeals={selectedMidNightMeals} 
                        maximumGuestAttending={maximumGuestAttending} 
                        allMealsList={allMidNightMealsInformation} 
                    />
                    }
                </TableCell>
                <TableCell align="right">{convertToINR(midNightSlotTotalPrice)}</TableCell>
            </TableRow>
            }
        </TableBody>
    );
}

export default PriceDetailsEachDate;