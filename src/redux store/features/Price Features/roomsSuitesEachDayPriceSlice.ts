import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { RoomWithDateDetails, RoomSuitesEachDayInfoRespone } from "@/interface/Rooms and Suites Interface/eachDayRoomSuitesInfoInterface";


// State type
interface RoomsSuitesEachDayState {
    eachDayRoomSuitesPrice: RoomWithDateDetails[];
    loading: boolean;
    error: string | null;
}

const initialState: RoomsSuitesEachDayState = {
    eachDayRoomSuitesPrice: [],
    error: null,
    loading: false
}

const NAME = 'roomsSuitesEachDayPriceSliceName';
const THUNK_NAME = 'roomsSuitesEachDayPrice/getRoomsSuitesEachDayPrice';


// export const getRoomsSuitesEachDayPrice = createAsyncThunk(THUNK_NAME, async function(args, {rejectWithValue}){
//     try{
//         const response: Response = await fetch('/api/hotel-booking-information/room-and-suites-information/each-day-information/');
//         const data: RoomSuitesEachDayInfoRespone = await response.json();
//         return data;
//     }
//     catch(error){
//         rejectWithValue(error);
//     }
// });

export const getRoomsSuitesEachDayPrice = createAsyncThunk<
    RoomWithDateDetails[],               // return type
    void,                           // argument type
    { rejectValue: string | undefined }         // thunk API config
>(THUNK_NAME, async function (_args, { rejectWithValue }) {
    try {
        const response: Response = await fetch('/api/hotel-booking-information/room-and-suites-information/each-day-information/');
        if (!response.ok) {
            return rejectWithValue(`Error: ${response.status} ${response.statusText}`);
        }
        const data: RoomSuitesEachDayInfoRespone = await response.json();
        return data.roomsWithDate;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        return rejectWithValue(errorMessage);

    }
}
);

export const roomsSuitesEachDayPriceSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: function(builder){
        builder
            .addCase(getRoomsSuitesEachDayPrice.pending, function(state){
                state.loading = true;
            })
            .addCase(getRoomsSuitesEachDayPrice.fulfilled, function(state, action: PayloadAction<RoomWithDateDetails[]>){
                state.loading = false;
                state.error = null;
                state.eachDayRoomSuitesPrice = action.payload;
            })
            .addCase(getRoomsSuitesEachDayPrice.rejected, function(state, action){
                state.loading = false;
                state.eachDayRoomSuitesPrice = [];
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

export default roomsSuitesEachDayPriceSlice.reducer;