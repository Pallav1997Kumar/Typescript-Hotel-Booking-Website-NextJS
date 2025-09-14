import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


export function generateMetadata(){
    return {
        title: 'Royal Palace - Swimming Pool'
    }
}


export default function page(){
    return (
        <React.Fragment>
            <div className="my-1">
                <Image 
                    src={'/Swimming Pool/swimming pool.jpg'} 
                    alt="swimming pool image" 
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
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/facility-in-our-hotel/swimming-pool"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline">
                             SWIMMING POOL 
                        </span>
                    </Link>
                </p>
            </div>

            {/* Swimming Pool Info */}
            <div className="mx-12 my-10 space-y-4">
                <h1 className="text-center text-3xl font-serif tracking-wider font-bold mb-4">
                    Swimming Pool
                </h1>
                <p className="text-lg leading-relaxed">
                    The newly redesigned Swimming Pool at our family friendly hotel.
                </p>
                <p className="text-lg leading-relaxed">
                    It offers you a great venue to celebrate unforgettable moments. Enjoy our light meals and refreshing drinks at our Pool Bar. 
                </p>
                <p className="text-lg leading-relaxed">
                    The swimming pool featured Semi Olympic size Swimming Pool. Experience your barbecue nights, prom night or any of your social event at our Swimming Pool.
                </p>
            </div>
        </React.Fragment>
    );
}