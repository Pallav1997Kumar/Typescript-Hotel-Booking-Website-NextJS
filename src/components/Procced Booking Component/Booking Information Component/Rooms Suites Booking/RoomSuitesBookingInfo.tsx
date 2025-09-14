import EachRoomBookingInfo from "./EachRoomBookingInfo";

import { IViewRoomsSuitesCartByCartIdSuccessApiResponse } from '@/interface/Rooms and Suites Interface/roomsSuitesCartApiResponse';


interface IPropsRoomSuitesBookingInfo{
    allRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[];
}

function RoomSuitesBookingInfo(props: IPropsRoomSuitesBookingInfo){

    const allRoomSuiteBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse[]= props.allRoomSuiteBookingInfo;

    return (
        <div>
            {(allRoomSuiteBookingInfo.length > 0) && allRoomSuiteBookingInfo.map(function(eachRoomBookingInfo: IViewRoomsSuitesCartByCartIdSuccessApiResponse){
                return(
                    <EachRoomBookingInfo
                        key={eachRoomBookingInfo.cartInfo._id}
                        eachRoomBookingInfo={eachRoomBookingInfo.cartInfo} 
                    />
                )
            })}
        </div>
    );

}

export default RoomSuitesBookingInfo;