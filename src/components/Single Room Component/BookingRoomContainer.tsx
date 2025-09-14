"use client"
import React, { useState, useEffect, useReducer, useMemo, useCallback } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import GuestRoomSection from "./GuestRoomSection";
import BookingPriceDetails from "./BookingPriceDetails";
import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary';

import { getOnlyDate, getOnlyMonth, getOnlyYear, getOnlyDay, nextDay } from "@/functions/date";
import { convertDateTextToDate } from "@/functions/date";
import { getAllElementsInArrayFormatFromStartToEndOfNumber } from "@/functions/array";
import { useAppDispatch, useAppSelector } from "@/redux store/hooks";
import { addNewBookingToRoomCart } from "@/redux store/features/Booking Features/roomBookingCartSlice";
import { getRoomsSuitesEachDayPrice } from "@/redux store/features/Price Features/roomsSuitesEachDayPriceSlice";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";
import { roomsSuitesSelectionErrorConstants } from "@/constant string files/roomsSuitesSelectionErrorConstants";
import { INFORMATION_ADD_TO_CART_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants";
import { roomCounterConstant } from "@/constant string files/roomsImportantConstants";

import { Room } from '@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface';
import { LoginUserDetails } from '@/redux store/features/Auth Features/loginUserDetailsSlice';
import { RoomWithDateDetails, DateDetail, RoomSuitesEachDayInfoRespone } from "@/interface/Rooms and Suites Interface/eachDayRoomSuitesInfoInterface";
import { ParticularRoomInfoInterface, RoomsSuitesBookingDetailsInterface, IRoomsDetailsForCart } from "@/interface/Rooms and Suites Interface/roomsSuitesBookingInterface";
import { AddRoomsSuitesToCartApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";
import { RoomsSuitesAvailabilityCheckApiResponse } from "@/interface/Rooms and Suites Interface/roomsSuitesAvailabilityCheckApiResponse";


const modalBoxStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    border: '4px solid #000',
    boxShadow: 24,
    p: 2,
};


interface IPropsBookingRoomContainer{
    roomInfo: Room;
}

interface RoomCountState {
    roomsCount: number;
}

type RoomCounterAction =
  | { type: typeof roomCounterConstant.INCREASE }
  | { type: typeof roomCounterConstant.DECREASE };

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];


const initialRoomCount = {
    roomsCount: 1
}

function roomCounterReducer(state: RoomCountState, action: RoomCounterAction){
    switch (action.type) {
        case roomCounterConstant.INCREASE:
            return {
                ...state,
                roomsCount: state.roomsCount + 1
            }

        case roomCounterConstant.DECREASE:
            return {
                ...state,
                roomsCount: state.roomsCount - 1
            }
    
        default:
            return state;
    }
}

function BookingRoomContainerFunctionalComponent(props: IPropsBookingRoomContainer) {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserIdDetails: LoginUserDetails | null = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    useEffect(()=>{
        dispatch(getRoomsSuitesEachDayPrice());
        fetchRoomsSuitesEachDayData();
    },[]);

    const [roomsWithDateInformation, setRoomsWithDateInformation] = useState<RoomWithDateDetails | null>(null);

    const roomInfo: Room = props.roomInfo;
    const roomTitle: string = roomInfo.title;
    const roomPath: string = roomInfo.path;

    const todayDate: string = new Date().toISOString().split("T")[0];
    const today: Date = new Date(todayDate);

    const [roomCountState, roomCountDispatch] = useReducer(roomCounterReducer, initialRoomCount);
    const roomsCount: number = roomCountState.roomsCount;

    const [guestRoomsDetails, setGuestRoomsDetails] = useState<ParticularRoomInfoInterface[]>([]);
    const [showViewAvailablityButton, setShowViewAvailablityButton] = useState<boolean>(true);
    const [isViewAvailabilityButtonDisabled, setIsViewAvailabilityButtonDisabled] = useState<boolean>(false);
    const [showAddCartButton, setShowAddCartButton] = useState<boolean>(false);
    const [showError, setShowError] = useState<string>('');
    const [roomAddedToCart, setRoomAddedToCart] = useState<boolean>(false);
    const [isDataSavingToCart, setIsDataSavingToCart] = useState<boolean>(false);
    const [roomsDetailsAddedToCart, setRoomsDetailsAddedToCart] = useState<RoomsSuitesBookingDetailsInterface | undefined>();
    
    // let totalGuestCount = 0;
    // for(let i = 0; i < guestRoomsDetails.length; i++){
    //     totalGuestCount = totalGuestCount + guestRoomsDetails[i].total;
    // }

    const totalGuestCount: number = useMemo(function(){
        const initialTotalGuestCount = 0;
        const totalNoOfGuest = guestRoomsDetails.reduce(function(accumulator, currValue){
            const currentRoomGuest = currValue.total;
            return accumulator + currentRoomGuest;
        },initialTotalGuestCount);
        return totalNoOfGuest;
    },[guestRoomsDetails]);


    let startingPriceOfRoom: null | number = null;
    let roomBookingLastDateString: string | null = null;
    let roomBookingLastDate: Date = new Date('9999-12-31');

    if(roomsWithDateInformation != null){
        const dateDetailsOfRoom: DateDetail[] = roomsWithDateInformation.dateDetails;
        startingPriceOfRoom = getRoomStartingPrice(dateDetailsOfRoom);
        roomBookingLastDateString = getRoomBookingLastDate(dateDetailsOfRoom);
        roomBookingLastDate = new Date(roomBookingLastDateString)
    }

    const [checkinDate, setCheckinDate] = useState<Date>(today);
    const defaultCheckoutDate: Date = nextDay(new Date(checkinDate));
    const [checkoutDate, setCheckoutDate] = useState<Date>(defaultCheckoutDate);

    const [showCheckinCalender, setShowCheckinCalender] = useState<boolean>(false);
    const [showCheckoutCalender, setShowCheckoutCalender] = useState<boolean>(false);

    const [noOfGuests, setNoOfGuests] = useState<number>(0);

    const [showGuestModal, setShowGuestModal] = useState<boolean>(false);

    
    // const roomsArray = new Array();
    // for(let i = 1; i <= roomsCount; i++){
    //     roomsArray.push(i);
    // }

    const roomsArray: number[] = useMemo(function(){
        const arrayOfRoomsNumber: number[] = getAllElementsInArrayFormatFromStartToEndOfNumber(roomsCount);
        return arrayOfRoomsNumber;
    }, [roomsCount]);

    const [totalPriceOfAllRooms, setTotalPrice] = useState<number>(0);

    function getTotalPriceOfRoom(totalPriceOfAllRooms: number): void {
        setTotalPrice(totalPriceOfAllRooms);
    }

    function loginButtonClickHandler(event: React.MouseEvent<HTMLButtonElement>): void{
        event.preventDefault();
        const loginPageCalledFrom: string = `Rooms and Suites/ ${roomTitle} Page`;
        const loginRedirectPage: string = `/rooms-suites/${roomPath}`;
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/login');
    }

    async function fetchRoomsSuitesEachDayData(): Promise<void>{
        try{
            const response: Response = await fetch('/api/hotel-booking-information/room-and-suites-information/each-day-information/');
            const data: RoomSuitesEachDayInfoRespone = await response.json();
            const allRoomsWithDate: RoomWithDateDetails[] = data.roomsWithDate;
            const particularRoomEachDayInfo: RoomWithDateDetails | undefined = allRoomsWithDate.find(function(eachRoomWithDate: RoomWithDateDetails){
                return eachRoomWithDate.roomTitle == roomTitle
            });
            if(!particularRoomEachDayInfo){
                throw new Error("Missing particularRoomEachDayInfo");
            }
            setRoomsWithDateInformation(particularRoomEachDayInfo);
        }
        catch(error){
            console.log(error);
        }
    }

    function getRoomStartingPrice(dateDetailsOfParticularRoom: DateDetail[]): number {
        dateDetailsOfParticularRoom.sort((a,b) => a.price - b.price);
        const minimumPriceDateDetails: DateDetail = dateDetailsOfParticularRoom[0];
        const minimumPrice: number = minimumPriceDateDetails.price;
        return minimumPrice;
    }

    function getRoomBookingLastDate(dateDetailsOfRoom: DateDetail[]): string{
        dateDetailsOfRoom.sort(function(d1, d2){
            const date1 = new Date(d1.date).getTime();
            const date2 = new Date(d2.date).getTime();
            return date2 - date1;
        });
        const lastDateISO: string = new Date(dateDetailsOfRoom[0].date).toISOString(); // convert Date to string
        const lastDate: string = lastDateISO.split("T")[0]; // safely split
        return lastDate;
    }

    function clickCheckIn(event: React.MouseEvent<HTMLDivElement>) {
        setShowCheckinCalender(!showCheckinCalender);
    }

    function clickCheckOut(event: React.MouseEvent<HTMLDivElement>) {
        setShowCheckoutCalender(!showCheckoutCalender); 
    }

    function checkinChangeHandlerFunction(value: Value, _event: React.MouseEvent<HTMLButtonElement>): void{
        const selectedDate: Date = Array.isArray(value) ? value[0]! : value!;
        setCheckinDate(selectedDate);
        setShowCheckinCalender(!showCheckinCalender);
        setCheckoutDate(nextDay(new Date(selectedDate)));
    }

    const checkinChangeHandler = useCallback(checkinChangeHandlerFunction, [showCheckinCalender]);


    function checkoutChangeHandlerFunction(value: Value, _event: React.MouseEvent<HTMLButtonElement>): void{
        const selectedDate: Date = Array.isArray(value) ? value[0]! : value!;
        setCheckoutDate(selectedDate);
        setShowCheckoutCalender(!showCheckoutCalender); 
    }

    const checkoutChangeHandler = useCallback(checkoutChangeHandlerFunction, [showCheckoutCalender]);


    function increaseRoomHandler(){
        roomCountDispatch({ type: roomCounterConstant.INCREASE });
    }

    function decreaseRoomHandler(){
        roomCountDispatch({ type: roomCounterConstant.DECREASE });
    }


    function getGuestData(guestRoomData: ParticularRoomInfoInterface): void {
        const isSameRoomNoPresent: boolean = guestRoomsDetails.some(function(eachRoom: ParticularRoomInfoInterface){
            return (eachRoom.roomNo == guestRoomData.roomNo);
        });
        if(isSameRoomNoPresent){
            const oldGuestRoomDetails: ParticularRoomInfoInterface[] = guestRoomsDetails.filter(function(eachRoom){
                return (eachRoom.roomNo != guestRoomData.roomNo);
            });
            setGuestRoomsDetails([...oldGuestRoomDetails, guestRoomData]);
        }
        else{
            setGuestRoomsDetails([...guestRoomsDetails, guestRoomData]);
        }
    }


    function guestSaveHandlerFunction(){
        setNoOfGuests(totalGuestCount);
        setShowGuestModal(false);
    }

    const guestSaveHandler = useCallback(guestSaveHandlerFunction, [totalGuestCount]);


    async function viewAvalabilityHandlerFunction() { 
        setShowAddCartButton(false);
        setIsViewAvailabilityButtonDisabled(true);
        setShowError('');
        const bookingDetails: RoomsSuitesBookingDetailsInterface = {
            roomTitle,
            checkinDate,
            checkoutDate,
            totalRooms: roomsCount,
            totalGuest: noOfGuests,
            guestRoomsDetails
        }
        if(noOfGuests == 0){
            setShowError(roomsSuitesSelectionErrorConstants.GUEST_CANNOT_ZERO);
        }
        
        else if(roomsCount != guestRoomsDetails.length){
            setShowError(roomsSuitesSelectionErrorConstants.ALL_ROOMS_GUEST_DETAILS_REQUIRED);
        }
        else{
            try {
                const response: Response = await fetch(`/api/add-cart-availability-check/rooms-suites`, {
                    method: 'POST',
                    body: JSON.stringify(bookingDetails),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const data: RoomsSuitesAvailabilityCheckApiResponse = await response.json();
                if(response.status === 200){
                    setShowError('');
                    setShowAddCartButton(true);
                    setRoomsDetailsAddedToCart(bookingDetails);
                }
                if(response.status !== 200){
                    if('errorMessage' in data){
                        setShowError(data.errorMessage);
                    }
                    setShowAddCartButton(false);
                }
            } 
            catch (error) {
                console.log(error)
            }
        }
        setShowViewAvailablityButton(false);
        setIsViewAvailabilityButtonDisabled(false);
    }

    const viewAvalabilityHandler = useCallback(viewAvalabilityHandlerFunction, [checkinDate, checkoutDate, roomsCount, noOfGuests, guestRoomsDetails]);


    function addCartHandlerFunction() {
        if(roomsDetailsAddedToCart){
            const roomsBookingDetails = JSON.parse(JSON.stringify(roomsDetailsAddedToCart)) as RoomsSuitesBookingDetailsInterface;
            
            if(typeof roomsDetailsAddedToCart.checkinDate == "string"){
                roomsBookingDetails.checkinDate = convertDateTextToDate(roomsDetailsAddedToCart.checkinDate).toString();
            }
            else if(roomsDetailsAddedToCart.checkinDate instanceof Date){
                roomsBookingDetails.checkinDate = convertDateTextToDate(roomsDetailsAddedToCart.checkinDate.toISOString()).toString();
            }
            
            if(typeof roomsDetailsAddedToCart.checkoutDate == "string"){
                roomsBookingDetails.checkoutDate = convertDateTextToDate(roomsDetailsAddedToCart.checkoutDate).toString();
            }
            else if(roomsDetailsAddedToCart.checkoutDate instanceof Date){
                roomsBookingDetails.checkoutDate = convertDateTextToDate(roomsDetailsAddedToCart.checkoutDate.toISOString()).toString();
            }
            
            const roomsDetailsForCart: IRoomsDetailsForCart = {
                roomCartId: Date.now(),
                ...roomsBookingDetails, 
                totalPriceOfAllRooms
            }
            setIsDataSavingToCart(true);
            console.log(roomsDetailsForCart);
            if(loginUserIdDetails == null){
                dispatch(addNewBookingToRoomCart(roomsDetailsForCart));
                setRoomAddedToCart(true);
                setIsDataSavingToCart(false);
            }
            if(loginUserIdDetails !== null){
                addToCartDatabaseHandlerFunction(roomsDetailsForCart);
            }   
        }  
    }

    async function addToCartDatabaseHandlerFunction(roomsDetailsForCart: IRoomsDetailsForCart){  
        try {
            if(loginUserIdDetails){
               const loginUserId: string = loginUserIdDetails.userId;
                const response: Response = await fetch(`/api/add-cart/rooms-suites/${loginUserId}`, {
                    method: 'POST',
                    body: JSON.stringify(roomsDetailsForCart),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                const data: AddRoomsSuitesToCartApiResponse = await response.json();
                if(response.status === 200){
                    if('message' in data){
                        if(data.message === INFORMATION_ADD_TO_CART_SUCCESSFUL){
                            setRoomAddedToCart(true);
                        }
                    }
                } 
            }         
        } catch (error) {
            console.log(error);
        }
        finally{
            setIsDataSavingToCart(false);
        }
    }

    const addCartHandler = useCallback(addCartHandlerFunction, [dispatch, roomsDetailsAddedToCart, totalPriceOfAllRooms]);
   
    
    
    return (
        <div className="p-4">
            <h3 className="text-[1.35rem] italic font-sans">Book your Stay</h3>

            <div className="border border-black my-4 mr-8 mb-8 p-6">
                <div className="w-full flex flex-row my-4">

                    <div className="border border-black p-4 w-1/2 mx-2 flex">
                        <div className="pr-5 cursor-pointer" onClick={clickCheckIn}>
                            <p className="text-xl">Checkin</p>
                            <p className="text-lg">{getOnlyDate(checkinDate)}</p>
                            <p>{getOnlyMonth(checkinDate)} {getOnlyYear(checkinDate)}</p>
                            <p>{getOnlyDay(checkinDate)}</p>
                        </div>
                        {showCheckinCalender && 
                        <Calendar 
                            onChange={checkinChangeHandler} 
                            minDate={today} 
                            maxDate={roomBookingLastDate}
                            value={checkinDate} 
                        />
                        }
                    </div>
                    
                    <div className="border border-black p-4 w-1/2 mx-2 flex">
                        <div className="pr-5 cursor-pointer" onClick={clickCheckOut}>
                            <p className="text-xl">Checkout</p>
                            <p className="text-lg">{getOnlyDate(checkoutDate)}</p>
                            <p>{getOnlyMonth(checkoutDate)} {getOnlyYear(checkoutDate)}</p>
                            <p>{getOnlyDay(checkoutDate)}</p>
                        </div>
                        {showCheckoutCalender && 
                        <Calendar 
                            onChange={checkoutChangeHandler} 
                            minDate={nextDay(checkinDate)} 
                            maxDate={nextDay(roomBookingLastDate)}
                            value={checkoutDate} 
                        />
                        }
                    </div>

                </div>

                <div className="w-full flex flex-row my-4">
                    <div className="w-1/2 p-4 mx-2 border border-black">
                        <p>Rooms</p>
                        <button 
                            disabled={roomsCount==1} 
                            onClick={decreaseRoomHandler} 
                            className="py-1 px-2 mx-1 border border-gray-400 rounded"
                        > 
                            - 
                        </button>
                        <span className="py-1 px-4 inline-block">{roomsCount}</span>
                        <button 
                            onClick={increaseRoomHandler} 
                            className="py-1 px-2 mx-1 border border-gray-400 rounded"
                        > 
                            + 
                        </button>
                    </div>

                    <div className="w-1/2 p-4 mx-2 border border-black flex flex-row">
                        <div className="w-[40%]">
                            <p>Guests</p>
                            <p>{noOfGuests}</p>
                            <p className="text-blue-600 hover:text-orange-500 cursor-pointer" onClick={()=> setShowGuestModal(true)}>
                                Edit Guest Details
                            </p>
                        </div>

                        <Modal 
                            open={showGuestModal} 
                            onClose={()=>setShowGuestModal(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={modalBoxStyle}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Please find the details of guests for each room
                                </Typography>                           
                                <Typography id="modal-modal-description" component="div">
                                    <div className="w-full">
                                        {roomsArray.map(function(element: number){
                                            const roomGuestDetails: ParticularRoomInfoInterface | undefined = guestRoomsDetails.find(function(eachRoom: ParticularRoomInfoInterface){
                                                return (eachRoom.roomNo == element);
                                            });
                                            return (
                                                <GuestRoomSection 
                                                    key={element} 
                                                    roomNo={element} 
                                                    roomTitle={roomTitle}
                                                    onGetGuestDataParticularRoom={getGuestData} 
                                                    roomGuestDetails={roomGuestDetails} 
                                                />
                                            );                                           
                                        })}
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        <Button variant="outlined" onClick={()=>setShowGuestModal(false)}>
                                            Close
                                        </Button>
                                        <Button variant="outlined" onClick={guestSaveHandler}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </Typography>
                            </Box>
                        </Modal>
                    </div>
                </div>

                {showViewAvailablityButton && 
                <div className="flex items-center justify-center my-4">
                    {!isViewAvailabilityButtonDisabled &&
                        <Button onClick={viewAvalabilityHandler} variant="contained">
                            View Availability
                        </Button>
                    }
                    {isViewAvailabilityButtonDisabled &&
                        <Button disabled variant="contained">
                            View Availability
                        </Button>
                    }
                </div>
                }

                {(showError != '' && !showViewAvailablityButton) &&
                <div className="flex flex-col items-center justify-center my-4">
                    <p className="text-red-600 font-semibold p-2 mb-2 bg-cyan-100">
                        {showError}
                    </p>
                    <Button variant="contained" onClick={()=>setShowViewAvailablityButton(true)}>
                        Close
                    </Button>
                </div>
                }

                {(!showViewAvailablityButton && showAddCartButton && !roomAddedToCart) && 
                <div className="flex flex-col items-center justify-center my-4">
                    <p className="text-green-600 font-semibold p-2 mb-2 bg-cyan-100">
                        The Room is available on Choosen Date
                    </p>
                    <BookingPriceDetails 
                        roomDetailsForCart={roomsDetailsAddedToCart} 
                        setTotalPriceOfRoom={getTotalPriceOfRoom} 
                    />
                    <div className="m-4">
                        <Button onClick={()=>setShowViewAvailablityButton(true)} variant="contained">
                            Edit Room Info
                        </Button>
                    </div>
                    {!isDataSavingToCart &&
                    <Button onClick={addCartHandler} variant="contained">
                        Add to Cart 
                    </Button>
                    }

                    {isDataSavingToCart &&
                    <Button variant="contained" disabled>Please Wait</Button>
                    }
                </div>
                }

                
                {roomAddedToCart && 
                <div className="flex items-center justify-center mt-4">
                    <p className="p-2 text-green-600 bg-green-100 font-bold">
                        Room has been Successfully Added to Cart
                    </p>
                </div>
                }

                {loginUserIdDetails === null &&
                <div className="mt-10 flex items-center justify-center">
                    <Button onClick={loginButtonClickHandler} variant="contained">
                        Proceed to Login
                    </Button>
                </div>
                }
            </div>
            
        </div>
    );
}


function BookingRoomContainer(props: IPropsBookingRoomContainer) {
    return (
        <ErrorBoundary>
            <BookingRoomContainerFunctionalComponent roomInfo={props.roomInfo} />
        </ErrorBoundary>
    );
}


export default BookingRoomContainer;