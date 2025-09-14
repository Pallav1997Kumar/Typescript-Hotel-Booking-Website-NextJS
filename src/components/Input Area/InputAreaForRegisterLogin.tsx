"use client"
import React, { ChangeEvent } from "react";

// Define the types for props
interface InputAreaForRegisterLoginProps {
    labelName: string;
    name: string;
    type: string;
    placeholder?: string;
    value: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    passwordMismatch?: boolean;
    disabled?: boolean;
    isInvalidEmail?: boolean;
    isInvalidPassword?: boolean;
}


export default function InputAreaForRegisterLogin(props: InputAreaForRegisterLoginProps) {
    const {
        labelName,
        name,
        type,
        placeholder,
        value,
        onChange,
        passwordMismatch,
        disabled,
        isInvalidEmail,
        isInvalidPassword
    } = props;

    let isInputError = false;
    if (value === "") {
        if (labelName !== "Middle Name" && labelName !== "Alternate Contact Number") {
        isInputError = true;
        }
    }

    return (
        <div className="w-full mb-4">
        <label htmlFor={labelName} className="flex flex-col">
            <div className="flex">
                <div className="w-1/3 text-blue-900">{labelName}:</div>
                <div className="w-2/3">
                    <input
                    id={labelName}
                    disabled={disabled}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-4/5 p-2 border border-blue-500 bg-gray-100 focus:outline-none focus:border-2 focus:border-blue-500"
                    />

                    {isInputError && (
                    <div className="text-red-500 text-sm">This field cannot be blank</div>
                    )}

                    {passwordMismatch && (
                    <div className="text-red-500 text-sm">Password and Confirm Password do not match</div>
                    )}

                    {isInvalidEmail && (
                    <div className="text-red-500 text-sm">Enter a valid email</div>
                    )}

                    {isInvalidPassword && (
                    <div className="text-red-500 text-sm">Enter a valid password</div>
                    )}
                </div>
            </div>
        </label>
        </div>
    );
}
