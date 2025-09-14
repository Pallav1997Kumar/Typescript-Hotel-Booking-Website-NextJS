import React from "react";
import Image from 'next/image';
import Link from 'next/link';

export function generateMetadata() {
    return {
        title: 'Royal Palace - About'
    };
}

function Page() {
    return (
        <React.Fragment>
            <Image 
                src="/hotel photo.jpg" 
                alt="hotel" 
                width={1500} 
                height={600} 
            />

            {/* Breadcrumb Navigation */}
            <div className="m-6 bg-[#f0f8ff] p-4">
                <p className="text-xl font-bold tracking-wider text-blueviolet">
                    <Link href="/">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            HOME 
                        </span>
                    </Link>
                    <span className="px-3"> {'>>'} </span>
                    <Link href="/about-us">
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline">
                            ABOUT US 
                        </span>
                    </Link>
                </p>
            </div>


            <h1 className="text-center font-bold text-3xl my-4">ABOUT US</h1>
            <div className="flex flex-row m-4">
                <div className="text-center px-[1.25%] tracking-wider space-y-2.5">
                    <p>
                        Royal Palace Kolkata Hotel & Residences stands proudly as Accor Hotel's first property in Eastern India. This hotel is a gateway to the City of Joy by being Eastern India’s one of the largest five-star facilities with over 340 guest rooms.
                    </p>
                    <p>
                        There are 47 pet-friendly serviced apartments. It is centrally located with close proximity to the airport, IT sector, key corporate houses, and recreational attractions with an imposing presence due to its colossal frontage and award-winning architecture.
                    </p>
                    <p>
                        The Hotel offers banqueting options spread over 30,000 sq. ft. of indoor and outdoor spaces, including the city’s very first rooftop banqueting space of over 18,000 sq. ft. Novotel Kolkata also specializes in multiple dining options with five outlets and the city’s largest All Day Diner.
                    </p>
                    <p>
                        Royal Palace Kolkata has the perfect balance of fitness and wellness which allow our guests to rejuvenate at our 24-hour fitness center which includes a spa, swimming pool, and a gym. Technologically savvy banquet halls and rooms are perfect for today’s traveler and corporate guest.
                    </p>
                    <p>
                        Our multi-cuisine specialty all-day dining restaurant The Square delivers a memorable experience by providing a wide range of quality international dishes. Royal Palace Kolkata holds a special Sunday Brunch for the guests to enjoy fresh and high-quality cuisine. For coffee lovers in town, we have an offering for the International Brew Experience at our Blue Tokai Café outlet.
                    </p>
                </div>
                <div>
                    <Image src="/hotel-kolkata.jpg" alt="hotel" width={500} height={400} />
                </div>
            </div>
        </React.Fragment>
    );
}

export default Page;
