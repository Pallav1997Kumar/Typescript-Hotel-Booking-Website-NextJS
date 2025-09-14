import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { DateDetailsForFoodPrice, EventMeetingEachDayFoodPriceResponse } from "@/interface/Event Meeting Interface/eachDayEventMeetingInfoInterface";


// State type
interface MeetingEventEachDayFoodPriceState {
    eachDayFoodPrice: DateDetailsForFoodPrice[];
    loading: boolean;
    error: string | null;
}


const initialState: MeetingEventEachDayFoodPriceState = {
    eachDayFoodPrice: [],
    error: null,
    loading: false
}

const NAME = 'eventMeetingEachDayFoodPriceSliceName';
const THUNK_NAME = 'eventMeetingEachDayFoodPrice/getEventsFoodPrice';

// export const getEventsFoodPrice = createAsyncThunk(THUNK_NAME, async function(args, {rejectWithValue}){
//     try{
//         const response: Response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-day-food-price/');
//         const data: EventMeetingEachDayFoodPriceResponse = await response.json();
//         return data;
//     }
//     catch(error){
//         rejectWithValue(error);
//     }
// });

export const getEventsFoodPrice = createAsyncThunk<
    DateDetailsForFoodPrice[],               // return type
    void,                           // argument type
    { rejectValue: string | undefined }         // thunk API config
>(THUNK_NAME, async function (_args, { rejectWithValue }) {
    try {
        const response: Response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-day-food-price/');
        if (!response.ok) {
            return rejectWithValue(`Error: ${response.status} ${response.statusText}`);
        }
        const data: EventMeetingEachDayFoodPriceResponse = await response.json();
        return data.meetingEventFoodPriceWithDate;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        return rejectWithValue(errorMessage);

    }
}
);

export const eachDayFoodPriceSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: function(builder){
        builder
            .addCase(getEventsFoodPrice.pending, function(state){
                state.loading = true;
            })
            .addCase(getEventsFoodPrice.fulfilled, function(state, action: PayloadAction<DateDetailsForFoodPrice[]>){
                state.loading = false;
                state.error = null;
                state.eachDayFoodPrice = action.payload;
            })
            .addCase(getEventsFoodPrice.rejected, function(state, action){
                state.loading = false;
                state.eachDayFoodPrice = [];
                if (action.payload !== undefined) {
                    state.error = action.payload;
                } else if (action.error?.message) {
                    state.error = action.error.message;
                } else {
                    state.error = null;
                } 
            })
    }
});

export default eachDayFoodPriceSlice.reducer;