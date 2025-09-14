import Image from 'next/image'
import React from "react";

import BasicContactInformation from "@/components/Home Page Components/BasicContactInformation";
import HomePageHotelIntroduction from "@/components/Home Page Components/HomePageHotelIntroduction";
import RoomsAndSuitesComponent from "@/components/Home Page Components/RoomsAndSuitesComponent";
import DiningComponent from "@/components/Home Page Components/DiningComponent";
import EventsMeetingComponent from "@/components/Home Page Components/EventsMeetingComponent";
import HotelFacilitiesComponent from "@/components/Home Page Components/HotelFacilitiesComponent";


export function generateMetadata(){
    return {
        title: 'Royal Palace'
    }
}


export default function Home() {
    return (
        <React.Fragment>
            <div>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />
            </div>
            <h1 className="text-center text-4xl text-gray-800 my-8">
                Royal Palace
            </h1>
            <h4 className="text-gray-500 text-xl ml-2 mb-6">
                5 Star Hotel in Kolkata near Victoria Memorial
            </h4>
            <BasicContactInformation />
            <HomePageHotelIntroduction />
            <RoomsAndSuitesComponent />
            <DiningComponent />
            <EventsMeetingComponent />
            <HotelFacilitiesComponent />
        </React.Fragment>
    );
}
