import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IRoomsDetailsForCart } from "@/interface/Rooms and Suites Interface/roomsSuitesBookingInterface";


interface RoomCartState {
    roomCart: IRoomsDetailsForCart[];
}

const initialState: RoomCartState = {
    roomCart : []
}

const roomBookingCartSlice = createSlice({
    name: "roomCartSlice",
    initialState,
    reducers: {
        showRoomCart: function(state: RoomCartState){
            state.roomCart = state.roomCart;
        },
        addNewBookingToRoomCart: function(state: RoomCartState, action: PayloadAction<IRoomsDetailsForCart>){
            const oldRoomCartInfo: IRoomsDetailsForCart[] = state.roomCart;
            const newRoomInfo: IRoomsDetailsForCart = action.payload;
            state.roomCart = [...oldRoomCartInfo, newRoomInfo];
        },
        deleteParticularBookingFromRoomCart: function(state: RoomCartState, action: PayloadAction<number>){
            const oldRoomCartInfo: IRoomsDetailsForCart[] = state.roomCart;
            const removeRoomId: number = action.payload;
            const updatedRoomCart: IRoomsDetailsForCart[] = oldRoomCartInfo.filter(function(eachRoom: IRoomsDetailsForCart){
                return (eachRoom.roomCartId != removeRoomId)
            });
            state.roomCart = updatedRoomCart;
        }
    }
});

export { roomBookingCartSlice };
export const { showRoomCart, addNewBookingToRoomCart, deleteParticularBookingFromRoomCart } = roomBookingCartSlice.actions;
export default roomBookingCartSlice.reducer;