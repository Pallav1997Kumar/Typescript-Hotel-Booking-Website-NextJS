import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { getDateText } from "@/functions/date";
import { getCommaAndSeperatedArray } from "@/functions/array";
import { wantFoodServiceConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";
import { convertToINR } from '@/functions/currency';

import { MultipleContinuousDatesBookingDetailsInterface, NonContinuousMultipleDatesBookingDetailsWithDateNumberInterface, SingleDateEventBookingDetailsInterface } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';


interface IPropsEventMeetingBookingsDetailsConfirmation {
    bookingDetailsForCart: NonContinuousMultipleDatesBookingDetailsWithDateNumberInterface | SingleDateEventBookingDetailsInterface | MultipleContinuousDatesBookingDetailsInterface | null;
    totalPriceEventMeetingRoom: number;
}

function isMultipleContinuousDatesBookingDetails( details: NonContinuousMultipleDatesBookingDetailsWithDateNumberInterface | SingleDateEventBookingDetailsInterface | MultipleContinuousDatesBookingDetailsInterface | null): details is MultipleContinuousDatesBookingDetailsInterface {
    return (
        details !== null &&
        'meetingEventStartBookingDate' in details &&
        'meetingEventEndBookingDate' in details
    );
}



function EventMeetingBookingsDetailsConfirmation(props: IPropsEventMeetingBookingsDetailsConfirmation) {

    const bookingDetailsForCart: NonContinuousMultipleDatesBookingDetailsWithDateNumberInterface | SingleDateEventBookingDetailsInterface | MultipleContinuousDatesBookingDetailsInterface | null = props.bookingDetailsForCart;
    const totalPriceEventMeetingRoom: number = props.totalPriceEventMeetingRoom;

    function getTimeSlotText(timeSlotArray: string[]){
        if(timeSlotArray.length === 1){
            return timeSlotArray[0];
        }
        else if(timeSlotArray.length > 1){
            return getCommaAndSeperatedArray(timeSlotArray);
        }
    }

    function getFoodList(foodArrayList: string[]){
        const foodArray: string[] = foodArrayList.map(function(eachItem: string){
            return eachItem.split(" (")[0];
        })
        if(foodArray.length == 1){
            return foodArray[0];
        }
        else if(foodArray.length > 1){
            return getCommaAndSeperatedArray(foodArray);
        }
    }

    if(bookingDetailsForCart == null){
        return (
            <div>

            </div>
        );
    }


    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                        {(bookingDetailsForCart.hasOwnProperty('meetingEventBookingDate') && !isMultipleContinuousDatesBookingDetails(bookingDetailsForCart) && bookingDetailsForCart.meetingEventBookingDate) &&
                        <TableRow>
                            <TableCell>Event Room Booking Date</TableCell>
                            <TableCell>
                                {getDateText(typeof bookingDetailsForCart.meetingEventBookingDate === 'string' ? new Date(bookingDetailsForCart.meetingEventBookingDate) : bookingDetailsForCart.meetingEventBookingDate)}
                            </TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.hasOwnProperty('meetingEventStartBookingDate') && isMultipleContinuousDatesBookingDetails(bookingDetailsForCart) && bookingDetailsForCart.meetingEventStartBookingDate) &&
                        <TableRow>
                            <TableCell>Event Room Booking Start Date</TableCell>
                            <TableCell>
                                {getDateText(typeof bookingDetailsForCart.meetingEventStartBookingDate === 'string' ? new Date(bookingDetailsForCart.meetingEventStartBookingDate) : bookingDetailsForCart.meetingEventStartBookingDate)}
                            </TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.hasOwnProperty('meetingEventEndBookingDate') && isMultipleContinuousDatesBookingDetails(bookingDetailsForCart) && bookingDetailsForCart.meetingEventEndBookingDate) &&
                        <TableRow>
                            <TableCell>Event Room Booking End Date</TableCell>
                            <TableCell>
                                {getDateText(typeof bookingDetailsForCart.meetingEventEndBookingDate === 'string' ? new Date(bookingDetailsForCart.meetingEventEndBookingDate) : bookingDetailsForCart.meetingEventEndBookingDate)}
                            </TableCell>
                        </TableRow>
                        }
                        <TableRow>
                            <TableCell>Time Slot of Booking</TableCell>
                            <TableCell>{getTimeSlotText(bookingDetailsForCart.meetingEventBookingTime)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Seating Arrangement</TableCell>
                            <TableCell>{bookingDetailsForCart.meetingEventSeatingArrangement}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Maximum Number Of Guests Booked</TableCell>
                            <TableCell>{bookingDetailsForCart.maximumGuestAttending}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Want Food Services</TableCell>
                            <TableCell>{bookingDetailsForCart.wantFoodServices}</TableCell>
                        </TableRow>
                        {(bookingDetailsForCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && bookingDetailsForCart.selectedMealsOnBookingDate && bookingDetailsForCart.selectedMealsOnBookingDate.morning.length > 0) &&
                        <TableRow>
                            <TableCell>Morning Meals</TableCell>
                            <TableCell>{getFoodList(bookingDetailsForCart.selectedMealsOnBookingDate.morning)}</TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && bookingDetailsForCart.selectedMealsOnBookingDate && bookingDetailsForCart.selectedMealsOnBookingDate.afternoon.length > 0) &&
                        <TableRow>
                            <TableCell>Afternoon Meals</TableCell>
                            <TableCell>{getFoodList(bookingDetailsForCart.selectedMealsOnBookingDate.afternoon)}</TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && bookingDetailsForCart.selectedMealsOnBookingDate && bookingDetailsForCart.selectedMealsOnBookingDate.evening.length > 0) &&
                        <TableRow>
                            <TableCell>Evening Meals</TableCell>
                            <TableCell>{getFoodList(bookingDetailsForCart.selectedMealsOnBookingDate.evening)}</TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && bookingDetailsForCart.selectedMealsOnBookingDate && bookingDetailsForCart.selectedMealsOnBookingDate.night.length > 0) &&
                        <TableRow>
                            <TableCell>Night Meals</TableCell>
                            <TableCell>{getFoodList(bookingDetailsForCart.selectedMealsOnBookingDate.night)}</TableCell>
                        </TableRow>
                        }
                        {(bookingDetailsForCart.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES && bookingDetailsForCart.selectedMealsOnBookingDate && bookingDetailsForCart.selectedMealsOnBookingDate.midNight.length > 0) &&
                        <TableRow>
                            <TableCell>Mid Night Meals</TableCell>
                            <TableCell>{getFoodList(bookingDetailsForCart.selectedMealsOnBookingDate.midNight)}</TableCell>
                        </TableRow>
                        }
                        <TableRow>
                            <TableCell>Total Price Of Room</TableCell>
                            <TableCell>{convertToINR(totalPriceEventMeetingRoom)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default EventMeetingBookingsDetailsConfirmation;