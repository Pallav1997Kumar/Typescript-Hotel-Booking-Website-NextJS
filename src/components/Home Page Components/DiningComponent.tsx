import React from "react";
import Image from 'next/image';
import Link from 'next/link';

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import { Dining, DiningInfoResponse } from "@/interface/Dining Interface/hotelDiningInterface";


function DiningComponent() {
    return (
        <ErrorBoundary>
            <DiningComponentFunctionalComponent />
        </ErrorBoundary>
    );
}


async function DiningComponentFunctionalComponent(){
    
    const dining: Dining[] = await fetchDiningInformation();
    const threeDining: Dining[] = dining.slice(0,3)

    return (
        <div className="p-8 bg-blue-200 bg-opacity-50">
            <h2 className="text-center text-2xl font-serif mb-6">Dining</h2>
            <div className="bg-gray-300 border-3 border-gray-600 p-4">
                <Link href={`/dining/`} passHref>
                    <p className="text-right text-red-600 underline mb-3 text-lg font-semibold transition-all duration-1000 hover:text-darkred hover:text-xl">
                        SEE ALL THE DINING OPTIONS
                    </p>
                </Link>
                <div className="flex flex-wrap w-full">
                    {threeDining.map(function(eachDining: Dining){
                        return(
                            <div key={eachDining.diningPath} className="w-full sm:w-1/3 px-2 py-2">
                                <Image src={eachDining.photo} alt="room-photo" width={375} height={300}  className="object-cover" />
                                <Link href={`/dining/${eachDining.diningPath}`} passHref>
                                    <h4 className="text-center text-xl font-italic mt-3 cursor-pointer hover:underline">
                                        {eachDining.diningAreaTitle}
                                    </h4>
                                </Link>
                                <p className="text-center mt-2">{eachDining.shortDescription}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}


async function fetchDiningInformation(): Promise<Dining[]>{
    try {
        const response: Response = await fetch(`${process.env.URL}/api/hotel-booking-information/dining-information/`);
        const diningInfo: DiningInfoResponse = await response.json();
        const dining: Dining[] = diningInfo.dining;
        return dining;
    } catch (error) {
        console.log(error);
        return [];
    }
}


export default DiningComponent;