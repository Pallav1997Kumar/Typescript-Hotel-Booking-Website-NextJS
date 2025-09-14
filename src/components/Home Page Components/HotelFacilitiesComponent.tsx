import React from "react";
import Image from 'next/image';
import Link from 'next/link';

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";


function HotelFacilitiesComponent(){
    return (
        <ErrorBoundary>
            <HotelFacilitiesComponentFunctionalComponent />
        </ErrorBoundary>
    );
}


function HotelFacilitiesComponentFunctionalComponent(){
    return(
        <div className="p-8 bg-yellow-200 bg-opacity-50">
            <h2 className="text-center text-2xl mb-6 font-serif">Facilities in Our Hotel</h2>

            <div className="bg-gray-300 border-3 border-gray-500 p-4">
                <Link href={`/facility-in-our-hotel/`} passHref>
                    <p className="text-right pr-10 text-red-600 text-lg font-bold underline mb-3 transition-all hover:text-darkred hover:text-xl">
                        SEE ALL THE FACILITIES
                    </p>
                </Link>

                <div className="flex space-x-4">
                    {/* Fitness Centre */}
                    <div className="w-1/3 p-2">
                        <Image src={'/Fitness/Fitness-24-hr-gym.jpg'} alt="fitness-gym" width={375} height={300} className="w-full h-auto" />
                        <Link href={`/facility-in-our-hotel/fitness-gym`}>
                            <h4 className="italic text-center text-xl mt-2 hover:underline cursor-pointer">Fitness Centre</h4>
                        </Link>
                    </div>
                    <div className="w-1/3 p-2">
                        <Image src={'/Spa and Salon/salon.jpg'} alt="salon" width={375} height={300} className="w-full h-auto" />
                        <Link href={`/facility-in-our-hotel/spa-and-beauty-salon`}>
                            <h4 className="italic text-center text-xl mt-2 hover:underline cursor-pointer">Spa and Salon</h4>
                        </Link>
                    </div>
                    <div className="w-1/3 p-2">
                        <Image src={'/Swimming Pool/swimming pool.jpg'} alt="swimming-pool" width={375} height={300} className="w-full h-auto" />
                        <Link href={`/facility-in-our-hotel/swimming-pool`}>
                            <h4 className="italic text-center text-xl mt-2 hover:underline cursor-pointer">Swimming Pool</h4>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelFacilitiesComponent;