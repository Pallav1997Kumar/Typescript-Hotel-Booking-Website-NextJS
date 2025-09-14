"use client"
import React, { useState, ChangeEvent, FormEvent, MouseEvent } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import validator from "validator";

import { useAppDispatch , useAppSelector} from "@/redux store/hooks";
import { login } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { updateLoginPageCalledFrom, updateLoginRedirectPage  } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import InputAreaForRegisterLogin from "@/components/Input Area/InputAreaForRegisterLogin";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";


import { 
    IErrorLoginResponse, 
    ISuccessLoginResponse, 
    LoginResponse, 
    LoginUserDetails 
} from "@/interface/Hotel User Interface/hotelUsersInterfce";


// Type for login input
interface LoginInput {
    email: string;
    password: string;
}


function LoginFunctionalComponent(){
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
    function isSuccessLoginResponse(data: ISuccessLoginResponse | IErrorLoginResponse): data is ISuccessLoginResponse {
        return (data as ISuccessLoginResponse).loginUserDetails !== undefined;
    }

    // Type Guard to check if it's an ErrorResponse
    function isErrorResponse(data: ISuccessLoginResponse | IErrorLoginResponse): data is IErrorLoginResponse {
        return (data as IErrorLoginResponse).errorMessage !== undefined || (data as IErrorLoginResponse).error !== undefined;
    }


    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        const loginInputData: LoginInput = {
            email,
            password
        };
        setLoginErrorMessage('');
        setLoginProcessing(true);

        try {
            const response: Response = await fetch('api/users-authentication/customers-authenticatication/login', {
                method: 'POST',
                body: JSON.stringify(loginInputData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include'
            });
            const data: LoginResponse = await response.json();
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
                    if('error' in data){
                        if(data.error){
                            setLoginErrorMessage(data.error);
                        }
                    }
                } 
            }
            if(response.status === 200){
                if (isSuccessLoginResponse(data)) {
                    const loginUserDetails: LoginUserDetails = data.loginUserDetails;
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


    function adminLoginClickHandler(event: MouseEvent<HTMLAnchorElement>){
          event.preventDefault();
          const loginPageCalledFrom = 'User Login Page';
          const loginRedirectPage = '/admin-home-page';
          dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
          dispatch(updateLoginRedirectPage(loginRedirectPage));
          router.push('/admin-login');
    }


    return(
        <div className="w-full flex justify-center items-center py-2 md:py-10">
            <div className="w-full max-w-3xl mx-3 p-6 bg-rose-100 border border-gray-300 rounded-lg shadow-lg">
                <h1 className="text-center mb-12 text-3xl font-bold">Login to Hotel</h1>

                <form  className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
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
                    </div>

                    <div className="flex justify-center mt-6">
                        {(disabledButton && !loginProcessing) && 
                            <Button variant="contained" disabled>Login</Button>
                        }
                        {(!disabledButton && !loginProcessing) && 
                            <Button type="submit" variant="contained">Login</Button>
                        }
                        {(loginProcessing) && 
                            <Button variant="contained" disabled>Please Wait...</Button>
                        }
                    </div>
                    
                    {(loginErrorMessage != '') &&
                        <div className="flex justify-center text-red-600 font-bold mt-2">
                            <p>{loginErrorMessage}</p>    
                        </div>
                    }

                </form>
                
                <div className="flex flex-col items-center mt-6 text-lg font-serif">
                    <p>Don't have an account</p>
                    <p className="text-blue-500 underline pt-2">
                        <Link href='/register'>Click here to Register</Link>
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center text-base mt-8 font-serif">
                    <p>Are you an Admin</p>
                    <p className="text-blue-600 underline pt-1">
                        <Link onClick={adminLoginClickHandler} href="/admin-login">Click here to Login as Admin</Link>
                    </p>
                </div>

            </div>

            {/* Image Section */}
            <div className="w-40% hidden md:flex justify-center items-center">
                <Image src={'/hotel-kolkata.jpg'} alt="hotel" width={500} height={350} />
            </div>
        </div>
    )
}


function Login(){
    return (
        <ErrorBoundary>
            <LoginFunctionalComponent />
        </ErrorBoundary>
    );
}


export default Login;