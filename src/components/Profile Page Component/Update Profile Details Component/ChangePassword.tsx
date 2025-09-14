"use client"
import React, { useState, ChangeEvent, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import InputAreaForEditInfo from "@/components/Input Area/InputAreaForEditInfo";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { UpdateUserApiResponse } from "@/interface/Hotel User Interface/hotelUsersInterfce";


interface IInputValue {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

interface IUserInfo {
    oldPassword: string;
    newPassword: string;
}


function ChangePasswordFunctionalComponent(){

    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(function() {
        if (loginUserDetails == null) {
            const loginPageCalledFrom = 'Add Balance to Account Page';
            const loginRedirectPage = '/profile-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/login');
        }
    }, [loginUserDetails, dispatch, router]);

    if(loginUserDetails == null){
        return null;
    }

    const loginUserId: string = loginUserDetails.userId;

    const pathname: string = usePathname();
    const urlUserId: string = pathname.split('/')[3];

    const [inputValue, setInputValue] = useState<IInputValue>({
        oldPassword: "",
        newPassword: "", 
        confirmNewPassword: ""
    });

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showProcesingButton, setShowProcesingButton] = useState<boolean>(false);

    const oldPassword: string = inputValue.oldPassword;
    const newPassword: string = inputValue.newPassword;
    const confirmNewPassword: string = inputValue.confirmNewPassword;

    const isInvalidPassword: boolean = isInvalidPasswordFn();
    const disabledButton: boolean = isButtonDisabledFn();

    let passwordMismatch: boolean = false;
    if(confirmNewPassword.trim() != "" && (newPassword.trim() != confirmNewPassword.trim())){
        passwordMismatch = true;
    }
    
    let oldNewPasswordSame = false;
    if(newPassword.trim() != "" && (newPassword.trim() == oldPassword.trim())){
        oldNewPasswordSame = true;
    }

    function handleChangeForInputArea(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setInputValue((previousInput) => ({
            ...previousInput,
            [name]: value,
        }));
    }

    function isInvalidPasswordFn(): boolean{
        let isInvalidPassword: boolean = false;
        let isValidPassword: boolean = false;
        let enteredPassword: string= newPassword.trim();
        var format: RegExp = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        let passwordLengthGreaterThan7: boolean = enteredPassword.length > 7;
        let passwordLengthLessThan21: boolean = enteredPassword.length < 21;
        let hasNumber: boolean = /[0-9]/.test(enteredPassword);
        let hasUppercase: boolean = /[A-Z]/.test(enteredPassword);
        let hasLowercase: boolean = /[a-z]/.test(enteredPassword);
        let hasSpecialCharacters: boolean = format.test(enteredPassword);
        if(enteredPassword.length > 0){
            if(passwordLengthGreaterThan7 && 
                passwordLengthLessThan21 &&
                hasNumber && 
                hasLowercase && 
                hasUppercase && 
                hasSpecialCharacters
            ){
                isValidPassword = true;
            }
            isInvalidPassword = !isValidPassword;
        }
        return isInvalidPassword;
    }

    function isButtonDisabledFn(): boolean{
        let isButtonDisabled: boolean = true;
        if(oldPassword.trim() !== "" && 
            newPassword.trim() !== "" && 
            confirmNewPassword.trim() !== "" && 
            newPassword.trim() === confirmNewPassword.trim() &&
            oldPassword.trim() !== newPassword.trim()
        ){
            isButtonDisabled = false
        }
        return isButtonDisabled;
    }

    async function submitClickHandler(){
        setShowProcesingButton(true);
        setSuccessMessage('');
        setErrorMessage('');

        const userInfo: IUserInfo = {
            oldPassword: oldPassword.trim(),
            newPassword: newPassword.trim()
        }

        try{
            const response: Response = await fetch(`/api/users-authentication/customers-authenticatication/update-password-information/${loginUserId}`, {
                method: 'PATCH',
                body: JSON.stringify(userInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data: UpdateUserApiResponse = await response.json();
            if(response.status === 200){
                if('message' in data){
                    setSuccessMessage(data.message);
                }    
            }
            else if(response.status === 404){
                if('errorMessage' in data){
                    setErrorMessage(data.errorMessage);
                }
            }
            else if(response.status === 500){
                if('error' in data){
                    setErrorMessage(data.error);
                }
            }
        }
        catch (error){

        }
        finally{
            setShowProcesingButton(false);
        }
        setInputValue({
            oldPassword: "",
            newPassword: "", 
            confirmNewPassword: ""
        });
    }


    return (
        <div className="p-6">

            {/* Breadcrumb Navigation */}
            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            HOME 
                        </span>
                    </Link> 
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/profile-home-page"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            PROFILE PAGE 
                        </span>
                    </Link>
                    <span className="px-3">{'>>'}</span> 
                    <Link href={`/profile-home-page/change-password/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            CHANGE PASSWORD 
                        </span>
                    </Link>
                </p>
            </div>

            <h1 className="mb-6 text-2xl font-semibold">
                Change Your Existing Password
            </h1>

            <InputAreaForEditInfo 
                labelName="Old Password"
                name="oldPassword" 
                type="password" 
                placeholder="Enter Old Password" 
                value={oldPassword}
                onChange={handleChangeForInputArea}
                required={true}
            />

            <InputAreaForEditInfo 
                labelName="New Password"
                name="newPassword" 
                type="password" 
                placeholder="Enter New Password" 
                value={newPassword}
                onChange={handleChangeForInputArea}
                isInvalidPassword={isInvalidPassword} 
                oldNewPasswordSame={oldNewPasswordSame}
                required={true}
            />

            <InputAreaForEditInfo 
                labelName="Confirm New Password"
                name="confirmNewPassword" 
                type="password" 
                placeholder="Re-Enter New Password" 
                value={confirmNewPassword}
                onChange={handleChangeForInputArea}
                required={true}
                passwordMismatch={passwordMismatch}
            />

            <div className="flex justify-center items-center my-6">
                {(!showProcesingButton && disabledButton) &&
                    <Button variant="contained" disabled> Submit </Button>
                }
                {(!showProcesingButton && !disabledButton) &&
                    <Button onClick={submitClickHandler} variant="contained"> Submit </Button>
                }
                {showProcesingButton &&
                    <Button variant="contained" disabled> Please Wait </Button>
                }
            </div>

            <div className="flex justify-center items-center pt-4">
                {successMessage !== '' &&
                    <p className="text-green-600 font-bold text-xl">
                        {successMessage}
                    </p>
                }
                {errorMessage !== '' &&
                    <p className="text-red-600 font-bold text-xl">
                        {errorMessage}
                    </p>
                }
            </div>

        </div>
    );

}


function ChangePassword(){
    return (
        <ErrorBoundary>
            <ChangePasswordFunctionalComponent />
        </ErrorBoundary>
    );
}


export default ChangePassword;