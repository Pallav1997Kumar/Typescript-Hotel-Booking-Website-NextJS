import EachEventMeetingBookingInfo from "./EachEventMeetingBookingInfo";

import { IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse, IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse } from "@/interface/Event Meeting Interface/eventMeetingCartApiResponse";


interface IPropsEventMeetingBookingInfo {
    allEventMeetingBookingInfo: (IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | 
        IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | 
        IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse
    )[];
}


function EventMeetingBookingInfo(props: IPropsEventMeetingBookingInfo){

    const allEventMeetingBookingInfo: (IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse)[] = props.allEventMeetingBookingInfo;

    return (
        <div className="border border-black m-1">
            {(allEventMeetingBookingInfo.length > 0) && allEventMeetingBookingInfo.map(function(eachEventMeetingBookingInfo: IViewSingleDateEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse | IViewMultipleNonContinousDatesEventMeetingRoomCartByCartIdSuccessApiResponse){
                return (
                    <EachEventMeetingBookingInfo 
                        key={eachEventMeetingBookingInfo.cartInfo._id}
                        eachEventMeetingBookingInfo={eachEventMeetingBookingInfo.cartInfo} 
                    />
                )
            })}
        </div>
    );
}

export default EventMeetingBookingInfo;