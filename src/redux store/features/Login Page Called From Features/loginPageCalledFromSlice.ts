import { createSlice, PayloadAction  } from "@reduxjs/toolkit";


interface LoginPageState {
    loginPageCalledFrom: string | null;
    loginRedirectPage: string;
}


const initialState: LoginPageState = {
    loginPageCalledFrom: null,
    loginRedirectPage: '/profile-home-page'
}

export const loginPageCalledFromSlice = createSlice({
    name: 'loginPageCalledFromSliceName',
    initialState,
    reducers: {
        getLoginPageCalledFrom: function(state: any){
            return state.loginPageCalledFrom;
        },
        getLoginRedirectPage: function(state: any){
            return state.loginRedirectPage;
        },
        updateLoginPageCalledFrom: function(state, action: PayloadAction<string>){
            state.loginPageCalledFrom = action.payload;
        },
        updateLoginRedirectPage: function(state, action: PayloadAction<string>){
            state.loginRedirectPage = action.payload;
        }
    }
});

export const { getLoginPageCalledFrom, getLoginRedirectPage, updateLoginPageCalledFrom, updateLoginRedirectPage } = loginPageCalledFromSlice.actions;
export default loginPageCalledFromSlice.reducer;