import { configureStore, Reducer } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { Provider } from "react-redux";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { createWrapper, Context } from "next-redux-wrapper";

// Import all reducers with proper types
import roomBookingCartSliceReducer from "./features/Booking Features/roomBookingCartSlice";
import diningBookingCartSliceReducer from "./features/Booking Features/diningBookingCartSlice";
import eventMeetingRoomBookingCartSliceReducer from "./features/Booking Features/eventMeetingRoomBookingCartSlice";

import loginUserDetailsSliceReducer from "./features/Auth Features/loginUserDetailsSlice";
import loginPageCalledFromSliceReducer from "./features/Login Page Called From Features/loginPageCalledFromSlice";

import roomsSuitesEachDayPriceSliceReducer from "./features/Price Features/roomsSuitesEachDayPriceSlice";
import diningEachDayPriceSliceReducer from "./features/Price Features/diningEachDayPriceSlice";
import eachDayFoodPriceSliceReducer from "./features/Price Features/Event Meeting Features/eachDayFoodPriceSlice";
import eachDayInformationSliceReducer from "./features/Price Features/Event Meeting Features/eachDayInformationSlice";
import eachDaySeatingArrangementSliceReducer from "./features/Price Features/Event Meeting Features/eachDaySeatingArrangementSlice";

import diningBookingInfoSliceReducer from "./features/Booking Information/diningBookingInfoSlice";
import roomSuiteBookingInfoSliceReducer from "./features/Booking Information/roomSuiteBookingInfoSlice";
import eventMeetingBookingInfoSliceReducer from "./features/Booking Information/eventMeetingBookingInfoSlice";

// Define RootState type (State shape for your store)
export type RootState = ReturnType<typeof rootReducer>;

// Define RootReducer with correct typing
const rootReducer = combineReducers({
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
});

// Persist configuration
const persistConfig = {
    key: "root",
    storage,
    whitelist: [
        "roomCartSlice",
        "diningCartSlice",
        "eventMeetingCartSlice",
        "userSlice",
        "loginPageCalledFromSliceName",
        "diningEachDayPriceSliceName",
        "roomsSuitesEachDayPriceSliceName",
        "eventMeetingEachDayFoodPriceSliceName",
        "eventMeetingEachDayInformationSliceName",
        "eventMeetingEachDaySeatingArrangementSliceName",
        "diningBookingInfoSlice",
        "roomSuiteBookingInfoSlice",
        "eventMeetingBookingInfoSlice",
    ], // List of reducers you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
function makeStore() {
    return configureStore({
      reducer: persistedReducer as Reducer, // Persisted reducer type assertion
      devTools: process.env.NODE_ENV !== "production",
    });
}

export const wrapper = createWrapper(makeStore);

// Store persistence setup
export const storePersistance = configureStore({
    reducer: persistedReducer as Reducer,
    devTools: process.env.NODE_ENV !== "production",
});

// Create persistor
export const persistor: Persistor = persistStore(storePersistance); // Persistor typing
