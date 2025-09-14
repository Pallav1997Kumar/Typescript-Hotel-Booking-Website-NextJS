'use client'
import React, { useState, ChangeEvent, useEffect } from "react";

import UserEachRoomCart from "./UserEachRoomCart";

import { IRoomsSuitesCartInformation } from "@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse";


interface IPropsUserRoomSuiteBookingCart {
    roomSuitesCart: IRoomsSuitesCartInformation[];
    onGetCheckIdRoomsSuitesCart: (idList: string[]) => void;
    onRemoveRoomsSuitesItemFromCart: (id: string) => Promise<void>;
}


function UserRoomSuiteBookingCart(props: IPropsUserRoomSuiteBookingCart){

    const roomSuitesCart: IRoomsSuitesCartInformation[] = props.roomSuitesCart;
    const [checkedId, setCheckedId] = useState<string[]>([]);
    console.log(checkedId);

    function onRemoveRoomsSuitesItemFromCart(id: string){
        props.onRemoveRoomsSuitesItemFromCart(id);
    }

    useEffect(()=>{
        props.onGetCheckIdRoomsSuitesCart(checkedId);
    }, [checkedId]);
    //props.onGetCheckIdRoomsSuitesCart(checkedId);

    function getRoomsSuitesCheckboxInfo(event: ChangeEvent<HTMLInputElement>, id: string){
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


    return (
        <div className="border border-black m-4">
            {(roomSuitesCart.length > 0) && roomSuitesCart.map(function(eachRoomInCart: IRoomsSuitesCartInformation){
                const isRoomSuiteChecked = checkedId.includes(eachRoomInCart._id);
                return(
                    <UserEachRoomCart 
                        key={eachRoomInCart._id} 
                        isRoomSuiteChecked={isRoomSuiteChecked}
                        eachRoomInCart={eachRoomInCart} 
                        onRemoveRoomsSuitesItemFromCart={onRemoveRoomsSuitesItemFromCart}
                        onGetRoomsSuitesCheckboxInfo={getRoomsSuitesCheckboxInfo}
                    />
                )
            })}
        </div>
    );
}

export default UserRoomSuiteBookingCart;