import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { MultipleContinuousDatesBookingDetailsWithPriceInterface, NonContinuousMultipleDatesBookingDetailsInterface, SingleDateEventBookingDetailsWithPriceInterface } from "@/interface/Event Meeting Interface/eventMeetingBookingInterface";


// Define the state type for the event meeting cart
interface EventMeetingCartState {
    eventMeetingCart: (
        NonContinuousMultipleDatesBookingDetailsInterface |
        MultipleContinuousDatesBookingDetailsWithPriceInterface |
        SingleDateEventBookingDetailsWithPriceInterface
    )[];
}


const initialState: EventMeetingCartState = {
    eventMeetingCart : []
}

const eventMeetingRoomBookingCartSlice = createSlice({
    name: "eventMeetingCartSlice",
    initialState,
    reducers: {
        showEventMeetingCart: function(state: EventMeetingCartState){
            state.eventMeetingCart = state.eventMeetingCart;
        },
        addNewBookingToEventMeetingCart: function(state: EventMeetingCartState, action: PayloadAction<NonContinuousMultipleDatesBookingDetailsInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface | SingleDateEventBookingDetailsWithPriceInterface>){
            const oldEventMeetingCartInfo: (NonContinuousMultipleDatesBookingDetailsInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface | SingleDateEventBookingDetailsWithPriceInterface)[] = state.eventMeetingCart;
            const newEventMeetingInfo: NonContinuousMultipleDatesBookingDetailsInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface | SingleDateEventBookingDetailsWithPriceInterface = action.payload;
            state.eventMeetingCart = [...oldEventMeetingCartInfo, newEventMeetingInfo];
        },
        deleteParticularBookingFromEventMeetingCart: function(state: EventMeetingCartState, action: PayloadAction<number>){
            const oldEventMeetingCartInfo: (NonContinuousMultipleDatesBookingDetailsInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface | SingleDateEventBookingDetailsWithPriceInterface)[] = state.eventMeetingCart;
            const removeEventCartId: number = action.payload;
            const updatedEventMeetingCartInfo: (NonContinuousMultipleDatesBookingDetailsInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface | SingleDateEventBookingDetailsWithPriceInterface)[] = oldEventMeetingCartInfo.filter(function(eachRoom){
                return (eachRoom.eventCartId != removeEventCartId)
            });
            state.eventMeetingCart = updatedEventMeetingCartInfo;
        }
    }
});

export { eventMeetingRoomBookingCartSlice };
export const { showEventMeetingCart, addNewBookingToEventMeetingCart, deleteParticularBookingFromEventMeetingCart } = eventMeetingRoomBookingCartSlice.actions;
export default eventMeetingRoomBookingCartSlice.reducer;