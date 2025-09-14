import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";

import { IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";


interface EventMeetingBookingInfoState {
  eventMeetingBookingInfo: (
    IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse |
    IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | 
    IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
    )[];
}

const initialState: EventMeetingBookingInfoState = {
    eventMeetingBookingInfo : []
}


const eventMeetingBookingInfoSlice = createSlice({
    name: "eventMeetingBookingInfoSlice",
    initialState,
    reducers: {
        showEventMeetingSuiteBookingInfo: function(state){
            state.eventMeetingBookingInfo = state.eventMeetingBookingInfo;
        },
        addEventMeetingBookingInfo: function(state, action: PayloadAction<(IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse)[]>){
            const eventMeetingBookingInfo: (IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse)[] = action.payload;
            const eventMeetingBookingInfoCopy = JSON.parse(JSON.stringify(eventMeetingBookingInfo)) as unknown as WritableDraft<IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse>[];
            state.eventMeetingBookingInfo = eventMeetingBookingInfoCopy;
        },
        resetEventMeetingBookingInfo: function(state){
            state.eventMeetingBookingInfo = [];
        },
    }
});


export { eventMeetingBookingInfoSlice };
export const { showEventMeetingSuiteBookingInfo, addEventMeetingBookingInfo, resetEventMeetingBookingInfo } = eventMeetingBookingInfoSlice.actions;
export default eventMeetingBookingInfoSlice.reducer;