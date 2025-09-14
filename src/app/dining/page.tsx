import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import DiningComponent from "@/components/Dining Component/DiningComponent";

import { Dining, DiningInfoResponse } from '@/interface/Dining Interface/hotelDiningInterface';


export function generateMetadata(){
    return {
        title: 'Dining'
    }
}


export default async function page(){

    const diningInfo: DiningInfoResponse = await fetchDiningInformation();
    const dining: Dining[] = diningInfo.dining;


    return (
        <React.Fragment>
            <div className="my-1">
                <Image src={'/Dining/The Chambers.jpeg'} alt="room image" width={1400} height={500} />
            </div>

            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            HOME 
                        </span>
                    </Link> 
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/dining"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            DINING 
                        </span>
                    </Link>
                </p>
            </div>

            <div className="my-4 mx-6 text-center">
                <h2 className="text-3xl font-semibold">
                    DINING
                </h2>
                <p className="text-xl my-2 leading-relaxed text-gray-600 font-sans">
                    For your safety and comfort we have put in place strict measures adhering to both governmental requirements and sanitary guidelines.
                </p>
                <p className="text-xl my-2 leading-relaxed text-gray-600 font-sans">
                    Our dining area have been thoughtfully designed for business and leisure travellers to Kolkata; with classic furnishings, heritage style design features and modern technologies.
                </p>
                <p className="text-xl my-2 leading-relaxed text-gray-600 font-sans">
                    Dining at Taj Bengal is a sheer delight to the palate with a variety of cuisines on offer in stunning settings.
                </p>
                <p className="text-xl my-2 leading-relaxed text-gray-600 font-sans">
                    Connoisseurs from Kolkata and the world over savour the offerings of our award-winning fine-dining speciality restaurants in Kolkata.
                </p>
            </div>
            
            <div>
                {dining.map(function(eachDining: Dining){
                    return (
                        <DiningComponent 
                            key={eachDining.diningAreaTitle} 
                            currentDining={eachDining} 
                        />
                    );
                })}
            </div>           
            
        </React.Fragment>
    );
}


async function fetchDiningInformation(): Promise<DiningInfoResponse>{
    try {
        const response: Response = await fetch(
            `${process.env.URL}/api/hotel-booking-information/dining-information/`
        );
        const diningInfo: DiningInfoResponse = await response.json();
        return diningInfo;
    } catch (error) {
        console.log(error);
        return {
            dining: []
        };
    }
}
