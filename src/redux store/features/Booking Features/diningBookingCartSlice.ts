import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DiningDetailsForCart } from "@/interface/Dining Interface/diningBookingInterface";


interface DiningCartState {
    diningCart: DiningDetailsForCart[];
}

const initialState: DiningCartState = {
    diningCart : []
}

const diningBookingCartSlice = createSlice({
    name: "diningCartSlice",
    initialState,
    reducers: {
        showDiningCart: function(state: DiningCartState){
            state.diningCart = state.diningCart;
        },
        addNewBookingToDiningCart: function(state: DiningCartState, action: PayloadAction<DiningDetailsForCart>){
            const oldDiningCartInfo: DiningDetailsForCart[] = state.diningCart;
            const newDiningInfo: DiningDetailsForCart = action.payload;
            state.diningCart = [...oldDiningCartInfo, newDiningInfo];
        },
        deleteParticularBookingFromDiningCart: function(state: DiningCartState, action: PayloadAction<number>){
            const oldDiningCartInfo: DiningDetailsForCart[] = state.diningCart;
            const removeDiningId: number = action.payload;
            const updatedDiningCart: DiningDetailsForCart[] = oldDiningCartInfo.filter(function(eachDining: DiningDetailsForCart){
                return (eachDining.diningCartId != removeDiningId)
            });
            state.diningCart = updatedDiningCart;
        },
    }
});

export { diningBookingCartSlice };
export const { showDiningCart, addNewBookingToDiningCart, deleteParticularBookingFromDiningCart } = diningBookingCartSlice.actions;
export default diningBookingCartSlice.reducer;