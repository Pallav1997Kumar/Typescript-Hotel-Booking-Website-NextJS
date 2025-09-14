import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import roomBookingCartSliceReducer from './features/Booking Features/roomBookingCartSlice';
import diningBookingCartSliceReducer from './features/Booking Features/diningBookingCartSlice';
import eventMeetingRoomBookingCartSliceReducer from './features/Booking Features/eventMeetingRoomBookingCartSlice';

import loginUserDetailsSliceReducer from './features/Auth Features/loginUserDetailsSlice';
import loginPageCalledFromSliceReducer from './features/Login Page Called From Features/loginPageCalledFromSlice';

import roomsSuitesEachDayPriceSliceReducer from './features/Price Features/roomsSuitesEachDayPriceSlice';
import diningEachDayPriceSliceReducer from './features/Price Features/diningEachDayPriceSlice';
import eachDayFoodPriceSliceReducer from './features/Price Features/Event Meeting Features/eachDayFoodPriceSlice';
import eachDayInformationSliceReducer from './features/Price Features/Event Meeting Features/eachDayInformationSlice';
import eachDaySeatingArrangementSliceReducer from './features/Price Features/Event Meeting Features/eachDaySeatingArrangementSlice';

import diningBookingInfoSliceReducer from './features/Booking Information/diningBookingInfoSlice';
import roomSuiteBookingInfoSliceReducer from './features/Booking Information/roomSuiteBookingInfoSlice';
import eventMeetingBookingInfoSliceReducer from './features/Booking Information/eventMeetingBookingInfoSlice';


// Configure the store with reducers
export const store = configureStore({
    reducer: {
        roomCartSlice: roomBookingCartSliceReducer,
        diningCartSlice: diningBookingCartSliceReducer,
        eventMeetingCartSlice: eventMeetingRoomBookingCartSliceReducer,
        userSlice: loginUserDetailsSliceReducer,
        loginPageCalledFromSliceName: loginPageCalledFromSliceReducer,
        diningEachDayPriceSliceName: diningEachDayPriceSliceReducer,
        roomsSuitesEachDayPriceSliceName: roomsSuitesEachDayPriceSliceReducer,
        eventMeetingEachDayFoodPriceSliceName: eachDayFoodPriceSliceReducer,
        eventMeetingEachDayInformationSliceName: eachDayInformationSliceReducer,
        eventMeetingEachDaySeatingArrangementSliceName: eachDaySeatingArrangementSliceReducer,
        diningBookingInfoSlice: diningBookingInfoSliceReducer,
        roomSuiteBookingInfoSlice: roomSuiteBookingInfoSliceReducer,
        eventMeetingBookingInfoSlice: eventMeetingBookingInfoSliceReducer,
    },
});

// Define the RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch type
export type AppDispatch = typeof store.dispatch;

// Define the AppStore type
export type AppStore = typeof store; 
