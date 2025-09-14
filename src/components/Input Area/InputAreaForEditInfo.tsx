"use client"
import React, { ChangeEvent } from "react";


interface IPropsInputAreaForEditInfo{
    labelName: string;
    name: string;
    type: string;
    placeholder?: string;
    value: string;
    required: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    passwordMismatch?: boolean;
    disabled?: boolean;
    isInvalidPassword?: boolean;
    oldNewPasswordSame?: boolean;
}


function InputAreaForEditInfo(props: IPropsInputAreaForEditInfo){
    
    const labelName: string = props.labelName;
    const name: string = props.name;
    const type: string = props.type;
    const placeholder: string | undefined = props.placeholder;
    const value: string = props.value;
    const required: boolean = props.required;
    const onChange: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined = props.onChange;
    const passwordMismatch = props.passwordMismatch;
    const disabled: boolean | undefined = props.disabled;
    const isInvalidPassword: boolean | undefined = props.isInvalidPassword;
    const oldNewPasswordSame: boolean | undefined = props.oldNewPasswordSame;


    return(
        <React.Fragment>
            <div className="w-full py-2 mb-4">
                <label htmlFor={labelName}>
                    <div className="flex">
                        {/* Label name */}
                        <div className="w-1/3 text-[rgb(20,20,173)] font-medium">
                            {labelName}: 
                            {required && 
                                <span className="text-red-600 font-bold text-xl"> 
                                    * 
                                </span>
                            }
                        </div>

                        {/* Input area */}
                        <div className="w-2/3">
                            <input 
                                id={labelName} 
                                disabled={disabled} 
                                name={name} 
                                type={type} 
                                placeholder={placeholder} 
                                value={value} 
                                onChange={onChange}
                                className="w-[70%] p-2 border border-blue-500 bg-[rgb(250,249,249)] focus:outline-none focus:border-2 focus:border-blue-500" 
                            /> 

                            {(required && value == "") &&
                                <p className="text-red-600 text-sm mt-1">
                                    {labelName} cannot be blank
                                </p>
                            }

                            {isInvalidPassword && 
                                <p className="text-red-600 text-sm mt-1">
                                    Enter Valid Password
                                </p>
                            }

                            {(oldNewPasswordSame && !isInvalidPassword) &&
                                <p className="text-red-600 text-sm mt-1">
                                    Old Password and New Password can't be same
                                </p>
                            }

                            {passwordMismatch && 
                                <p className="text-red-600 text-sm mt-1">
                                    Password and Confirm Password does not match
                                </p>
                            }
                            
                        </div>
                    </div>
                </label>
            </div>
        </React.Fragment>
    );
}

export default InputAreaForEditInfo;