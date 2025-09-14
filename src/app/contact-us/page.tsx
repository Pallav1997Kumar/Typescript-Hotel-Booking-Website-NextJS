import Image from 'next/image';
import React from "react";
import Link from 'next/link';

import ContactUsForm from "@/components/Contact Us Form/ContactUsForm";

import hotelBasicInfo from "@/json objects/hotelBasicInfo";


export function generateMetadata(){
    return {
        title: 'Royal Palace - Contact Us'
    }
}


export default function Page() {

    return (
        <React.Fragment>
            
            <div>
                <Image 
                    src={'/hotel photo.jpg'} 
                    alt="hotel" 
                    width={1500} 
                    height={500} 
                />
            </div>
            
            {/* Breadcrumb Navigation */}
            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> HOME </span>
                    </Link> 
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/contact-us"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline">CONTACT US </span>
                    </Link>
                </p>
            </div>
            
            <div className="m-6 text-center">
                <div>
                    <h1 className="text-3xl font-bold">
                        CONTACT US - ROYAL PALACE, KOLKATA
                    </h1>
                    <Image 
                        src={'/hotel-logo.jpg'} 
                        alt="icon" 
                        width={200} 
                        height={100} 
                        className="my-4 mx-auto block" 
                    />
                </div>

                <div className="flex justify-center space-x-8 my-6 mx-8">
                    {/* Address */}
                    <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center border-[2.5px] border-[#f97316] p-6">
                        <h2 className="text-3xl font-bold">Address</h2>
                        <p className="text-center text-base">{hotelBasicInfo.address}</p>
                    </div>

                    {/* Phone */}
                    <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center border-[2.5px] border-[#f97316] p-6">
                        <h2 className="text-3xl font-bold">Phone</h2>
                        <p className="text-center text-base">{hotelBasicInfo.contactNo}</p>
                    </div>

                    {/* Email */}
                    <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center border-[2.5px] border-[#f97316] p-6">
                        <h2 className="text-3xl font-bold">Email</h2>
                        <p className="text-center text-base">{hotelBasicInfo.emailId}</p>
                    </div>
                    
                </div>
            </div>

            <div className="flex space-x-6 my-6 mx-6">
                <div className="flex-1">
                    <ContactUsForm />
                </div>
                <div className="flex-1">
                    <Image 
                        src={'/royal-fort-hotel.jpg'} 
                        alt="img" 
                        width={550} 
                        height={350} 
                        className="my-4 mx-auto block" 
                    />
                </div>
            </div>

        </React.Fragment>
    );
}