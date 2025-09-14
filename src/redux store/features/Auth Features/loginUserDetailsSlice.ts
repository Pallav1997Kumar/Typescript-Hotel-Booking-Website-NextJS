import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the state
interface LoginUserDetails {
    userId: string;
    emailAddress: string;
    fullName: string;
}


interface LoginUserDetailsState {
    loginUserDetails: LoginUserDetails | null;
}
  

// Initial state with proper type
const initialState: LoginUserDetailsState = {
    loginUserDetails: null,
};
  
const loginUserDetailsSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        // Formal function syntax for reducers
        getLoginUserDetails(state: any) {
            return state.loginUserDetails;
        },
        login(state, action: PayloadAction<LoginUserDetails>) {
            state.loginUserDetails = action.payload;
        },
        updateUserDetails(state, action: PayloadAction<LoginUserDetails>) {
            state.loginUserDetails = action.payload;
        },
        logout(state) {
            state.loginUserDetails = null;
        },
    },
});
  
// Export actions and reducer
export { loginUserDetailsSlice };
export const { getLoginUserDetails, login, updateUserDetails, logout } = loginUserDetailsSlice.actions;
export default loginUserDetailsSlice.reducer;

export type { LoginUserDetailsState, LoginUserDetails };
  