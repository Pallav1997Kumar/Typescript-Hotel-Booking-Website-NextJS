import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { EventMeetingEachDaySeatingArrangementResponse } from "@/interface/Event Meeting Interface/eachDayEventMeetingInfoInterface";
import { EventMeetingPriceForSeatingArrangement } from "@/interface/Event Meeting Interface/eventMeetingRoomInterface";


// State type
interface MeetingEventEachDaySeatingArrangementState {
    eachDaySeatingArrangement: EventMeetingPriceForSeatingArrangement[];
    loading: boolean;
    error: string | null;
}

const initialState: MeetingEventEachDaySeatingArrangementState = {
    eachDaySeatingArrangement: [],
    error: null,
    loading: false
}

const NAME = 'eventMeetingEachDaySeatingArrangementSliceName';
const THUNK_NAME = 'eventMeetingEachDaySeatingArrangement/getEventsSeatingArrangementPrice'

// export const getEventsSeatingArrangementPrice = createAsyncThunk(THUNK_NAME, async function(args, {rejectWithValue}){
//     try{
//         const response: Response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-seating-arrangement-price/');
//         const data: EventMeetingEachDaySeatingArrangementResponse = await response.json();
//         return data;
//     }
//     catch(error){
//         rejectWithValue(error);
//     }
// });


export const getEventsSeatingArrangementPrice = createAsyncThunk<
EventMeetingPriceForSeatingArrangement[],               // return type
    void,                           // argument type
    { rejectValue: string | undefined }         // thunk API config
>(THUNK_NAME, async function (_args, { rejectWithValue }) {
    try {
        const response: Response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-seating-arrangement-price/');
        if (!response.ok) {
            return rejectWithValue(`Error: ${response.status} ${response.statusText}`);
        }
        const data: EventMeetingEachDaySeatingArrangementResponse = await response.json();
        return data.eventMeetingPriceForSeatingArrangement;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        return rejectWithValue(errorMessage);

    }
}
);

export const eachDaySeatingArrangementSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: function(builder){
        builder
            .addCase(getEventsSeatingArrangementPrice.pending, function(state){
                state.loading = true;
            })
            .addCase(getEventsSeatingArrangementPrice.fulfilled, function(state, action: PayloadAction<EventMeetingPriceForSeatingArrangement[]>){
                state.loading = false;
                state.error = null;
                state.eachDaySeatingArrangement = action.payload;
            })
            .addCase(getEventsSeatingArrangementPrice.rejected, function(state, action){
                state.loading = false;
                state.eachDaySeatingArrangement = [];
                if (action.payload !== undefined) {
                    state.error = action.payload;
                } else if (action.error?.message) {
                    state.error = action.error.message;
                } else {
                    state.error = null;
                } 
            })
    },
});

export default eachDaySeatingArrangementSlice.reducer;