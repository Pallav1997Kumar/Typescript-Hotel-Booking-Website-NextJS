import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { DiningWithDate, DiningEachDayInfoRespone } from '@/interface/Dining Interface/eachDayDiningInfoInterface';


// State type
interface DiningEachDayState {
    eachDayDiningPrice: DiningWithDate[];
    loading: boolean;
    error: string | null;
}
  

const initialState: DiningEachDayState = {
    eachDayDiningPrice: [],
    error: null,
    loading: false
}

const NAME = 'diningEachDayPriceSliceName';
const THUNK_NAME = 'diningEachDayPrice/getDiningEachDayPrice';

// export const getDiningEachDayPrice = createAsyncThunk(THUNK_NAME, async function(args, {rejectWithValue}){
//     try{
//         const response: Response = await fetch('/api/hotel-booking-information/dining-information/each-day-information/');
//         const data: DiningEachDayInfoRespone = await response.json();
//         return data;
//     }
//     catch(error){
//         rejectWithValue(error);
//     }
// });

export const getDiningEachDayPrice = createAsyncThunk<
    DiningWithDate[],               // return type
    void,                           // argument type
    { rejectValue: string | undefined }         // thunk API config
>(THUNK_NAME, async function (_args, { rejectWithValue }) {
    try {
        const response: Response = await fetch('/api/hotel-booking-information/dining-information/each-day-information/');
        if (!response.ok) {
            return rejectWithValue(`Error: ${response.status} ${response.statusText}`);
        }
        const data: DiningEachDayInfoRespone = await response.json();
        return data.diningWithDate;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        return rejectWithValue(errorMessage);

    }
}
);


export const diningEachDayPriceSlice = createSlice({
    name: NAME,
    initialState,
    reducers: {},
    extraReducers: function(builder){
        builder
            .addCase(getDiningEachDayPrice.pending, function(state){
                state.loading = true;
            })
            .addCase(getDiningEachDayPrice.fulfilled, function(state, action: PayloadAction<DiningWithDate[]>){
                state.loading = false;
                state.error = null;
                state.eachDayDiningPrice = action.payload;
            })
            .addCase(getDiningEachDayPrice.rejected, function(state, action){
                state.loading = false;
                state.eachDayDiningPrice = [];
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

export default diningEachDayPriceSlice.reducer;