import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";

import { IViewRoomsSuitesCartByCartIdSuccessApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";


interface RoomsSuitesBookingInfoState {
  roomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[];
}

const initialState: RoomsSuitesBookingInfoState = {
    roomSuiteBookingInfo : []
}


const roomSuiteBookingInfoSlice = createSlice({
    name: "roomSuiteBookingInfoSlice",
    initialState,
    reducers: {
        showRoomSuiteBookingInfo: function(state){
            state.roomSuiteBookingInfo = state.roomSuiteBookingInfo;
        },
        addRoomSuiteBookingInfo: function(state, action: PayloadAction<IViewRoomsSuitesCartByCartIdSuccessApiResponse[]>){
            const roomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[] = action.payload;
            const roomSuiteBookingInfoCopy = JSON.parse(JSON.stringify(roomSuiteBookingInfo)) as unknown as WritableDraft<IViewRoomsSuitesCartByCartIdSuccessApiResponse>[];
            state.roomSuiteBookingInfo = roomSuiteBookingInfoCopy;
        },
        resetRoomSuiteBookingInfo: function(state){
            state.roomSuiteBookingInfo = [];
        },
    }
});


export { roomSuiteBookingInfoSlice };
export const { showRoomSuiteBookingInfo, addRoomSuiteBookingInfo, resetRoomSuiteBookingInfo } = roomSuiteBookingInfoSlice.actions;
export default roomSuiteBookingInfoSlice.reducer;