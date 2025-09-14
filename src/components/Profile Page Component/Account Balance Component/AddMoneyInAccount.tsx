'use client'
import React, {useEffect, useState} from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";

import { convertToINR } from "@/functions/currency";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants";
import { incorrectCardDetailsErrorConstant } from "@/constant string files/incorrectCardDetailsErrorConstant";

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { LoginUserDetails } from "@/redux store/features/Auth Features/loginUserDetailsSlice";
import { AddMoneyToAccountApiResponse, AddTransactionAddMoneyApiResponse } from "@/interface/Hotel User Interface/hotelUsersInterfce";


interface IAmountInfo{
    amountToBeAdded: number;
}

interface ICardDetails {
    cardName: string;
    cardNumber: string;
    cvvNumber: string;
    expiryMonth: string;
    expiryYear: string;
}

interface ICardErrorMessage {
    cardNameErrorMessage: string;
    cardNumberErrorMessage: string;
    cvvNumberErrorMessage: string;
    expiryMonthErrorMessage: string;
    expiryYearErrorMessage: string;
}


function AddMoneyInAccountFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

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

    const [showAmountContainer, setShowAmountContainer] = useState<boolean>(true);
    const [amount, setAmount] = useState<string>('');
    const [proceedToPayment, setProceedToPayment] = useState<boolean>(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false);

    const [cardDetails, setCardDetails] = useState<ICardDetails>({
        cardName: "",
        cardNumber: "",
        cvvNumber: "",
        expiryMonth: "",
        expiryYear: ""
    });
    const cardName: string = cardDetails.cardName;
    const cardNumber: string = cardDetails.cardNumber;
    const cvvNumber: string = cardDetails.cvvNumber;
    const expiryMonth: string = cardDetails.expiryMonth;
    const expiryYear: string = cardDetails.expiryYear;

    const [cardErrorMessage, setCardErrorMesssage] = useState<ICardErrorMessage>({
        cardNameErrorMessage: "",
        cardNumberErrorMessage: "",
        cvvNumberErrorMessage: "",
        expiryMonthErrorMessage: "",
        expiryYearErrorMessage: ""
    });
    const cardNameErrorMessage: string = cardErrorMessage.cardNameErrorMessage;
    const cardNumberErrorMessage: string = cardErrorMessage.cardNumberErrorMessage;
    const cvvNumberErrorMessage: string = cardErrorMessage.cvvNumberErrorMessage;
    const expiryMonthErrorMessage: string = cardErrorMessage.expiryMonthErrorMessage;
    const expiryYearErrorMessage: string = cardErrorMessage.expiryYearErrorMessage;

    const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string>('');
    const [paymentErrorMessage, setPaymentErrorMessage] = useState<string>('');

    
    function cardDetailsChangeHandler(event: React.ChangeEvent<HTMLInputElement>){
        let name: string = event.target.name;
        let value: string = event.target.value;
        if(name === "cardName"){
            value = value.toUpperCase();
            setCardDetails((previousInput)=>({
                ...previousInput,
                [name]: value
            }));
        }
        else if(name === "cardNumber"){
            value = value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            if(value.length <= 19){
                setCardDetails((previousInput)=>({
                    ...previousInput,
                    [name]: value
                }));
            }
        }
        else if(name === "cvvNumber"){
            value = value.replace(/\D/g, '');
            if(value.length <= 3){
                setCardDetails((previousInput)=>({
                    ...previousInput,
                    [name]: value
                }));
            }
        }
        else if(name === "expiryYear"){
            if(value.toString().length <= 4){
                setCardDetails((previousInput)=>({
                    ...previousInput,
                    [name]: value
                }));
            }
        }
        else if(name === "expiryMonth"){
            if(value.toString().length <= 2){
                setCardDetails((previousInput)=>({
                    ...previousInput,
                    [name]: value
                }));
            }
        }    
    }

    function proceedClickHandler(){
        setProceedToPayment(false);
        if(Number(amount) >= 1000){
            setProceedToPayment(true);
            setShowAmountContainer(false);
        }
    }

    function editAmountHandler(){
        setShowAmountContainer(true);
        setProceedToPayment(false);
    }

    async function cardDetailsSubmitHandler(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const errorStateMessage = {
            cardNameErrorMessage: "",
            cardNumberErrorMessage: "",
            cvvNumberErrorMessage: "",
            expiryMonthErrorMessage: "",
            expiryYearErrorMessage: ""
        };
        setPaymentSuccessMessage('');
        setPaymentErrorMessage('');
        if(cardName !== "" && cardNumber !== "" && cvvNumber !== "" && expiryMonth !== "" && expiryYear !== ""){
            if(cardNumber.length === 19 && cvvNumber.length === 3 && Number(expiryMonth) <= 12 && expiryYear.toString().length === 4){
                try {
                    setIsPaymentProcessing(true);
                    const amountInfo: IAmountInfo = {
                        amountToBeAdded: Number(amount)
                    }
                    const transactionResponse: Response = await fetch(`/api/account-balance-user/add-transaction-amount-add-account/${loginUserId}`, {
                        method: 'POST',
                        body: JSON.stringify(amountInfo),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    });
                    const transactionData: AddTransactionAddMoneyApiResponse = await transactionResponse.json();
                    if(transactionResponse.status === 200){
                        const updatedAccountBalanceResponse: Response = await fetch(`/api/account-balance-user/update-account-balance/add-money-in-account/${loginUserId}`, {
                            method: 'PATCH',
                            body: JSON.stringify(amountInfo),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            }
                        });
                        const updatedAccountBalanceData: AddMoneyToAccountApiResponse = await updatedAccountBalanceResponse.json();
                        if(updatedAccountBalanceResponse.status === 200){
                            if('message' in updatedAccountBalanceData){
                                setPaymentSuccessMessage(updatedAccountBalanceData.message);
                            }
                            setCardDetails({
                                cardName: "",
                                cardNumber: "",
                                cvvNumber: "",
                                expiryMonth: "",
                                expiryYear: ""
                            });
                        }
                        else{
                            if('errorMessage' in updatedAccountBalanceData){
                                setPaymentErrorMessage(updatedAccountBalanceData.errorMessage);
                            }
                        }
                    }
                    else{
                        if('errorMessage' in transactionData){
                            setPaymentErrorMessage(transactionData.errorMessage);
                        }
                    }
                } 
                catch (error) {
                    console.log(error);
                }
                finally {
                    setIsPaymentProcessing(false);
                }
            }
            else{
                if(cardNumber.length !== 19){
                    errorStateMessage.cardNumberErrorMessage = incorrectCardDetailsErrorConstant.CARD_NUMBER_SHOULD_BE_16_DIGITS;
                }
                if(cvvNumber.length !== 3){
                    errorStateMessage.cvvNumberErrorMessage = incorrectCardDetailsErrorConstant.CVV_NUMBER_SHOULD_BE_3_DIGITS;
                }
                if(Number(expiryMonth) > 12){
                    errorStateMessage.expiryMonthErrorMessage = incorrectCardDetailsErrorConstant.INVALID_EXIPY_MONTH;
                }
                if(expiryYear.toString().length !== 4){
                    errorStateMessage.expiryYearErrorMessage = incorrectCardDetailsErrorConstant.INVALID_EXPIRY_YEAR;
                }
            }
        }
        else{
            if(cardName === ""){
                errorStateMessage.cardNameErrorMessage = incorrectCardDetailsErrorConstant.ENTER_CARD_HOLDER_NAME;
            }
            if(cardNumber === ""){
                errorStateMessage.cardNumberErrorMessage = incorrectCardDetailsErrorConstant.ENTER_CARD_NUMBER;
            }
            if(cvvNumber === ""){
                errorStateMessage.cvvNumberErrorMessage = incorrectCardDetailsErrorConstant.ENTER_CARD_CVV_NUMBER;
            }
            if(expiryMonth === ""){
                errorStateMessage.expiryMonthErrorMessage = incorrectCardDetailsErrorConstant.ENTER_CARD_EXPIRY_MONTH;
            }
            if(expiryYear === ""){
                errorStateMessage.expiryYearErrorMessage = incorrectCardDetailsErrorConstant.ENTER_CARD_EXPIRY_YEAR;
            }
        } 
        setCardErrorMesssage(errorStateMessage);
    }


    return (
        <div className="m-[3.5%]">

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
                    <Link href={`/profile-home-page/add-money-account/${loginUserId}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            ADD MONEY IN ACCOUNT 
                        </span>
                    </Link>
                </p>
            </div>

            <h2 className="text-[1.6rem] mb-[1.25%] font-semibold">
                Add Money to Your Account
            </h2>

            {showAmountContainer &&
            <div className="my-4">   
                <label htmlFor="amount-add">
                    <div className="flex flex-row p-2 w-full">
                        <div className="w-1/4 font-bold text-lg">
                            Enter the Amount (in {CURRENCY_SYMBOL}): 
                        </div>
                        <div className="w-1/2">
                            <input 
                                id="amount-add" 
                                type="number" 
                                min="1000" 
                                value={amount} 
                                onChange={(event)=>setAmount(event.target.value)}
                                className="w-full p-2 text-base font-semibold border-2 border-green-600 bg-cyan-50 text-center focus:outline-none focus:border-darkmagenta"
                            />
                            <p className="text-sm text-indigo-700 mt-1">Minimum {convertToINR(1000)} to be added</p>
                        </div>
                        <div className="w-1/4 flex justify-center items-center">
                            <Button onClick={proceedClickHandler} size="medium" variant="outlined" color="success">
                                Proceed
                            </Button>
                        </div>
                    </div>
                </label>
            </div>
            }
            
            
            {proceedToPayment &&
            <div className="m-8 p-4 border-2 border-sienna bg-seashell"> 
                <h2 className="text-xl font-semibold mb-4">
                    Enter Your Card Details
                </h2>
                <form onSubmit={cardDetailsSubmitHandler}>
                    
                    <label htmlFor="card-name">
                        <div className="flex flex-row p-3 w-full mb-4">
                            <div className="w-1/3 text-lg font-medium">Name On the Card</div>
                            <div className={cardNameErrorMessage === '' ? 'w-2/3' : 'w-2/3 border-2 border-red-500'}>
                                <input 
                                    type="text"
                                    name="cardName"
                                    placeholder="Enter Name on Card"
                                    id="card-name"
                                    onChange={cardDetailsChangeHandler}
                                    className="w-full p-2 text-base font-semibold bg-white border-2 border-gray-200 focus:outline-none focus:border-green-400"
                                    value={cardName}
                                />
                                <p className="text-sm text-red-600 mt-1">{cardNameErrorMessage}</p>
                            </div>
                        </div>
                    </label>
                    
                    <label htmlFor="card-number">
                        <div className="flex flex-row p-3 w-full mb-4">
                            <div className="w-1/3 text-lg font-medium">Card Number</div>
                            <div className={cardNumberErrorMessage === '' ? 'w-2/3' : 'w-2/3 border-2 border-red-500'}>
                                <input 
                                    type="text"
                                    name="cardNumber"
                                    placeholder="Enter Card Number"
                                    id="card-number"
                                    onChange={cardDetailsChangeHandler}
                                    className="w-full p-2 text-base font-semibold bg-white border-2 border-gray-200 focus:outline-none focus:border-green-400"
                                    value={cardNumber}
                                />
                                <p className="text-sm text-red-600 mt-1">{cardNumberErrorMessage}</p>
                            </div>
                        </div>
                    </label>
                    
                    <label htmlFor="cvv">
                        <div className="flex flex-row p-3 w-full mb-4">
                            <div className="w-1/3 text-lg font-medium">CVV</div>
                            <div className={cvvNumberErrorMessage === '' ? 'w-2/3' : 'w-2/3 border-2 border-red-500'}>
                                <input 
                                    type="text"
                                    name="cvvNumber"
                                    placeholder="Enter CVV"
                                    id="cvv"
                                    className="w-full p-2 text-base font-semibold bg-white border-2 border-gray-200 focus:outline-none focus:border-green-400"
                                    onChange={cardDetailsChangeHandler}
                                    value={cvvNumber}
                                />
                                <p className="text-sm text-red-600 mt-1">{cvvNumberErrorMessage}</p>
                            </div>
                        </div>
                    </label>
                    
                    <label htmlFor="expiry-month">
                        <div className="flex flex-row p-3 w-full mb-4">
                            <div className="w-1/3 text-lg font-medium">Expiry Month</div>
                            <div className={expiryMonthErrorMessage === '' ? 'w-2/3' : 'w-2/3 border-2 border-red-500'}>
                                <input 
                                    type="number"
                                    name="expiryMonth"
                                    placeholder="Enter Expiry Month"
                                    id="expiry-month"
                                    onChange={cardDetailsChangeHandler}
                                    className="w-full p-2 text-base font-semibold bg-white border-2 border-gray-200 focus:outline-none focus:border-green-400"
                                    value={expiryMonth}
                                />
                                <p className="text-sm text-red-600 mt-1">{expiryMonthErrorMessage}</p>
                            </div>
                        </div>
                    </label>

                    <label htmlFor="expiry-year">
                        <div className="flex flex-row p-3 w-full mb-4">
                            <div className="w-1/3 text-lg font-medium">Expiry Year</div>
                            <div className={expiryYearErrorMessage === '' ? 'w-2/3' : 'w-2/3 border-2 border-red-500'}>
                                <input 
                                    type="number"
                                    name="expiryYear"
                                    placeholder="Enter Expiry Year"
                                    id="expiry-year"
                                    onChange={cardDetailsChangeHandler}
                                    className="w-full p-2 text-base font-semibold bg-white border-2 border-gray-200 focus:outline-none focus:border-green-400"
                                    value={expiryYear}
                                />
                                <p className="text-sm text-red-600 mt-1">{expiryYearErrorMessage}</p>
                            </div>
                        </div>
                    </label>

                    <label htmlFor="amount-add">
                        <div className="flex flex-row p-3 w-full mb-4">
                            <div className="w-1/3 text-lg font-medium">
                                Amount To Be Added
                            </div>
                            <div className="w-2/3 flex flex-row items-center space-x-4">
                                <input 
                                    type="number"
                                    name="amount-add"
                                    id="amount-add"
                                    value={amount}
                                    className="w-4/5 p-2 font-semibold text-base border-2 border-gray-300 bg-gray-100 cursor-not-allowed"
                                    disabled
                                />
                                <p 
                                    className="text-blue-600 hover:underline hover:cursor-pointer" 
                                    onClick={editAmountHandler}
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} /> Edit
                                </p>
                            </div>
                        </div>
                    </label>

                    {!isPaymentProcessing &&
                        <div className="flex items-center justify-center mt-5 mb-4">
                            <Button type="submit" color="success" variant="contained"> 
                                Proceed 
                            </Button>
                        </div>
                    }

                    {isPaymentProcessing &&
                        <div className="flex items-center justify-center mt-5 mb-4">
                            <Button color="success" variant="contained" disabled> 
                                Proceed 
                            </Button>
                        </div>
                    }

                    {paymentSuccessMessage != '' &&
                        <div className="flex items-center justify-center font-bold">
                            <p className="text-green-600">
                                {paymentSuccessMessage}
                            </p>
                        </div>
                    }

                    {paymentErrorMessage != '' &&
                        <div className="flex items-center justify-center font-bold">
                            <p className="text-red-600">
                                {paymentErrorMessage}
                            </p>
                        </div>
                    }

                </form>
            </div>    
            }
        </div>
    );
}


function AddMoneyInAccount(){
    return (
        <ErrorBoundary>
            <AddMoneyInAccountFunctionalComponent />
        </ErrorBoundary>
    );
}


export default AddMoneyInAccount