'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import UserEventMeetingSingleDateCart from "./User SubEvent Carts Component/UserEventMeetingSingleDateCart";
import UserEventMeetingMultipleDateContinuousCart from "./User SubEvent Carts Component/UserEventMeetingMultipleDateContinuousCart";
import UserEventMeetingMultipleDateNonContinuousCart from "./User SubEvent Carts Component/UserEventMeetingMultipleDateNonContinuousCart";
import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";

import { EventMeetingRoomsInfoResponse, MeetingEventArea } from '@/interface/Event Meeting Interface/eventMeetingRoomInterface';
import { IEventMeetingRoomContinousMultipleDatesCartInformation, IEventMeetingRoomNonContinousMultipleDatesCartInformation, IEventMeetingRoomSingleDateCartInformation } from '@/interface/Event Meeting Interface/eventMeetingCartApiResponse';


interface ICartIdWithRoomBookingDateType {
    id: string;
    roomBookingDateType: string;
}

interface IPropsUserEventMeetingBookingCart{
    eventMeetingCart: (
        IEventMeetingRoomSingleDateCartInformation 
        | IEventMeetingRoomNonContinousMultipleDatesCartInformation 
        | IEventMeetingRoomContinousMultipleDatesCartInformation
        )[];
    onGetCheckIdEventMeetingCart: (idList: ICartIdWithRoomBookingDateType[]) => void;
    onRemoveEventMeetingItemFromCart: (id: string, bookingType: string) => Promise<void>;
}


function UserEventMeetingBookingCart(props: IPropsUserEventMeetingBookingCart){

    const eventMeetingCart: (IEventMeetingRoomSingleDateCartInformation | IEventMeetingRoomNonContinousMultipleDatesCartInformation | IEventMeetingRoomContinousMultipleDatesCartInformation)[] = props.eventMeetingCart;
   
    const [meetingEventsRooms, setMeetingEventsRooms] = useState<MeetingEventArea[]>([]);
    const [checkedId, setCheckedId] = useState<ICartIdWithRoomBookingDateType[]>([]);

    useEffect(()=>{
        fetchMeetingEventsRoomInformation();
    }, []);

    //props.onGetCheckIdEventMeetingCart(checkedId);
    useEffect(()=>{
        props.onGetCheckIdEventMeetingCart(checkedId);
    }, [checkedId]);

    async function fetchMeetingEventsRoomInformation(){
        try {
            const response: Response = await fetch('/api/hotel-booking-information/events-meeting-room-information/');
            const meetingEventRoomInfo: EventMeetingRoomsInfoResponse = await response.json();
            const meetingEventsRoomsInformation: MeetingEventArea[] = meetingEventRoomInfo.meetingEventsRooms;
            setMeetingEventsRooms(meetingEventsRoomsInformation);
        } catch (error) {
            console.log(error);
        }
    }


    function onRemoveEventMeetingItemFromCart(id: string, bookingType: string){
        props.onRemoveEventMeetingItemFromCart(id, bookingType);
    }

    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>, id: string, roomBookingDateType: string){
        const isChecked: boolean = event.target.checked;
        const cartIdWithRoomBookingDateType: ICartIdWithRoomBookingDateType = {
            id, 
            roomBookingDateType
        }
        if(isChecked){
            setCheckedId(function(previousCheckedItems: ICartIdWithRoomBookingDateType[]){
                return (
                    [...previousCheckedItems, cartIdWithRoomBookingDateType]
                );
            });
        }
        if(!isChecked){
            setCheckedId(checkedId.filter(function(eachIdWithRoomBookingDateType: ICartIdWithRoomBookingDateType){
                return (eachIdWithRoomBookingDateType.id !== id && eachIdWithRoomBookingDateType.roomBookingDateType !== roomBookingDateType);
            }))
        }
    }


    return (
        <div className="border border-black m-4">

            {(eventMeetingCart.length > 0) && eventMeetingCart.map(function(eachEventMeetingInCart: IEventMeetingRoomSingleDateCartInformation | IEventMeetingRoomNonContinousMultipleDatesCartInformation | IEventMeetingRoomContinousMultipleDatesCartInformation){
                const particularEventMeetingBasicInfo: MeetingEventArea | undefined = meetingEventsRooms.find(function(eachEventMeetingInHotel: MeetingEventArea){
                    return (eachEventMeetingInHotel.meetingEventAreaTitle == eachEventMeetingInCart.meetingEventsInfoTitle);
                });
                
                const checkedWithSameId: ICartIdWithRoomBookingDateType[] = checkedId.filter(function(eachIdWithRoomBookingDateType: ICartIdWithRoomBookingDateType){
                    return (eachIdWithRoomBookingDateType.id === eachEventMeetingInCart._id && eachIdWithRoomBookingDateType.roomBookingDateType === eachEventMeetingInCart.roomBookingDateType) 
                });
                //const isEventMeetingItemChecked = checkedId.includes(eachEventMeetingInCart._id);
                const isEventMeetingItemChecked: boolean = checkedWithSameId.length > 0 ? true: false;
                
                return (
                    <div key={eachEventMeetingInCart._id} className="flex flex-row p-4 m-4 border-[4px] border-gray-500">

                        {/* Checkbox */}
                        <div className="w-[2.5%] flex items-center justify-center">
                            <input 
                                type="checkbox"
                                checked={isEventMeetingItemChecked}
                                onChange={(event)=>handleCheckboxChange(event, eachEventMeetingInCart._id, eachEventMeetingInCart.roomBookingDateType)} 
                            />
                        </div>

                        {/* Image */}
                        <div className="w-[40%]">
                            {(particularEventMeetingBasicInfo) &&
                            <Image src={particularEventMeetingBasicInfo.meetingEventAreaImage} alt='meeting-event' width={400} height={200} />
                            }
                        </div>
                        
                        {/* Dynamic Booking Type Component */}
                        <div className="flex-grow">
                            {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.SINGLE_DATE) &&
                                <UserEventMeetingSingleDateCart 
                                    eachEventMeetingInCart={eachEventMeetingInCart} 
                                    onRemoveEventMeetingItemFromCart={onRemoveEventMeetingItemFromCart} 
                                />
                            }

                            {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) &&
                                <UserEventMeetingMultipleDateContinuousCart 
                                    eachEventMeetingInCart={eachEventMeetingInCart} 
                                    onRemoveEventMeetingItemFromCart={onRemoveEventMeetingItemFromCart}
                                />
                            }
                            {(eachEventMeetingInCart.roomBookingDateType == roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) &&
                                <UserEventMeetingMultipleDateNonContinuousCart 
                                    eachEventMeetingInCart={eachEventMeetingInCart} 
                                    onRemoveEventMeetingItemFromCart={onRemoveEventMeetingItemFromCart}
                                />
                            }
                        </div>
                        
                    </div>
                )
            })}
        </div>
    );
}

export default UserEventMeetingBookingCart;