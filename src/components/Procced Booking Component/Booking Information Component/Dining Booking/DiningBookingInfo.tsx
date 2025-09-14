import EachDiningBookingInfo from "./EachDiningBookingInfo";

import { IViewDiningCartByCartIdSuccessApiResponse } from '@/interface/Dining Interface/diningCartApiResponse';


interface IPropsDiningBookingInfo{
    allDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[];
}

function DiningBookingInfo(props: IPropsDiningBookingInfo){

    const allDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse[] = props.allDiningBookingInfo;


    return (
        <div className="border border-black m-1">
            {(allDiningBookingInfo.length > 0) && allDiningBookingInfo.map(function(eachDiningBookingInfo: IViewDiningCartByCartIdSuccessApiResponse){
                return (
                    <EachDiningBookingInfo
                        key={eachDiningBookingInfo.cartInfo._id} 
                        eachDiningBookingInfo={eachDiningBookingInfo.cartInfo} 
                    />
                )
            })}
        </div>
    );

}

export default DiningBookingInfo;