'use client'
import React, { useState } from "react";

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

import EachDiningBookingInfo from "@/components/User Past Current Booking Info Component/Dining Booking/EachDiningBookingInfo";

import { IDiningBookingInfoForArrayForCustomer, IDiningBookingInfoForCustomer } from "@/interface/Dining Interface/viewDiningBookingApiResponse";
import { ITransactionDetailsFrontend } from "@/interface/hotelCustomersInterface";


interface IPropsUserDiningBookingComponent {
    diningBookingInfo: IDiningBookingInfoForArrayForCustomer[];    
}


function UserDiningBookingComponent(props: IPropsUserDiningBookingComponent){

    const diningBookingInfo: IDiningBookingInfoForArrayForCustomer[] = props.diningBookingInfo;

    const [sortSelection, setSortSelection] = useState<string>("");

    if(sortSelection !== ""){

        if(sortSelection === DATE_BOOKED_ASCENDING){
            diningBookingInfo.sort(function(a,b){
                const dateA: number = new Date(a.bookingInfo.transactionDetails.transactionDateTime).getTime();
                const dateB: number = new Date(b.bookingInfo.transactionDetails.transactionDateTime).getTime();
                return  dateA - dateB;
            });
        }
        else if(sortSelection === DATE_BOOKED_DESCENDING){
            diningBookingInfo.sort(function(a,b){
                const dateA: number = new Date(a.bookingInfo.transactionDetails.transactionDateTime).getTime();
                const dateB: number = new Date(b.bookingInfo.transactionDetails.transactionDateTime).getTime();
                return  dateB - dateA;
            });
        }

        else if(sortSelection === DATE_OF_BOOKING_ASCENDING){
            diningBookingInfo.sort(function(a,b){
                const dateA: number = new Date(a.bookingInfo.tableBookingDate).getTime();
                const dateB: number = new Date(b.bookingInfo.tableBookingDate).getTime();
                return  dateA - dateB;
            });
        }
        else if(sortSelection === DATE_OF_BOOKING_DESCENDING){
            diningBookingInfo.sort(function(a,b){
                const dateA: number = new Date(a.bookingInfo.tableBookingDate).getTime();
                const dateB: number = new Date(b.bookingInfo.tableBookingDate).getTime();
                return  dateB - dateA;
            });
        }

        else if(sortSelection === TITLE_ASCENDING){
            diningBookingInfo.sort(function(a,b){
                const titleA: string = a.bookingInfo.diningRestaurantTitle;
                const titleB: string = b.bookingInfo.diningRestaurantTitle;
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
            diningBookingInfo.sort(function(a,b){
                const titleA: string = a.bookingInfo.diningRestaurantTitle;;
                const titleB: string = b.bookingInfo.diningRestaurantTitle;
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
            diningBookingInfo.sort(function(a,b){
                const totalPriceA: number = a.bookingInfo.priceForBooking;
                const totalPriceB: number = b.bookingInfo.priceForBooking;
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
            diningBookingInfo.sort(function(a,b){
                const totalPriceA: number = a.bookingInfo.priceForBooking;
                const totalPriceB: number = b.bookingInfo.priceForBooking;
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
            diningBookingInfo.sort(function(a,b){
                const noOfGuestA: number = a.bookingInfo.noOfGuests;
                const noOfGuestB: number = b.bookingInfo.noOfGuests;
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
            diningBookingInfo.sort(function(a,b){
                const noOfGuestA: number = a.bookingInfo.noOfGuests;
                const noOfGuestB: number = b.bookingInfo.noOfGuests;
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

            {diningBookingInfo.map(function(eachDiningBookingInfo: IDiningBookingInfoForArrayForCustomer){
                const diningBookingInfo: IDiningBookingInfoForCustomer =  eachDiningBookingInfo.bookingInfo; 
                const transactionDetails: ITransactionDetailsFrontend = diningBookingInfo.transactionDetails;
                return (
                    <EachDiningBookingInfo 
                        key={eachDiningBookingInfo._id}
                        eachDiningBookingInfo={diningBookingInfo} 
                        transactionDetails={transactionDetails} 
                    />
                );
            })}
        </div>
    );

}

export default UserDiningBookingComponent;