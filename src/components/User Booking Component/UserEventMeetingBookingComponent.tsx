'use client'
import React, { useState } from "react";

import { roomBookingDateTypeConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";
import { 
    DATE_BOOKED_ASCENDING, 
    DATE_BOOKED_DESCENDING,
    TITLE_ASCENDING,
    TITLE_DESCENDING,
    DATE_OF_BOOKING_ASCENDING,
    DATE_OF_BOOKING_DESCENDING,
    TOTAL_PRICE_ASCENDING,
    TOTAL_PRICE_DESCENDING,
    NUMBER_OF_GUESTS_ASCENDING,
    NUMBER_OF_GUESTS_DESCENDING 
} from "@/constant string files/bookingViewSortingConstants";

import EachEventMeetingBookingInfo from "@/components/User Past Current Booking Info Component/Event Meeting Booking/EachEventMeetingBookingInfo";

import { EventMeetingBookingInfoForCustomer, IContinousMultipleDatesBookingInfoForCustomer, IDateBooking, INonContinousMultipleDatesBookingInfoForCustomer, ISingleDateBookingInfoForCustomer } from "@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse";
import { ITransactionDetailsFrontend } from "@/interface/hotelCustomersInterface";


interface IPropsUserEventMeetingBookingComponent {
    eventMeetingBookingInfo: EventMeetingBookingInfoForCustomer[];
}


function UserEventMeetingBookingComponent(props: IPropsUserEventMeetingBookingComponent){

    const eventMeetingBookingInfo: EventMeetingBookingInfoForCustomer[] = props.eventMeetingBookingInfo;
    
    const [sortSelection, setSortSelection] = useState("");

    if(sortSelection !== ""){

        if(sortSelection === DATE_BOOKED_ASCENDING){
            eventMeetingBookingInfo.sort(function(a,b){
                const dateA = new Date(a.bookingInfo.transactionDetails.transactionDateTime).getTime();
                const dateB = new Date(b.bookingInfo.transactionDetails.transactionDateTime).getTime();
                return  dateA - dateB;
            });
        }
        else if(sortSelection === DATE_BOOKED_DESCENDING){
            eventMeetingBookingInfo.sort(function(a,b){
                const dateA = new Date(a.bookingInfo.transactionDetails.transactionDateTime).getTime();
                const dateB = new Date(b.bookingInfo.transactionDetails.transactionDateTime).getTime();
                return  dateB - dateA;
            });
        }

        else if(sortSelection === DATE_OF_BOOKING_ASCENDING){
            eventMeetingBookingInfo.sort(function(a,b){
                const dateA: number = getBookingDateForSorting(a).getTime();
                const dateB: number = getBookingDateForSorting(b).getTime();
                return  dateA - dateB;
            });
        }
        else if(sortSelection === DATE_OF_BOOKING_DESCENDING){
            eventMeetingBookingInfo.sort(function(a,b){
                const dateA: number = getBookingDateForSorting(a).getTime();
                const dateB: number = getBookingDateForSorting(b).getTime();
                return  dateB - dateA;
            });
        }

        else if(sortSelection === TITLE_ASCENDING){
            eventMeetingBookingInfo.sort(function(a,b){
                const titleA: string = a.bookingInfo.meetingEventsInfoTitle;
                const titleB: string = b.bookingInfo.meetingEventsInfoTitle;
                if(titleA > titleB){
                    return 1;
                }
                if(titleA < titleB){
                    return -1;
                }
                return  0;
            });
        }
        else if(sortSelection === TITLE_DESCENDING){
            eventMeetingBookingInfo.sort(function(a,b){
                const titleA: string = a.bookingInfo.meetingEventsInfoTitle;;
                const titleB: string = b.bookingInfo.meetingEventsInfoTitle;
                if(titleA > titleB){
                    return -1;
                }
                if(titleA < titleB){
                    return 1;
                }
                return  0;
            });
        }

        else if(sortSelection === TOTAL_PRICE_ASCENDING){
            eventMeetingBookingInfo.sort(function(a,b){
                const totalPriceA: number = getTotalPriceForSorting(a);
                const totalPriceB: number = getTotalPriceForSorting(b);
                if(totalPriceA > totalPriceB){
                    return 1;
                }
                if(totalPriceA < totalPriceB){
                    return -1;
                }
                return  0;
            });
        }
        else if(sortSelection === TOTAL_PRICE_DESCENDING){
            eventMeetingBookingInfo.sort(function(a,b){
                const totalPriceA: number = getTotalPriceForSorting(a);
                const totalPriceB: number = getTotalPriceForSorting(b);
                if(totalPriceA > totalPriceB){
                    return -1;
                }
                if(totalPriceA < totalPriceB){
                    return 1;
                }
                return  0;
            });
        }

        else if(sortSelection === NUMBER_OF_GUESTS_ASCENDING){
            eventMeetingBookingInfo.sort(function(a,b){
                const noOfGuestA: number = getNumberOfGuestsForSorting(a);
                const noOfGuestB: number = getNumberOfGuestsForSorting(b);
                if(noOfGuestA > noOfGuestB){
                    return 1;
                }
                if(noOfGuestA < noOfGuestB){
                    return -1;
                }
                return  0;
            });
        }
        else if(sortSelection === NUMBER_OF_GUESTS_DESCENDING){
            eventMeetingBookingInfo.sort(function(a,b){
                const noOfGuestA: number = getNumberOfGuestsForSorting(a);
                const noOfGuestB: number = getNumberOfGuestsForSorting(b);
                if(noOfGuestA > noOfGuestB){
                    return -1;
                }
                if(noOfGuestA < noOfGuestB){
                    return 1;
                }
                return  0;
            });
        }

    }


    function getBookingDateForSorting(bookingInformation: EventMeetingBookingInfoForCustomer): Date {
        const bookingInfo: ISingleDateBookingInfoForCustomer | IContinousMultipleDatesBookingInfoForCustomer | INonContinousMultipleDatesBookingInfoForCustomer = bookingInformation.bookingInfo;
        if(bookingInfo.meetingEventsInfoTitle &&
            Object.hasOwn(bookingInfo, 'meetingEventsInfoTitle')){
            if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) {
                return new Date(bookingInfo.meetingEventBookingDate);
            }
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) {
                return new Date(bookingInfo.meetingEventEndBookingDate);
            }       
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) {
                const dates: Date[] = bookingInfo.allDatesBookingInformation.map(function(dateInfo: IDateBooking){ 
                    return new Date(dateInfo.meetingEventBookingDate);
                });
                if(dates.length > 0){
                    return new Date(Math.max(...dates.map(function(eachDate){
                        return eachDate.getTime();
                    })));
                }
            }
        }
        return new Date(0);
    }


    function getTotalPriceForSorting(bookingInformation: EventMeetingBookingInfoForCustomer): number {
        const bookingInfo: ISingleDateBookingInfoForCustomer | IContinousMultipleDatesBookingInfoForCustomer | INonContinousMultipleDatesBookingInfoForCustomer = bookingInformation.bookingInfo;
        if(bookingInfo.meetingEventsInfoTitle &&
            Object.hasOwn(bookingInfo, 'meetingEventsInfoTitle')){
            if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) {
                return bookingInfo.totalPriceEventMeetingRoom;
            }
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) {
                return bookingInfo.totalPriceEventMeetingRoom;
            }
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) {
                return bookingInfo.totalPriceOfAllDates;
            }
        }
        return 0;
    }


    function getNumberOfGuestsForSorting(bookingInformation: EventMeetingBookingInfoForCustomer): number {
        const bookingInfo: ISingleDateBookingInfoForCustomer | IContinousMultipleDatesBookingInfoForCustomer | INonContinousMultipleDatesBookingInfoForCustomer = bookingInformation.bookingInfo;
        if(bookingInfo.meetingEventsInfoTitle &&
            Object.hasOwn(bookingInfo, 'meetingEventsInfoTitle')){
            if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.SINGLE_DATE) {
                return bookingInfo.maximumGuestAttending;
            }    
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_CONTINOUS) {
                return bookingInfo.maximumGuestAttending;
            }
            else if (bookingInfo.roomBookingDateType === roomBookingDateTypeConstants.MULTIPLE_DATES_NON_CONTINOUS) {
                const guestCounts: number[] = bookingInfo.allDatesBookingInformation.map(function(dateInfo: IDateBooking){ 
                    return dateInfo.maximumGuestAttending;
                });
                return Math.max(...guestCounts); // Use the highest guest
            }
        }
        return 0;
    }


    return (
        <div>

            <div className="bg-pink-100 my-4 p-4">
                <h4 className="text-purple-700 text-lg mb-2 font-semibold"> Sort By </h4>
                
                <select 
                    onChange={(event) => setSortSelection(event.target.value)}
                    value={sortSelection}
                    className="text-brown-700 px-4 py-2 text-base font-bold bg-blue-50 border-2 border-pink-300 focus:outline-none focus:border-pink-300"
                >
                    <option value="">Please Select</option>
                    <option value={DATE_BOOKED_ASCENDING}>Date On Which Booked Ascending</option>
                    <option value={DATE_BOOKED_DESCENDING}>Date On Which Booked Descending</option>
                    <option value={DATE_OF_BOOKING_ASCENDING}>Date of Booking Ascending</option>
                    <option value={DATE_OF_BOOKING_DESCENDING}>Date of Booking Descending</option>
                    <option value={TITLE_ASCENDING}>Title of Room Suites/ Dining/ Meeting Event Room Ascending</option>
                    <option value={TITLE_DESCENDING}>Title of Room Suites/ Dining/ Meeting Event Room Descending</option>
                    <option value={TOTAL_PRICE_ASCENDING}>Total Price Ascending</option>
                    <option value={TOTAL_PRICE_DESCENDING}>Total Price Descending</option>
                    <option value={NUMBER_OF_GUESTS_ASCENDING}>Number of Guests Ascending</option>
                    <option value={NUMBER_OF_GUESTS_DESCENDING}>Number of Guests Descending</option>
                </select>
            </div>

            {eventMeetingBookingInfo.map(function(eachEventMeetingRoomBookingInfo: EventMeetingBookingInfoForCustomer){
                const eventMeetingBookingInfo: ISingleDateBookingInfoForCustomer | IContinousMultipleDatesBookingInfoForCustomer | INonContinousMultipleDatesBookingInfoForCustomer =  eachEventMeetingRoomBookingInfo.bookingInfo; 
                const transactionDetails: ITransactionDetailsFrontend = eventMeetingBookingInfo.transactionDetails;
                return (
                    <EachEventMeetingBookingInfo 
                        key={eachEventMeetingRoomBookingInfo._id}
                        eachEventMeetingBookingInfo={eventMeetingBookingInfo} 
                        transactionDetails={transactionDetails} 
                    />
                );
            })}
        </div>
    );

}

export default UserEventMeetingBookingComponent;