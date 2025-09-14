"use client"
import React from 'react';
import Image from 'next/image';

import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary';

import { Room } from '@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface';


interface IPropsRoomBasicContainer{
    roomInfo: Room;
}


function RoomBasicContainer(props: IPropsRoomBasicContainer){
    return (
        <ErrorBoundary>
            <RoomBasicContainerFunctionalComponent roomInfo={props.roomInfo} />
        </ErrorBoundary>
    );
}


function RoomBasicContainerFunctionalComponent(props: IPropsRoomBasicContainer) {
    const roomInfo: Room = props.roomInfo;

    return(
        <div className="w-full flex flex-row my-[4%]">
            
            {/* Room Image */}
            <div className="w-[55%]">
                <Image src={roomInfo.photos[0]} alt="room-cover-image" width={600} height={350} />
            </div>

            {/* Description & Table */}
            <div className="w-[45%] px-4">
                <p className="font-[Times_New_Roman] leading-[150%] my-[2.5%_0_4%_0] word-spacing-[4px] tracking-[1.5px] text-[1.1rem]">
                    {roomInfo.description}
                </p>

                <div className="my-[5%]">
                    <div className="flex flex-row py-[1%] w-full">
                        <div className="w-[40%] font-semibold"><strong>Bed Type: </strong></div>
                        <div className="w-[60%]">{roomInfo.bedType}</div>
                    </div>
                    <div className="flex flex-row py-[1%] w-full">
                        <div className="w-[40%] font-semibold"><strong>Total Room Size: </strong></div>
                        <div className="w-[60%]">{roomInfo.totalRoomSize}</div>
                    </div>
                </div>

            </div>
        </div>
    );
}


export default RoomBasicContainer;