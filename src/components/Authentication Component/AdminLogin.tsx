"use client"
import React, { ChangeEvent, FormEvent, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import validator from "validator";

import { useAppDispatch , useAppSelector} from "@/redux store/hooks";
import { login } from "@/redux store/features/Auth Features/loginUserDetailsSlice";

import InputAreaForRegisterLogin from "@/components/Input Area/InputAreaForRegisterLogin";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";


import { 
    ISuccessAdminLoginResponse, 
    IErrorAdminLoginResponse, 
    AdminLoginResponse 
} from "@/interface/Hotel User Interface/hotelAdminInterface";


// Type for login input
interface LoginInput {
    email: string;
    password: string;
}


function AdminLoginFunctionalComponent(){
    const router = useRouter();

    const loginPageCalledFrom: string | null = useAppSelector((reduxStore)=> reduxStore.loginPageCalledFromSliceName.loginPageCalledFrom);
    const loginRedirectPage: string = useAppSelector((reduxStore)=> reduxStore.loginPageCalledFromSliceName.loginRedirectPage);

    const dispatch = useAppDispatch();

    const [inputValue, setInputValue] = useState<LoginInput>({
        email: "",
        password: ""
    });

    const [loginProcessing, setLoginProcessing] = useState<boolean>(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');

    const email: string = inputValue.email;
    const password: string = inputValue.password;

    const disabledButton: boolean = isButtonDisabledFn();
    const isInvalidEmail: boolean = isInvalidEmailFn();

    function handleChange(event: ChangeEvent<HTMLInputElement>): void{
        const name: string = event.target.name;
        const value: string = event.target.value;
        setInputValue((previousInput) => ({
            ...previousInput,
            [name]: value,
        }));
    }

    function isInvalidEmailFn(): boolean{
        let isInvalidEmail: boolean = false;
        if(email.trim()!== ""){
            if (validator.isEmail(email)){
                isInvalidEmail = false;
            }
            else{
                isInvalidEmail = true;
            }
        }
        return isInvalidEmail;
    }

    function isButtonDisabledFn(): boolean{
        let isButtonDisabled: boolean = true;
        if(email.trim() !== "" &&
            !isInvalidEmailFn() && 
            password.trim() !== ""
        ){
            isButtonDisabled = false
        }
        return isButtonDisabled;
    }

    // Type Guard to check if it's a SuccessLoginResponse
    function isSuccessLoginResponse(data: ISuccessAdminLoginResponse | IErrorAdminLoginResponse): data is ISuccessAdminLoginResponse {
        return (data as ISuccessAdminLoginResponse).loginUserDetails !== undefined;
    }

    // Type Guard to check if it's an ErrorResponse
    function isErrorResponse(data: ISuccessAdminLoginResponse | IErrorAdminLoginResponse): data is IErrorAdminLoginResponse {
        return (data as IErrorAdminLoginResponse).errorMessage !== undefined || (data as IErrorAdminLoginResponse).error !== undefined;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        const loginInputData: LoginInput = {
            email,
            password
        };
        setLoginErrorMessage('');
        setLoginProcessing(true);
        console.log(loginInputData);
        try {
            const response: Response = await fetch('api/users-authentication/admin-authentication/login', {
                method: 'POST',
                body: JSON.stringify(loginInputData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include'
            });
            const data: AdminLoginResponse = await response.json();
            if(response.status === 404){
                if(isErrorResponse(data)){
                    if('errorMessage' in data){
                        if(data.errorMessage){
                            setLoginErrorMessage(data.errorMessage);
                        }
                    }
                }
            }
            if(response.status === 500){
                if(isErrorResponse(data)){
                    if('errorMessage' in data){
                        if(data.errorMessage){
                            setLoginErrorMessage(data.errorMessage);
                        }
                    }
                }
            }
            if(response.status === 200){
                if (isSuccessLoginResponse(data)) {
                    const loginUserDetails = data.loginUserDetails;
                    dispatch(login(loginUserDetails));
                    localStorage.setItem('loginUserDetails', JSON.stringify(loginUserDetails));
                    // router.push('/profile-home-page');
                    router.push(loginRedirectPage);
                }
            }
        } catch (error) {
            console.log(error);
        } finally{
            setLoginProcessing(false);
        }

    }

    return(
        <div className="w-full flex items-center justify-center">
            <div className="w-3/5 m-2 p-6 bg-gray-100 border border-black">
                <h1 className="text-center mb-6 text-xl font-semibold">Admin Login Page</h1>
                <h1 className="text-center mb-6 text-xl font-semibold">Login to Hotel</h1>
                
                
                <form onSubmit={handleSubmit}>
                    
                    <InputAreaForRegisterLogin 
                        labelName="Email Address" 
                        name="email" 
                        type="email" 
                        placeholder="Enter Email Address" 
                        value={email} 
                        isInvalidEmail={isInvalidEmail} 
                        onChange={handleChange} 
                    />
                    <InputAreaForRegisterLogin 
                        labelName="Password" 
                        name="password" 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password} 
                        onChange={handleChange} 
                    />
                    
                    <div className="flex items-center justify-center mt-6">
                        {(disabledButton && !loginProcessing) && 
                            <Button variant="contained" disabled>Admin Login</Button>
                        }
                        {(!disabledButton && !loginProcessing) && 
                            <Button type="submit" variant="contained">Admin Login</Button>
                        }
                        {(loginProcessing) && 
                            <Button type="submit" variant="contained" disabled>Please Wait...</Button>
                        }
                    </div>
                    
                    {(loginErrorMessage != '') &&
                        <div className="m-2 flex items-center justify-center text-red-600 font-bold">
                            <p>{loginErrorMessage}</p>    
                        </div>
                    }
                </form>
                
                <div className="flex flex-col items-center justify-center text-base font-serif mt-4">
                    <p>Don't have an account</p>
                    <p className="text-blue-600 underline pt-1">
                        <Link href='/register'>Click here to Register</Link>
                    </p>
                </div>

            </div>

            <div className="w-2/5">
                <Image src={'/hotel-kolkata.jpg'} alt="hotel" width={500} height={350} />
            </div>
        </div>
    );
}


function AdminLogin(){
    return (
        <ErrorBoundary>
            <AdminLoginFunctionalComponent />
        </ErrorBoundary>
    );
}


export default AdminLogin;