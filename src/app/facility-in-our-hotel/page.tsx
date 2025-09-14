import React from "react";
import Image from 'next/image';
import Link from 'next/link';


export function generateMetadata(){
    return {
        title: 'Royal Palace - Facilities'
    }
}


export default function page() {
    return (
        <React.Fragment>
            <div className="my-1">
                <Image 
                    src={'/Fitness/Fitness-24-hr-gym.jpg'} 
                    alt="gym image" 
                    width={1400} 
                    height={500} 
                    className="w-full h-auto object-cover"  
                />
            </div>

            {/* Breadcrumb Navigation */}
            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            HOME 
                        </span>
                    </Link> 
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/facility-in-our-hotel"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            HOTEL FACILITIES 
                        </span>
                    </Link>
                </p>
            </div>
            
            <div className="my-12 mx-24">
                <h2 className="text-center text-xl font-semibold tracking-widest mb-6">
                    Facilities in our hotel
                </h2>
                <p className="italic text-base leading-loose tracking-wide mb-4">
                    Whether you are travelling for business or pleasure, the luxury hotel services offered by the five star Taj Hotel make it an ideal choice for your stay in Kolkata, West Bengal. 
                </p>
                <p className="italic text-base leading-loose tracking-wide mb-4">
                    The hotel’s luxurious surroundings, comfort, thoughtful touches and a personalized service sets it apart from any other hotel, allowing you to feel like being at home from your very first steps into the hotel.
                </p>
                <p className="italic text-base leading-loose tracking-wide mb-4">
                    We are geared towards the fulfilment of the needs of any discerning guest and below you can find the most commonly-used services and facilities offered by our boutique hotel.
                </p>
                <ol className="list-decimal ml-6 space-y-2">
                    <li>
                        <Link href={`/facility-in-our-hotel/spa-and-beauty-salon`} className="hover:text-[#B8860B] hover:cursor-pointer">
                            Spa and Salon
                        </Link>
                    </li>
                    <li>
                        <Link href={`/facility-in-our-hotel/fitness-gym`} className="hover:text-[#B8860B] hover:cursor-pointer">
                            Fitness Centre
                        </Link>
                    </li>
                    <li>
                        <Link href={`/facility-in-our-hotel/swimming-pool`} className="hover:text-[#B8860B] hover:cursor-pointer">
                            Swimming Pool
                        </Link>
                    </li>
                    <li>
                        <Link href={`/facility-in-our-hotel/indoor-games`} className="hover:text-[#B8860B] hover:cursor-pointer">
                            Indoor Games Centre
                        </Link>
                    </li>
                    <li>
                        <Link href={`/facility-in-our-hotel/`} className="hover:text-[#B8860B] hover:cursor-pointer">
                            Laundry
                        </Link>
                    </li>
                </ol>
            </div>
        </React.Fragment>
    );
}