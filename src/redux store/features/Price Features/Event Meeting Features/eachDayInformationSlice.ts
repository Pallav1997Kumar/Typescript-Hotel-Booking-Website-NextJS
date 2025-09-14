import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { EventMeetingEachDayResponse, MeetingEventDetails } from "@/interface/Event Meeting Interface/eachDayEventMeetingInfoInterface";


// State type
interface MeetingEventEachDayState {
    eachDayInfomation: MeetingEventDetails[];
    loading: boolean;
    error: string | null;
}

const initialState: MeetingEventEachDayState = {
    eachDayInfomation: [],
    error: null,
    loading: false
}

const NAME = 'eventMeetingEachDayInformationSliceName';
const THUNK_NAME = 'eventMeetingEachDayInformation/getEventsEachDayPrice';

// export const getEventsEachDayPrice = createAsyncThunk(THUNK_NAME, async function(args, {rejectWithValue}){
//     try{
//         const response: Response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-day-information/');
//         const data: EventMeetingEachDayResponse = await response.json();
//         return data;
//     }
//     catch(error){
//         rejectWithValue(error);
//     }
// });

export const getEventsEachDayPrice = createAsyncThunk<
    MeetingEventDetails[],               // return type
    void,                           // argument type
    { rejectValue: string | undefined }         // thunk API config
>(THUNK_NAME, async function (_args, { rejectWithValue }) {
    try {
        const response: Response = await fetch('/api/hotel-booking-information/events-meeting-room-information/each-day-information/');
        if (!response.ok) {
            return rejectWithValue(`Error: ${response.status} ${response.statusText}`);
        }
        const data: EventMeetingEachDayResponse = await response.json();
        return data.meetingEventDetailsWithDate;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        return rejectWithValue(errorMessage);

    }
}
);

export const eachDayInformationSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: function(builder){
        builder
            .addCase(getEventsEachDayPrice.pending, function(state){
                state.loading = true;
            })
            .addCase(getEventsEachDayPrice.fulfilled, function(state, action: PayloadAction<MeetingEventDetails[]>){
                state.loading = false;
                state.error = null;
                state.eachDayInfomation = action.payload;
            })
            .addCase(getEventsEachDayPrice.rejected, function(state, action){
                state.loading = false;
                state.eachDayInfomation = [];
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

export default eachDayInformationSlice.reducer;