'use client'
import Button from '@mui/material/Button';

import { useAppDispatch } from "@/redux store/hooks";
import { deleteParticularBookingFromEventMeetingCart } from "@/redux store/features/Booking Features/eventMeetingRoomBookingCartSlice";
import { convertToINR } from '@/functions/currency';

import EventMeetingEachDayNonContinuous from './EventMeetingEachDayNonContinuous';

import { NonContinuousMultipleDatesBookingDetailsInterface, NonContinuousMultipleDatesDateBookingDetailsWithPrice } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';


interface IPropsEventMeetingMultipleDateNonContinuousCartComponent{
    eachEventMeetingInCart: NonContinuousMultipleDatesBookingDetailsInterface;
}


function EventMeetingMultipleDateNonContinuousCartComponent(props: IPropsEventMeetingMultipleDateNonContinuousCartComponent){

    const eachEventMeetingInCart: NonContinuousMultipleDatesBookingDetailsInterface = props.eachEventMeetingInCart;
    const dispatch = useAppDispatch();

    function removeCartHandler(eventCartId: number){
        dispatch(deleteParticularBookingFromEventMeetingCart(eventCartId));
    }


    return (
        <div>
            <p className="font-serif text-lg font-bold mb-2">
                Meeting / Event Area Name: {eachEventMeetingInCart.meetingEventsInfoTitle}
            </p>
            
            {eachEventMeetingInCart.allDatesBookingInformation &&
                <div className="mb-4">
                    {(eachEventMeetingInCart.allDatesBookingInformation).map(function(eachBookingDate: NonContinuousMultipleDatesDateBookingDetailsWithPrice){
                        return(
                            <EventMeetingEachDayNonContinuous
                                key={eachBookingDate.dateNumber}
                                eachBookingDate={eachBookingDate} 
                            />
                        )
                   })} 
                </div>
            }
            
            <p className="font-semibold pb-2">
                <span className="font-semibold">Total Price All Rooms: </span>
                {convertToINR(eachEventMeetingInCart.totalPriceOfAllDates)}
            </p>
            
            <Button onClick={()=>removeCartHandler(eachEventMeetingInCart.eventCartId)} variant="contained">
                Remove From Cart
            </Button>
        </div>
    );
}

export default EventMeetingMultipleDateNonContinuousCartComponent;