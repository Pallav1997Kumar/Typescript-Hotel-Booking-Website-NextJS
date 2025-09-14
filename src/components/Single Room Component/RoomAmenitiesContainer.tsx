"use client"
import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary';

import { Room } from '@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface';


interface IPropsRoomAmenitiesContainer{
    roomInfo: Room;
}


function RoomAmenitiesContainer(props: IPropsRoomAmenitiesContainer) {
    return (
        <ErrorBoundary>
            <RoomAmenitiesContainerFunctionalComponent roomInfo={props.roomInfo} />
        </ErrorBoundary>
    );
}


function RoomAmenitiesContainerFunctionalComponent(props: IPropsRoomAmenitiesContainer) {
    const roomInfo: Room = props.roomInfo;
    
    return (
        <div>
            <h3 className="text-[1.35rem] italic font-[Gill_Sans,Calibri,Trebuchet_MS,sans-serif]">
                Amenities
            </h3>

            <div className="flex flex-row w-full">

                {/* Room Amenities */}
                <div className="w-1/3 pr-[4%] py-[2%]">
                    <h5 className="text-[1.06rem] mb-[2%]">Room</h5>
                    <ul>
                        {(roomInfo.amenities.room).map(function(element: string){
                            return (
                                <li key={element} className="py-[3%]">{element}</li>
                            );
                        })}
                    </ul>
                </div>

                {/* Technology Amenities */}
                <div className="w-1/3 pr-[4%] py-[2%]">
                    <h5 className="text-[1.06rem] mb-[2%]">Technology</h5>
                    <ul>
                        {(roomInfo.amenities.technology).map(function(element: string){
                            return (
                                <li key={element} className="py-[3%]">{element}</li>
                            );
                        })}
                    </ul>
                </div>

                {/* Bathroom Amenities */}
                <div className="w-1/3 pr-[4%] py-[2%]">
                    <h5 className="text-[1.06rem] mb-[2%]">Bathroom</h5>
                    <ul>
                        {(roomInfo.amenities.bathroom).map(function(element: string){
                            return (
                                <li key={element} className="py-[3%]">{element}</li>
                            );
                        })}
                    </ul>
                </div>
            </div>

        </div>
    );
}


export default RoomAmenitiesContainer;