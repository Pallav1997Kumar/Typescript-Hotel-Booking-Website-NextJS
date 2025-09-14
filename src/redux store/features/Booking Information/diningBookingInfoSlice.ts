import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";

import { IViewDiningCartByCartIdSuccessApiResponse } from "@/interface/Dining Interface/diningCartApiResponse";


interface DiningBookingInfoState {
  diningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[];
}

const initialState: DiningBookingInfoState = {
    diningBookingInfo : []
}


const diningBookingInfoSlice = createSlice({
    name: "diningBookingInfoSlice",
    initialState,
    reducers: {
        showDiningBookingInfo: function(state){
            state.diningBookingInfo = state.diningBookingInfo;
        },
        addDiningBookingInfo: function(state, action: PayloadAction<IViewDiningCartByCartIdSuccessApiResponse[]>){
            const diningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[] = action.payload;
            const diningBookingInfoCopy = JSON.parse(JSON.stringify(diningBookingInfo)) as unknown as WritableDraft<IViewDiningCartByCartIdSuccessApiResponse>[];
            state.diningBookingInfo = diningBookingInfoCopy;
        },
        resetDiningBookingInfo: function(state){
            state.diningBookingInfo = [];
        },
    }
});


export { diningBookingInfoSlice };
export const { showDiningBookingInfo, addDiningBookingInfo, resetDiningBookingInfo } = diningBookingInfoSlice.actions;
export default diningBookingInfoSlice.reducer;