'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import Button from '@mui/material/Button';

import { getDateTextFromFullDate } from "@/functions/date";
import { convertToINR } from '@/functions/currency';
 
import { Dining, DiningInfoResponse } from '@/interface/Dining Interface/hotelDiningInterface';
import { IDiningCartInformation } from '@/interface/Dining Interface/diningCartApiResponse';


interface IPropsUserDiningBookingCart{
    diningCart: IDiningCartInformation[];
    onGetCheckIdDiningCart: (idList: string[]) => void;
    onRemoveDiningItemFromCart: (id: string) => Promise<void>;
}


function UserDiningBookingCart(props: IPropsUserDiningBookingCart){

    const diningCart: IDiningCartInformation[] = props.diningCart;
    const [dining, setDining] = useState<Dining[]>([]);
    const [checkedId, setCheckedId] = useState<string[]>([]);

    useEffect(()=>{
        fetchDiningInformation();
    }, []);
    
    //props.onGetCheckIdDiningCart(checkedId);
     useEffect(()=>{
        props.onGetCheckIdDiningCart(checkedId);
    }, [checkedId]);

    async function fetchDiningInformation(){
        try {
            const response: Response = await fetch('/api/hotel-booking-information/dining-information/');
            const diningInfo: DiningInfoResponse = await response.json();
            setDining(diningInfo.dining);
        } catch (error) {
            console.log(error);
        }
    }


    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>, id: string){
        const isChecked: boolean = event.target.checked;
        if(isChecked){
            setCheckedId(function(previousCheckedItems){
                return (
                    [...previousCheckedItems, id]
                );
            });
        }
        if(!isChecked){
            setCheckedId(checkedId.filter(function(eachId){
                return (eachId !== id);
            }))
        }
    }

    function removeDiningItemFromCart(id: string){
        props.onRemoveDiningItemFromCart(id);
    }


    return (
        <div className="border border-black m-4">
            {(diningCart.length > 0) && diningCart.map(function(eachDiningInCart: IDiningCartInformation){
                const particularDiningBasicInfo: Dining | undefined = dining.find(function(eachDiningInHotel: Dining){
                    return (eachDiningInHotel.diningAreaTitle == eachDiningInCart.diningRestaurantTitle);
                });
                const isDiningItemChecked: boolean = checkedId.includes(eachDiningInCart._id);
                return (
                    <div key={eachDiningInCart._id} className="flex flex-row p-4 m-4 border-4 border-gray-500">
                        
                        {/* Checkbox */}
                        <div className="w-[2.5%] flex items-center justify-center">
                            <input 
                                type="checkbox" 
                                checked={isDiningItemChecked}
                                onChange={(event)=>handleCheckboxChange(event,eachDiningInCart._id)} 
                            />
                        </div>
                        
                        {/* Image */}
                        <div className="w-[40%]">
                            {(particularDiningBasicInfo) && 
                            <Image src={particularDiningBasicInfo.photo} alt='dining-image' width={400} height={230} />
                            }
                        </div>
                        
                        {/* Dining Info */}
                        <div className="w-[57.5%] px-4">
                            <p className="font-times text-[1.3rem] font-bold mb-2">
                                Dining Restaurant Name: {eachDiningInCart.diningRestaurantTitle} 
                            </p>
                            
                            <p className="mb-2 font-sans capitalize">
                                <span className="font-semibold">Table Booking Date: </span>
                                {getDateTextFromFullDate(eachDiningInCart.tableBookingDate.toString())}
                            </p>
                            
                            <p className="mb-2 font-sans capitalize">
                                <span className="font-semibold">Meal Type: </span>
                                {eachDiningInCart.mealType}
                            </p>
                            
                            <p className="mb-2 font-sans capitalize">
                                <span className="font-semibold">Table Booking Time: </span>
                                {eachDiningInCart.tableBookingTime}
                            </p>
                            
                            <p className="mb-2 font-sans capitalize">
                                <span className="font-semibold">Total Number Of Guest: </span>
                                {eachDiningInCart.noOfGuests}
                            </p>
                            
                            <p className="mb-2 font-sans capitalize">
                                <span className="font-semibold">Total Booking Price: </span>
                                {convertToINR(eachDiningInCart.priceForBooking)}
                            </p>
                            
                            <p className="font-semibold">Total Number Of Tables</p>
                            <div className="flex flex-row pb-4">
                                <p className="pr-6">
                                    <span className="font-semibold">Two Guest Table: </span>
                                    {eachDiningInCart.tableBookingCountDetails.tableCountTwoPerson}
                                </p>
                                <p className="pr-6">
                                    <span className="font-semibold">Four Guest Table: </span>
                                    {eachDiningInCart.tableBookingCountDetails.tableCountFourPerson}
                                </p>
                                <p className="pr-6">
                                    <span className="font-semibold">Six Guest Table: </span>
                                    {eachDiningInCart.tableBookingCountDetails.tableCountSixPerson}
                                </p>
                            </div>
                            
                            <Button 
                                onClick={()=>removeDiningItemFromCart(eachDiningInCart._id)} 
                                variant="contained"
                            >
                                Remove From Cart
                            </Button>
                            
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

export default UserDiningBookingCart;