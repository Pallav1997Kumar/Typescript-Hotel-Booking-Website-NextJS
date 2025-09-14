import Button from '@mui/material/Button';
import React from 'react';

import { convertToINR } from '@/functions/currency';

import UserEventMeetingEachDayNonContinuous from './UserEventMeetingEachDayNonContinuous';

import { IDateBooking } from '@/interface/Event Meeting Interface/eventMeetingDbModelInterface';
import { IEventMeetingRoomNonContinousMultipleDatesCartInformation } from '@/interface/Event Meeting Interface/eventMeetingCartApiResponse';




interface IPropsUserEventMeetingMultipleDateNonContinuousCart {
    eachEventMeetingInCart: IEventMeetingRoomNonContinousMultipleDatesCartInformation;
    onRemoveEventMeetingItemFromCart: (id: string, bookingType: string) => void
}


function UserEventMeetingMultipleDateNonContinuousCart(props: IPropsUserEventMeetingMultipleDateNonContinuousCart){

    const eachEventMeetingInCart: IEventMeetingRoomNonContinousMultipleDatesCartInformation = props.eachEventMeetingInCart;


    async function removeEventMeetingMultipleDatesNonContinuousItemFromCartDb(id: string, bookingType: string){
        props.onRemoveEventMeetingItemFromCart(id, bookingType);
    }


    return (
        <div className="w-[100%] p-0">
            
            <p className="font-serif text-[1.3rem] font-bold mb-2">
                Meeting / Event Area Name: {eachEventMeetingInCart.meetingEventsInfoTitle}
            </p>
            
            {(eachEventMeetingInCart.allDatesBookingInformation && Object.hasOwn(eachEventMeetingInCart, 'allDatesBookingInformation')) &&
                <div className="space-y-2">
                    {(eachEventMeetingInCart.allDatesBookingInformation).map(function(eachBookingDate: IDateBooking){
                        return(
                            <UserEventMeetingEachDayNonContinuous
                                key={eachBookingDate.dateNumber} 
                                eachBookingDate={eachBookingDate} 
                            />
                        )
                   })} 
                </div>
            }
            
            <p>
                <span className="font-semibold pb-2 inline-block">Total Price All Rooms: </span>
                {convertToINR(eachEventMeetingInCart.totalPriceOfAllDates)}
            </p>
            
            <Button 
                onClick={()=>removeEventMeetingMultipleDatesNonContinuousItemFromCartDb(eachEventMeetingInCart._id, eachEventMeetingInCart.roomBookingDateType)} 
                variant="contained"
            >
                Remove From Cart
            </Button>

        </div>
    );

}

export default UserEventMeetingMultipleDateNonContinuousCart;