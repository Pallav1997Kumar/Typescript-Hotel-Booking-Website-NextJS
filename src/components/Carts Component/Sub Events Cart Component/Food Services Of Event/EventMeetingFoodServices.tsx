import { getCommaAndSeperatedArray } from "@/functions/array";
import { eventMeetingTimingConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";

import { MultipleContinuousDatesBookingDetailsWithPriceInterface, SingleDateEventBookingDetailsWithPriceInterface } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';

interface IPropsEventMeetingFoodServices{
    eachEventMeetingInCart: SingleDateEventBookingDetailsWithPriceInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface;
}


function EventMeetingFoodServices(props: IPropsEventMeetingFoodServices){
    const eachEventMeetingInCart: SingleDateEventBookingDetailsWithPriceInterface | MultipleContinuousDatesBookingDetailsWithPriceInterface = props.eachEventMeetingInCart;

    const meetingEventBookingTime: string[] = eachEventMeetingInCart.meetingEventBookingTime;
    const isMorningSlotBooked: boolean = meetingEventBookingTime.includes(eventMeetingTimingConstants.MORNING_TIME);
    const isAfternoonSlotBooked: boolean = meetingEventBookingTime.includes(eventMeetingTimingConstants.AFTERNOON_TIME);
    const isEveningSlotBooked: boolean = meetingEventBookingTime.includes(eventMeetingTimingConstants.EVENING_TIME);
    const isNightSlotBooked: boolean = meetingEventBookingTime.includes(eventMeetingTimingConstants.NIGHT_TIME);
    const isMidNightSlotBooked: boolean = meetingEventBookingTime.includes(eventMeetingTimingConstants.MID_NIGHT_TIME);

    let morningFoodItems: string[] = [];
    let afternoonFoodItems: string[] = [];
    let eveningFoodItems: string[] = [];
    let nightFoodItems: string[] = [];
    let midNightFoodItems: string[] = [];

    if(eachEventMeetingInCart.selectedMealsOnBookingDate){
        morningFoodItems = eachEventMeetingInCart.selectedMealsOnBookingDate.morning;
        afternoonFoodItems = eachEventMeetingInCart.selectedMealsOnBookingDate.afternoon;
        eveningFoodItems = eachEventMeetingInCart.selectedMealsOnBookingDate.evening;
        nightFoodItems = eachEventMeetingInCart.selectedMealsOnBookingDate.night;
        midNightFoodItems = eachEventMeetingInCart.selectedMealsOnBookingDate.midNight;
    }

    function getFoodList(foodArrayList: string[]){
        const foodArray = foodArrayList.map(function(eachItem: string){
            return eachItem.split(" (")[0];
        })
        if(foodArray.length == 1){
            return foodArray[0];
        }
        else if(foodArray.length > 1){
            return getCommaAndSeperatedArray(foodArray);
        }
    }

    return (
        <div>
            {isMorningSlotBooked &&
                <div className="m-3">
                    <span className="font-bold">Morning Food Items: </span>
                    {(morningFoodItems.length == 0) && <span>N/A</span>}
                    {(morningFoodItems.length > 0) && getFoodList(morningFoodItems)}
                </div>
            }
            {isAfternoonSlotBooked &&
                <div className="m-3">
                    <span className="font-bold">Afternoon Food Items: </span>
                    {(afternoonFoodItems.length == 0) && <span>N/A</span>}
                    {(afternoonFoodItems.length > 0) && getFoodList(afternoonFoodItems)}
                </div>
            }
            {isEveningSlotBooked &&
                <div className="m-3">
                    <span className="font-bold">Evening Food Items: </span>
                    {(eveningFoodItems.length == 0) && <span>N/A</span>}
                    {(eveningFoodItems.length > 0) && getFoodList(eveningFoodItems)}
                </div>
            }
            {isNightSlotBooked &&
                <div className="m-3">
                    <span className="font-bold">Night Food Items: </span>
                    {(nightFoodItems.length == 0) && <span>N/A</span>}
                    {(nightFoodItems.length > 0) && getFoodList(nightFoodItems)}
                </div>
            }
            {isMidNightSlotBooked &&
                <div className="m-3">
                    <span className="font-bold">Mid Night Food Items: </span>
                    {(midNightFoodItems.length == 0) && <span>N/A</span>}
                    {(midNightFoodItems.length > 0) && getFoodList(midNightFoodItems)}
                </div>
            } 
        </div>
    );
}

export default EventMeetingFoodServices;