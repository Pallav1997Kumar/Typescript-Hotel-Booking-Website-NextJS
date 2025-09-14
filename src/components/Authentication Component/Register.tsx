"use client"
import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import validator from "validator";
import { useRouter } from 'next/navigation';

import { useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import InputAreaForRegisterLogin from "@/components/Input Area/InputAreaForRegisterLogin";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";


import { 
    IErrorRegisterResponse, 
    ISuccessRegisterResponse, 
    RegisterResponse 
} from "@/interface/Hotel User Interface/hotelUsersInterfce";


// Define the shape of inputValue state
interface InputValue {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    dob: string;
    email: string;
    contactNo: string;
    alternateContactNo: string;
    password: string;
    confirmPassword: string;
}

interface RegistrationSubmitData {
    firstName: string;
    middleName: string;
    lastName: string;
    fullName: string;
    gender: string;
    dob: string;
    email: string;
    contactNo: string;
    alternateContactNo: string;
    password: string;

}


function RegisterFunctionalComponent(){
    const dispatch = useAppDispatch();
    const router = useRouter();

    // Define the state with types
    const [inputValue, setInputValue] = useState<InputValue>({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        dob: "",
        email: "",
        contactNo: "",
        alternateContactNo: "",
        password: "",
        confirmPassword: "",
    });

    const [registrationErrorMessage, setRegistrationErrorMessage] = useState<string>('');
    const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState<string>('');
    const [registrationProcessing, setRegistrationProcessing] = useState<boolean>(false);

    const { firstName, middleName, lastName, dob, gender, email, contactNo, alternateContactNo, password, confirmPassword } = inputValue;

    let fullName: string;
    if (middleName.trim() !== "") {
        fullName = firstName.concat(' ', middleName, ' ', lastName);
    } else {
        fullName = firstName.concat(' ', lastName);
    }

    let passwordMismatch: boolean = false;
    if (confirmPassword !== "" && (password !== confirmPassword)) {
        passwordMismatch = true;
    }

    let genderInputGiven: boolean = false;
    if (gender !== "") {
        genderInputGiven = true;
    }

    const isInvalidEmail: boolean = isInvalidEmailFn();
    const isInvalidPassword: boolean = isInvalidPasswordFn();

    const disabledButton: boolean = isButtonDisabledFn();

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        setInputValue((previousInput) => ({
        ...previousInput,
        [name]: value,
        }));
    }

    function isInvalidEmailFn(): boolean {
        let isInvalidEmail: boolean = false;
        if (email.trim() !== "") {
        if (validator.isEmail(email)) {
            isInvalidEmail = false;
        } else {
            isInvalidEmail = true;
        }
        }
        return isInvalidEmail;
    }

    function isInvalidPasswordFn(): boolean {
        let isInvalidPassword: boolean = false;
        let isValidPassword: boolean = false;
        let enteredPassword: string = password.trim();
        var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        let passwordLengthGreaterThan7: boolean = enteredPassword.length > 7;
        let passwordLengthLessThan21: boolean = enteredPassword.length < 21;
        let hasNumber: boolean = /[0-9]/.test(enteredPassword);
        let hasUppercase: boolean = /[A-Z]/.test(enteredPassword);
        let hasLowercase: boolean = /[a-z]/.test(enteredPassword);
        let hasSpecialCharacters: boolean = format.test(enteredPassword);
        if (enteredPassword.length > 0) {
        if (passwordLengthGreaterThan7 && passwordLengthLessThan21 &&
            hasNumber && hasLowercase && hasUppercase && hasSpecialCharacters
        ) {
            isValidPassword = true;
        }
        isInvalidPassword = !isValidPassword;
        }
        return isInvalidPassword;
    }

    function isButtonDisabledFn(): boolean {
        let isButtonDisabled: boolean = true;
        if (firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        gender.trim() !== "" &&
        dob.trim() !== "" &&
        email.trim() !== "" &&
        !isInvalidEmailFn() &&
        contactNo.trim() !== "" &&
        password.trim() !== "" &&
        confirmPassword.trim() !== "" &&
        password.trim() === confirmPassword.trim()
        ) {
        isButtonDisabled = false
        }
        return isButtonDisabled;
    }

    function isSuccessRegisterResponse(data: RegisterResponse): data is ISuccessRegisterResponse {
        return (data as ISuccessRegisterResponse).message !== undefined;
    }
    
    // Type Guard to check if the response is an Error Response
    function isErrorResponse(data: RegisterResponse): data is IErrorRegisterResponse {
        return (data as IErrorRegisterResponse).errorMessage !== undefined || (data as IErrorRegisterResponse).error !== undefined;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const registrationInputData: RegistrationSubmitData = {
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        fullName: fullName.trim(),
        gender: gender.trim(),
        dob: dob.trim(),
        email: email.trim(),
        contactNo: contactNo.trim(),
        alternateContactNo: alternateContactNo.trim(),
        password: password.trim(),
        }

        setRegistrationSuccessMessage('');
        setRegistrationErrorMessage('');
        setRegistrationProcessing(true);

        try {
        const response: Response = await fetch('api/users-authentication/customers-authenticatication/register', {
            method: 'POST',
            body: JSON.stringify(registrationInputData),
            headers: {
            'Content-type': 'application/json; charset=UTF-8',
            }
        });
        const data: RegisterResponse = await response.json();
        if (response.status === 404) {
            if(isErrorResponse(data)){
                if(data.errorMessage){
                    setRegistrationErrorMessage(data.errorMessage);
                }
            }
        }
        if (response.status === 500) {
            if(isErrorResponse(data)){
                if(data.error){
                    setRegistrationErrorMessage(data.error);
                }
            }
        }
        if (response.status === 200) {
            if (isSuccessRegisterResponse(data)) {
                setRegistrationSuccessMessage(data.message);
                setInputValue({
                firstName: "",
                middleName: "",
                lastName: "",
                gender: "",
                dob: "",
                email: "",
                contactNo: "",
                alternateContactNo: "",
                password: "",
                confirmPassword: ""
                });
            }
        }
        } catch (error) {
        console.log(error);
        } finally {
        setRegistrationProcessing(false);
        }
    }

    function loginPageClickHandler(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        event.preventDefault();
        const loginPageCalledFrom = 'Registration Page';
        const loginRedirectPage = '/profile-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }

    return (
        <div className="w-full flex items-center justify-center">
        <div className="w-3/5 m-5 p-3.5 bg-rose-100 border border-black">
            <h1 className="text-center pt-4 text-3xl font-bold">Register to Hotel</h1>
            <form onSubmit={handleSubmit}>

            <h4 className="font-bold text-lg text-indigo-700 py-5 px-0.5">Name</h4>

            <InputAreaForRegisterLogin
                labelName="First Name"
                name="firstName"
                type="text"
                placeholder="Enter First Name"
                value={firstName}
                onChange={handleChange}
            />

            <InputAreaForRegisterLogin
                labelName="Middle Name"
                name="middleName"
                type="text"
                placeholder="Enter Middle Name (if any)"
                value={middleName}
                onChange={handleChange}
            />

            <InputAreaForRegisterLogin
                labelName="Last Name"
                name="lastName"
                type="text"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={handleChange}
            />

            <InputAreaForRegisterLogin
                labelName="Full Name"
                name="fullName"
                type="text"
                placeholder="Your Full Name"
                disabled={true}
                value={fullName}
            />

            <h4 className="font-bold text-lg text-indigo-700 py-5 px-0.5">Basic Information</h4>

            <div className="flex flex-col items-start space-y-2">
                <label htmlFor="gender" className="flex flex-col w-full">
                <div className="flex items-center mb-2">
                    <div className="w-1/3 text-blue-900 font-medium">Gender:</div>
                    <div className="w-2/3">
                    <select className="w-1/3 p-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700" onChange={handleChange} name="gender" id="gender">
                        <option value="">Choose Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {!genderInputGiven && <div className="text-red-600 text-sm font-light">Gender cannot be blank</div>}
                    </div>
                </div>
                </label>
            </div>

            <InputAreaForRegisterLogin
                labelName="Date of Birth"
                name="dob"
                type="date"
                value={dob}
                onChange={handleChange}
            />

            <h4 className="font-bold text-lg text-indigo-700 py-5 px-0.5">Contact Information</h4>

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
                labelName="Contact Number"
                name="contactNo"
                type="number"
                placeholder="Enter Contact Number"
                value={contactNo}
                onChange={handleChange}
            />

            <InputAreaForRegisterLogin
                labelName="Alternate Contact Number"
                name="alternateContactNo"
                type="number"
                placeholder="Enter Alternate Contact Number"
                value={alternateContactNo}
                onChange={handleChange}
            />

            <h4 className="font-bold text-lg text-indigo-700 py-5 px-0.5">Password</h4>

            <InputAreaForRegisterLogin
                labelName="Password"
                name="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                isInvalidPassword={isInvalidPassword}
                onChange={handleChange}
            />

            <InputAreaForRegisterLogin
                labelName="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-Enter Password"
                value={confirmPassword}
                passwordMismatch={passwordMismatch}
                onChange={handleChange}
            />

            <div className="flex justify-center mt-4">
                {(disabledButton && !registrationProcessing) &&
                <Button type="submit" variant="contained" disabled>Register</Button>
                }

                {(!disabledButton && !registrationProcessing) &&
                <Button type="submit" variant="contained">Register</Button>
                }

                {registrationProcessing &&
                <Button type="submit" variant="contained" disabled>Please Wait</Button>
                }
            </div>

            <div className="flex justify-center my-2">
                {(registrationErrorMessage !== '') &&
                <p className="text-red-600 font-bold">{registrationErrorMessage}</p>
                }
                {(registrationSuccessMessage !== '') &&
                <p className="text-green-600 font-semibold">{registrationSuccessMessage}</p>
                }
            </div>
            </form>

            <div className="flex flex-col items-center text-lg font-serif">
            <p>Already have an account</p>
            <p className="text-blue-600 underline pt-2">
                <Link onClick={loginPageClickHandler} href='/login'>Click here to Login</Link>
            </p>
            </div>
        </div>

        <div className="w-2/5">
            <Image src={'/hotel-kolkata.jpg'} alt="hotel" width={500} height={350} />
            <Image src={'/hotel-kolkata.jpg'} alt="hotel" width={500} height={350} />
            <Image src={'/hotel-kolkata.jpg'} alt="hotel" width={500} height={350} />
        </div>
        </div>
    );
}


function Register(){
    return (
        <ErrorBoundary>
            <RegisterFunctionalComponent />
        </ErrorBoundary>
    );
}


export default Register;
