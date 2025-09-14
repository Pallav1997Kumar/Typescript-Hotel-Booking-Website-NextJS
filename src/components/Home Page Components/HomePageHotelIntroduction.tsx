import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faDog, faBurger } from "@fortawesome/free-solid-svg-icons";

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";


function HomePageHotelIntroduction() {
    return (
        <ErrorBoundary>
            <HomePageHotelIntroductionFunctionalComponent />
        </ErrorBoundary>
    );
}


function HomePageHotelIntroductionFunctionalComponent() {
    return(
        <div className="w-full">
            {/* Hotel Introduction Section */}
            <div className="bg-red-200 p-8">
                <p className="text-gray-800 text-lg leading-relaxed tracking-wider font-medium">
                    Royal Palace is a landmark luxury hotel in downtown Kolkata, in the exclusive neighbourhood of Alipore at the heart of its cultural heritage. Prominent landmarks — Victoria Memorial, Royal Calcutta Race Course, Horticultural Gardens, National Library, Eden Gardens and the Alipore Zoological Gardens—are all within walking distance.
                </p>
                <p className="text-gray-800 text-lg leading-relaxed tracking-wider font-medium">
                    It is the luxury hotel closest to government offices and most consulates. The city’s commercial centre is just two miles (three km) away; 45 minutes’ drive to the airport. 
                </p>
                <p className="text-gray-800 text-lg leading-relaxed tracking-wider font-medium">
                    But for the twinkling views of the stunning Kolkata skyline, you could forget the hotel’s location in the centre of the bustling metropolis. Nestled in the city’s greenest precinct, you are in paradise, with lush flora teeming with birdlife and clear views of the Alipore Zoological Gardens. 
                </p>
                <p className="text-gray-800 text-lg leading-relaxed tracking-wider font-medium">
                    Designed by legendary architect Bob Fox, the architecture and interiors of our 5 star hotel in Kolkata is deeply inspired by the city’s famed art, culture and heritage. All around, grandeur meets understated elegance—you are awed by the lavish five-storied stone and marble atrium, bathed in glorious gold light each afternoon. Genuine antiques, priceless art, and traditional accents and colours are impeccably woven together with contemporary style and modern amenities. 
                </p>
                <p className="text-gray-800 text-lg leading-relaxed tracking-wider font-medium">
                    Stay in our grand luxury rooms and suites, or at our Grand Presidential Suite. Indulge yourself with a day at Spa and shop for finely curated Indian artefacts at Royal Khazana. Spectacular venues make the hotel the preferred choice for business meetings, social events and weddings. 
                </p>
                <p className="text-gray-800 text-lg leading-relaxed tracking-wider font-medium">
                    The wide array of fine-dining restaurants at Royal Palace is the best in Kolkata. Enjoy robust North-West frontier, Punjabi and Bengali cuisines at the ambient Sonargaon, authentic Chinese at Chinoiserie, and Lebanese and Mediterranean at Souk. Our award-winning 24 Hour all day dining, Cal 27 serves an assortment of world cuisines; for an on-the-go craving, there is La Patisserie and Deli. The Junction Bar and Promenade Lounge are perennial favourites; and during winters, the Grill by the Pool is a special treat. 
                </p>
                <p className="text-gray-800 text-lg leading-relaxed tracking-wider font-medium">
                    Our signature Royal hospitality infuses your time at this hotel with warmth and the utmost in personal care, service and exclusivity. Be pampered by our world-renowned butlers and enjoy sumptuous in-room-dining experiences. 
                </p>
                <p className="text-gray-800 text-lg leading-relaxed tracking-wider font-medium">
                    Come, retreat into this tranquil paradise in the City of Joy.
                </p>
            </div>

            {/* Hotel Highlights Section */}
            <div className="bg-teal-200 p-8">
                <h4 className="text-xl font-semibold mb-2">Hotel Highlights</h4>
                <p className="flex items-center text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2" /> 
                    <span>Located in the Heart of the City</span>
                </p>
                <p className="flex items-center text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2" /> 
                    <span>Spacious Atrium Lobby</span>
                </p>
                <p className="flex items-center text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faDog} className="mr-2" /> 
                    <span>Pet-friendly Hotel</span>
                </p>
                <p className="flex items-center text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faBurger} className="mr-2" /> 
                    <span>International, Authentic Indian, Bengali, Mediterranean & Chinese Cuisine</span>
                </p>
            </div>

            {/* Hotel Policies Section */}
            <div className="bg-green-200 p-8">
                <h4 className="text-xl font-semibold mb-2">
                    Hotel Policies
                </h4>
                <p className="text-gray-700 mb-2">
                    Check-in time: 09:00 hrs 
                </p>
                <p className="text-gray-700 mb-2">
                    Check-out time: 09:00 hrs 
                </p>
                <p className="text-gray-700 mb-2">
                    Early check-in and late check-out on request
                </p>
                <p className="text-gray-700 mb-2">
                    We accept American Express, Diner's Club, Master Card, Visa, JCB International
                </p>
                <p className="text-gray-700 mb-2">
                    Pets are welcomed.
                </p>
            </div>
        </div>
    );
}

export default HomePageHotelIntroduction;