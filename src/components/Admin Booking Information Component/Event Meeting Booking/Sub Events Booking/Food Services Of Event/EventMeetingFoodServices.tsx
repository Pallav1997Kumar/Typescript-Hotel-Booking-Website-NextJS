import { getCommaAndSeperatedArray } from "@/functions/array";
import { eventMeetingTimingConstants } from "@/constant string files/eventsMeetingRoomImportantConstants";

import { 
    IContinousMultipleDatesBookingInfoForAdmin, 
    ISingleDateBookingInfoForAdmin 
} from '@/interface/Event Meeting Interface/viewEventMeetingBookingApiResponse';

import { MeetingEventBookingTime } from "@/interface/Event Meeting Interface/eventMeetingRoomConstantInterface";


interface IPropsEventMeetingFoodServices {
    eachEventMeetingBookingInfo: 
        | IContinousMultipleDatesBookingInfoForAdmin 
        | ISingleDateBookingInfoForAdmin;
}


function EventMeetingFoodServices(props: IPropsEventMeetingFoodServices){
    const eachEventMeetingBookingInfo: 
        | IContinousMultipleDatesBookingInfoForAdmin 
        | ISingleDateBookingInfoForAdmin = 
            props.eachEventMeetingBookingInfo;

    const meetingEventBookingTime: MeetingEventBookingTime[]= eachEventMeetingBookingInfo.meetingEventBookingTime;
    
    const isMorningSlotBooked: boolean = meetingEventBookingTime.includes(eventMeetingTimingConstants.MORNING_TIME);
    const isAfternoonSlotBooked: boolean = meetingEventBookingTime.includes(eventMeetingTimingConstants.AFTERNOON_TIME);
    const isEveningSlotBooked: boolean = meetingEventBookingTime.includes(eventMeetingTimingConstants.EVENING_TIME);
    const isNightSlotBooked: boolean = meetingEventBookingTime.includes(eventMeetingTimingConstants.NIGHT_TIME);
    const isMidNightSlotBooked: boolean = meetingEventBookingTime.includes(eventMeetingTimingConstants.MID_NIGHT_TIME);

    const mealsObj = eachEventMeetingBookingInfo.selectedMealsOnBookingDate;
    const mealsMap = new Map(Object.entries(mealsObj));

    const morningFoodItems: string[] = mealsMap.get("morning") ?? [];
    const afternoonFoodItems: string[] = mealsMap.get("afternoon") ?? [];
    const eveningFoodItems: string[] = mealsMap.get("evening") ?? [];
    const nightFoodItems: string[] = mealsMap.get("night") ?? [];
    const midNightFoodItems: string[] = mealsMap.get("midNight") ?? [];

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
                <div className="mb-3">
                    <span className="font-bold">Morning Food Items: </span>
                    {(morningFoodItems.length == 0) && <span>N/A</span>}
                    {(morningFoodItems.length > 0) && getFoodList(morningFoodItems)}
                </div>
            }
            {isAfternoonSlotBooked &&
                <div className="mb-3">
                    <span className="font-bold">Afternoon Food Items: </span>
                    {(afternoonFoodItems.length == 0) && <span>N/A</span>}
                    {(afternoonFoodItems.length > 0) && getFoodList(afternoonFoodItems)}
                </div>
            }
            {isEveningSlotBooked &&
                <div className="mb-3">
                    <span className="font-bold">Evening Food Items: </span>
                    {(eveningFoodItems.length == 0) && <span>N/A</span>}
                    {(eveningFoodItems.length > 0) && getFoodList(eveningFoodItems)}
                </div>
            }
            {isNightSlotBooked &&
                <div className="mb-3">
                    <span className="font-bold">Night Food Items: </span>
                    {(nightFoodItems.length == 0) && <span>N/A</span>}
                    {(nightFoodItems.length > 0) && getFoodList(nightFoodItems)}
                </div>
            }
            {isMidNightSlotBooked &&
                <div className="mb-3">
                    <span className="font-bold">Mid Night Food Items: </span>
                    {(midNightFoodItems.length == 0) && <span>N/A</span>}
                    {(midNightFoodItems.length > 0) && getFoodList(midNightFoodItems)}
                </div>
            } 
        </div>
    );
}

export default EventMeetingFoodServices;