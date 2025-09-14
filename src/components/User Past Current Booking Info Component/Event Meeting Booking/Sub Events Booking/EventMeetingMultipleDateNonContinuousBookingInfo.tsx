import { getDateTextFromFullDate } from "@/functions/date";
import { convertToINR } from "@/functions/currency";

import EventMeetingEachDayNonContinuous from './EventMeetingEachDayNonContinuous';

import { IDateBooking, INonContinousMultipleDatesBookingInfoForCustomer } from '@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse';
import { ITransactionDetailsFrontend } from '@/interface/hotelCustomersInterface';


interface IPropsEventMeetingMultipleDateNonContinuousBookingInfo {
    eachEventMeetingBookingInfo: INonContinousMultipleDatesBookingInfoForCustomer;
    transactionDetails: ITransactionDetailsFrontend;
}


function EventMeetingMultipleDateNonContinuousBookingInfo(props: IPropsEventMeetingMultipleDateNonContinuousBookingInfo){

    const eachEventMeetingBookingInfo: INonContinousMultipleDatesBookingInfoForCustomer = props.eachEventMeetingBookingInfo;
    
    const transactionDetails: ITransactionDetailsFrontend = props.transactionDetails;

    return (
        <div className="w-3/5 p-0">
            <p className="font-serif text-xl font-bold mb-1">
                Meeting / Event Area Name: {eachEventMeetingBookingInfo.meetingEventsInfoTitle}
            </p>
            
            {transactionDetails &&
                <p className="text-base mb-1">
                    <span className="font-semibold">Meeting / Event Booked On Date: </span>
                    {getDateTextFromFullDate(transactionDetails.transactionDateTime.toString())}
                </p>
            }
            
            {(eachEventMeetingBookingInfo.allDatesBookingInformation && Object.hasOwn(eachEventMeetingBookingInfo, 'allDatesBookingInformation')) &&
                <div className="mb-4">
                    {(eachEventMeetingBookingInfo.allDatesBookingInformation).map(function(eachBookingDate: IDateBooking){
                        return(
                            <EventMeetingEachDayNonContinuous 
                                eachBookingDate={eachBookingDate} 
                            />
                        )
                   })} 
                </div>
            }
            
            <p>
                <span className="font-semibold pb-2">Total Price All Rooms: </span>
                {convertToINR(eachEventMeetingBookingInfo.totalPriceOfAllDates)}
            </p>
            
        </div>
    );
}

export default EventMeetingMultipleDateNonContinuousBookingInfo;