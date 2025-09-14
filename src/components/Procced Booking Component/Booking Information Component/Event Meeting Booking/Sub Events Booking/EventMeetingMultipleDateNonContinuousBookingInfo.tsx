import EventMeetingEachDayNonContinuous from './EventMeetingEachDayNonContinuous';
import { convertToINR } from '@/functions/currency';

import { IEventMeetingRoomNonContinousMultipleDatesCartInformation } from '@/interface/Event Meeting Interface/eventMeetingCartApiResponse';
import { IDateBooking } from '@/interface/Event Meeting Interface/eventMeetingDbModelInterface';


interface IPropsEventMeetingMultipleDateNonContinuousBookingInfo {
    eachEventMeetingBookingInfo: IEventMeetingRoomNonContinousMultipleDatesCartInformation;
}


function EventMeetingMultipleDateNonContinuousBookingInfo(props: IPropsEventMeetingMultipleDateNonContinuousBookingInfo){

    const eachEventMeetingBookingInfo: IEventMeetingRoomNonContinousMultipleDatesCartInformation = props.eachEventMeetingBookingInfo;

    return (
        <div className="w-3/5 p-0">
            <p className="font-serif text-xl font-bold mb-1">
                Meeting / Event Area Name: {eachEventMeetingBookingInfo.meetingEventsInfoTitle}
            </p>
            
            {(eachEventMeetingBookingInfo.allDatesBookingInformation && Object.hasOwn(eachEventMeetingBookingInfo, 'allDatesBookingInformation')) &&
                <div className="mb-4">
                    {(eachEventMeetingBookingInfo.allDatesBookingInformation).map(function(eachBookingDate: IDateBooking){
                        return(
                            <EventMeetingEachDayNonContinuous 
                                key={eachBookingDate.dateNumber}
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