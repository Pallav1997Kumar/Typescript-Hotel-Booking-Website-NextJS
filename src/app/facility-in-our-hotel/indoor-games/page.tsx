import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


export function generateMetadata(){
    return {
        title: 'Royal Palace - Indoor Games'
    }
}


export default function page() {
    return (
        <React.Fragment>
            <div className="my-1">
                <Image 
                    src={'/Indoor Games/indoor -games.jpg'} 
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
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/facility-in-our-hotel/indoor-games"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            INDOOR GAMES CENTRE 
                        </span>
                    </Link>
                </p>
            </div>

            <div className="p-12 bg-[#def5f5]">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Indoor Games at our hotel
                </h2>
                <p className="text-lg mb-2">
                    Gaming is not always about to sweat, many games can relax and revive you even if you are sitting inside a room. 
                </p>
                <p className="text-lg mb-2">
                    At our hotel's clubhouse, we bring you such an opportunity where you can play your favorite indoor games at the most comfortable surroundings.
                </p>
                <p className="text-lg mb-2">
                    We offer an array of indoor games ranging from billiards, chess, carrom to cards. The best part of our indoor gaming area is that we offer friendly and relaxing zones adequate for both men and women.
                </p>
                <p className="text-lg mb-2">
                    You can come and enjoy your quality time with buddies and family members with no hesitation at our club indoor gaming zones.
                </p>
            </div>

            <div className="p-12 bg-beige">
                <h4 className="text-xl font-semibold mb-4">
                    List of Indoor Games
                </h4>
                <div className="flex flex-wrap">
                    {/* First Column of Games */}
                    <div className="w-full sm:w-1/2">
                        <li className="py-2 text-lg">Table Tennis</li>
                        <Image src={'/Indoor Games/table-tennis.jpg'} alt="table-tennis" width={500} height={300} className="object-cover" />
                        <li className="py-2 text-lg">Carrom</li>
                        <Image src={'/Indoor Games/carrom.jpg'} alt="carrom" width={500} height={300} className="object-cover" />
                        <li className="py-2 text-lg">Ludo</li>
                        <Image src={'/Indoor Games/ludo.jpg'} alt="ludo" width={500} height={300} className="object-cover" />
                        <li className="py-2 text-lg">Snooker</li>
                        <Image src={'/Indoor Games/snooker.jpg'} alt="snooker" width={500} height={300} className="object-cover" />
                    </div>
                    {/* Second Column of Games */}
                    <div className="w-full sm:w-1/2">
                        <li className="py-2 text-lg">Chess</li>
                        <Image src={'/Indoor Games/chess.jpg'} alt="chess" width={500} height={300} className="object-cover" />
                        <li className="py-2 text-lg">Tabletop Football</li>
                        <Image src={'/Indoor Games/foosball-table-hotel.webp'} alt="foosball" width={500} height={300} className="object-cover" />
                        <li className="py-2 text-lg">Billiards</li>
                        <Image src={'/Indoor Games/billiards.jpg'} alt="billards" width={500} height={300} className="object-cover" />
                        <li className="py-2 text-lg">Cards Games</li>
                        <Image src={'/Indoor Games/people-playing-cards.webp'} alt="cards" width={500} height={300} className="object-cover" />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}