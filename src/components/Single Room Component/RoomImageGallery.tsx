"use client"
import React from 'react';
import Image from 'next/image';

import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary';

import { Room } from '@/interface/Rooms and Suites Interface/roomsSuitesInfoInterface';


interface IPropsRoomImageGallery{
    roomInfo: Room;
}


function RoomImageGallery(props: IPropsRoomImageGallery) {
    return (
        <ErrorBoundary>
            <RoomImageGalleryFunctionalComponent roomInfo={props.roomInfo} />
        </ErrorBoundary>
    );
}


function RoomImageGalleryFunctionalComponent(props: IPropsRoomImageGallery) {
    const roomInfo: Room = props.roomInfo;
    const noOfPhotos: number = roomInfo.photos.length;

    return (
        <div>
            <h3 className="text-[1.35rem] italic font-[Gill_Sans,Calibri,Trebuchet_MS,sans-serif]">
                Gallery
            </h3>

            {/* 3 Images Layout */}
            {noOfPhotos == 3 && 
            <div className="flex my-[2%]">
                {(roomInfo.photos).map(function(element: string){
                    return (
                        <div key={element} className="w-1/3">
                            <Image src={element} alt="room-image" width={330} height={200} />
                        </div>
                    )
                })}
            </div>
            }

            {/* 4 Images Layout - Two Rows */}
            {noOfPhotos == 4 && 
            <div>
                <div className="flex my-[2%]">
                    {(roomInfo.photos.slice(0,2)).map(function(element: string){
                        return (
                            <div key={element} className="w-1/2">
                                <Image src={element} alt="room-image" width={500} height={200} />
                            </div>
                        )
                    })}
                </div>
                <div className="flex my-[2%]">
                    {(roomInfo.photos.slice(2,4)).map(function(element: string){
                        return (
                            <div key={element} className="w-1/2">
                                <Image src={element} alt="room-image" width={500} height={200} />
                            </div>
                        )
                    })}
                </div>
            </div>
            }

            {/* 5 Images Layout - 3 Top, 2 Bottom */}
            {noOfPhotos == 5 && 
            <div>
                <div className="flex my-[2%]">
                    {(roomInfo.photos.slice(0,3)).map(function(element: string){
                        return (
                            <div key={element} className="w-1/3">
                                <Image src={element} alt="room-image" width={330} height={200} />
                            </div>
                        )
                    })}
                </div>
                <div className="flex my-[2%]">
                    {(roomInfo.photos.slice(3,5)).map(function(element: string){
                        return (
                            <div key={element} className="w-1/2">
                                <Image src={element} alt="room-image" width={500} height={200} />
                            </div>
                        )
                    })}
                </div>
            </div>
            }
            
        </div>
    );
}


export default RoomImageGallery;