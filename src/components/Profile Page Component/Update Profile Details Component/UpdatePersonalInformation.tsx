"use client"
import React, { useState, useEffect, ChangeEvent } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";
import { updateUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";

import InputAreaForEditInfo from "@/components/Input Area/InputAreaForEditInfo";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { ILoginUserDetails, LoginUserApiResponse, UpdateUserApiResponse } from "@/interface/Hotel User Interface/hotelUsersInterfce";


interface IInputValue {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    dob: string;
    contactNo: string;
    alternateContactNo: string;
}


interface IUpdatedUserInfo {
    firstName: string;
    middleName: string;
    lastName: string;
    fullName: string;
    gender: string;
    dob: string;
    contactNo: string;
    alternateContactNo: string;
}


function UpdatePersonalInformationFunctionalComponent(){

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
    const loginUserFullName: string = loginUserDetails.fullName;
    const emailAddress: string = loginUserDetails.emailAddress;

    const pathname: string = usePathname();
    const urlUserId: string = pathname.split('/')[3];
    
    const [loginCustomerInfo, setLoginCustomerInfo] = useState<ILoginUserDetails | null>(null);

    const [inputValue, setInputValue] = useState<IInputValue>({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        dob: '',
        contactNo: '',
        alternateContactNo: ''
    });
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showProcesingButton, setShowProcesingButton] = useState<boolean>(false);
    

    const firstName: string = inputValue.firstName;
    const middleName: string = inputValue.middleName;
    const lastName: string = inputValue.lastName;
    const gender: string = inputValue.gender;
    const dob: string = inputValue.dob;
    const contactNo: string = inputValue.contactNo;
    const alternateContactNo: string = inputValue.alternateContactNo;
    

    useEffect(()=>{
        if(loginUserId == urlUserId){
            fetchLoginUsersDetailsDb(loginUserId);
        }
    }, [loginUserId, urlUserId]);

    useEffect(()=>{
        if(loginCustomerInfo){
            setInputValue({
                firstName: loginCustomerInfo.firstName || '',
                middleName: loginCustomerInfo.middleName || '',
                lastName: loginCustomerInfo.lastName || '',
                gender: loginCustomerInfo.gender || '',
                dob: (loginCustomerInfo.dateOfBirth).split('T')[0] || '',
                contactNo: loginCustomerInfo.contactNo || '',
                alternateContactNo: loginCustomerInfo.alternateContactNo || ''
            });
        }
    }, [loginCustomerInfo]);
  

    let fullName: string = '';
    if(middleName.trim() !== ""){
        fullName = firstName.concat(' ', middleName, ' ', lastName);
    }
    else{
        fullName = firstName.concat(' ', lastName);
    }

    const isSubmitButtonDisabled: boolean = isSubmitButtonDisabledFn();


    async function fetchLoginUsersDetailsDb(loginUserId: string) {
        try {
            const response: Response = await fetch(`/api/users-authentication/customers-authenticatication/login-user-information/${loginUserId}`);
            const data: LoginUserApiResponse = await response.json();
            if(response.status == 200){
                if('loginUserDetails' in data){
                    setLoginCustomerInfo(data.loginUserDetails);
                }   
            }
        } catch (error) {
            console.log(error); 
        }
    }

    function handleChangeForInputArea(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setInputValue((previousInput) => ({
            ...previousInput,
            [name]: value,
        }));
    }

    function handleChangeForGenderChange(event: ChangeEvent<HTMLSelectElement>){
        const { name, value } = event.target;
        setInputValue((previousInput) => ({
            ...previousInput,
            [name]: value,
        }));
    }


    function isSubmitButtonDisabledFn(): boolean{
        //Submit button will disabled if any mandatory filed is empty or we have not changed any input
        const isAnyMandatoryFieldEmpty: boolean = firstName.trim() == "" || 
                                            lastName.trim() == "" || 
                                            gender.trim() == "" || 
                                            contactNo.toString().trim() == "";
        let isAnyInputChanged: boolean = false;
        if(loginCustomerInfo != null){
            isAnyInputChanged = (loginCustomerInfo.firstName != firstName.trim()) ||
                                (loginCustomerInfo.middleName != middleName.trim()) ||
                                (loginCustomerInfo.lastName != lastName.trim()) ||
                                (loginCustomerInfo.gender != gender.trim()) ||
                                (loginCustomerInfo.contactNo != contactNo.toString().trim()) ||
                                (loginCustomerInfo.alternateContactNo != alternateContactNo.toString().trim()) ||
                                (loginCustomerInfo.dateOfBirth.split('T')[0].trim() != dob.trim())
        }
        const isButtonDisabled: boolean = !isAnyInputChanged || isAnyMandatoryFieldEmpty;
        return isButtonDisabled;
    }

    async function submitClickHandler() {
        setSuccessMessage('');
        setErrorMessage('');
        setShowProcesingButton(true);
        const updatedUserInfo: IUpdatedUserInfo = {
            firstName: firstName.trim(),
            middleName: middleName.trim(),
            lastName: lastName.trim(),
            fullName: fullName.trim(),
            gender: gender.trim(),
            dob: dob.trim(),
            contactNo: contactNo,
            alternateContactNo: alternateContactNo
        }
        
        try {
            const response: Response = await fetch(`/api/users-authentication/customers-authenticatication/update-basic-information/${loginUserId}`, {
                method: 'PATCH',
                body: JSON.stringify(updatedUserInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data: UpdateUserApiResponse = await response.json();
            if(response.status === 200){
                if('message' in data){
                    setSuccessMessage(data.message);
                    const updatedFullName: string =  updatedUserInfo.fullName;
                    if(loginUserFullName !== updatedFullName){
                        const updatedUserInformation: LoginUserDetails = {
                            userId: loginUserId,
                            emailAddress: emailAddress,
                            fullName: updatedFullName
                        }
                        dispatch(updateUserDetails(updatedUserInformation));
                    }
                }
            }
            if(response.status === 404){
                if('errorMessage' in data){
                    setErrorMessage(data.errorMessage);
                }
            }
            if(response.status === 500){
                if('error' in data){
                    setErrorMessage(data.error);
                }
            }
        } catch (error) {
            
        }
        finally {
            setShowProcesingButton(false);
        }
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
                    <Link href={`/profile-home-page/edit-personal-information/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            EDIT PERSONAL INFORMATION 
                        </span>
                    </Link>
                </p>
            </div>

            <h1 className="text-[1.75rem] uppercase font-bold tracking-wide font-[Times_New_Roman]">
                Edit Your Personal Information
            </h1>


            {/* NAME SECTION */}
            <div className="mt-8">
                <h2 className="text-[1.35rem] uppercase font-semibold font-sans mb-4">
                    Name Edit Section
                </h2>

                <InputAreaForEditInfo 
                    labelName="First Name" 
                    name="firstName" 
                    type="text" 
                    placeholder="Enter First Name" 
                    value={firstName} 
                    onChange={handleChangeForInputArea}
                    required={true}
                />

                <InputAreaForEditInfo 
                    labelName="Middle Name" 
                    name="middleName" 
                    type="text" 
                    placeholder="Enter Middle Name (if any)" 
                    value={middleName} 
                    onChange={handleChangeForInputArea} 
                    required={false}
                />
                    
                <InputAreaForEditInfo 
                    labelName="Last Name" 
                    name="lastName" 
                    type="text" 
                    placeholder="Enter Last Name" 
                    value={lastName} 
                    onChange={handleChangeForInputArea} 
                    required={true}
                />
                    
                <InputAreaForEditInfo 
                    labelName="Full Name" 
                    name="fullName" 
                    type="text" 
                    placeholder="Your Full Name" 
                    disabled={true} 
                    value={fullName} 
                    required={true}
                />
            </div>


            {/* BASIC INFO SECTION */}
            <div className="mt-8">
                <h2 className="text-[1.35rem] uppercase font-semibold font-sans mb-4">
                    Basic Information Edit Section
                </h2>

                <div className="mb-4">
                    <label htmlFor="gender"  className="flex">
                        <div className="flex w-full">
                            {/* Label Name */}
                            <div className="w-1/3 text-[rgb(20,20,173)]">
                                Gender: <span className="text-red-600 font-bold text-xl"> * </span>
                            </div>

                            {/* Input Field */}
                            <div className="w-2/3">
                                <select 
                                    className="p-2 border border-blue-500 focus:outline-none focus:border-2 focus:border-blue-500" 
                                    value={gender} 
                                    onChange={handleChangeForGenderChange} 
                                    name="gender" 
                                    id="gender"
                                >
                                    <option value="">Choose Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {(gender == "") &&
                                    <p className="text-red-600 mt-1 text-sm">
                                        Gender cannot be blank
                                    </p>
                                }
                            </div>
                        </div>
                    </label>
                </div>

                <InputAreaForEditInfo 
                    labelName="Date of Birth" 
                    name="dob" 
                    type="date" 
                    value={dob} 
                    onChange={handleChangeForInputArea} 
                    required={true}
                />

            </div>


            {/* CONTACT NUMBER SECTION */}
            <div className="mt-8">
                <h2 className="text-[1.35rem] uppercase font-semibold font-sans mb-4">
                    Contact Information Edit Section
                </h2>

                <InputAreaForEditInfo 
                    labelName="Contact Number" 
                    name="contactNo"
                    type="number" 
                    placeholder="Enter Contact Number" 
                    value={contactNo} 
                    onChange={handleChangeForInputArea} 
                    required={true}
                />
                    
                <InputAreaForEditInfo 
                    labelName="Alternate Contact Number" 
                    name="alternateContactNo" 
                    type="number" 
                    placeholder="Enter Alternate Contact Number" 
                    value={alternateContactNo} 
                    onChange={handleChangeForInputArea} 
                    required={false}
                />
                
            </div>


            {/* SUBMIT BUTTONS */}
            <div className="flex justify-center items-center mt-8 space-x-2">
                {(isSubmitButtonDisabled && !showProcesingButton) && 
                    <Button variant="contained" disabled> Submit </Button>
                }
                {(!isSubmitButtonDisabled && !showProcesingButton) &&
                    <Button onClick={submitClickHandler} variant="contained"> Submit </Button>
                }
                {showProcesingButton &&
                    <Button variant="contained" disabled> Please Wait </Button>
                }
            </div>

            
            {/* MESSAGES */}
            <div className="flex justify-center items-center mt-6">
                {successMessage !== '' &&
                    <p className="text-green-600 font-bold text-xl">
                        {successMessage}
                    </p>
                }
                {errorMessage != '' &&
                    <p className="text-red-600 font-bold text-xl">
                        {errorMessage}
                    </p>
                }
            </div>


        </div>
    )
}


function UpdatePersonalInformation(){
    return (
        <ErrorBoundary>
            <UpdatePersonalInformationFunctionalComponent />
        </ErrorBoundary>
    );
}


export default UpdatePersonalInformation;