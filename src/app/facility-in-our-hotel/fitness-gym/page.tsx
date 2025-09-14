import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


export function generateMetadata(){
    return {
        title: 'Royal Palace - Gym'
    }
}


export default function page(){
    return(
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
                    <span className="px-3">{'>>'}</span> 
                    <Link href="/facility-in-our-hotel/fitness-gym"> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            FITNESS CENTRE 
                        </span>
                    </Link>
                </p>
            </div>
            
            <div className="my-12 mx-10 text-center">
                <h2 className="text-3xl font-semibold mb-4">
                    Find your perfect fit with our hotels with gym.
                </h2>
                <p className="py-2 text-lg leading-relaxed mb-4">
                    When you choose to stay at NH Hotels, there will be no need to put your healthy habits on hold while you are away from home: in our hotels, you can rely on exercise and wellness spaces that are designed to meet your needs and complement your day-to-day life when you are traveling.
                </p>
                <p className="py-2 text-lg leading-relaxed mb-4">
                    With the range of facilities on offer, continuing your weekly workout routine of choice will be effortless. All our hotels with gym are fully equipped with fitness areas, while some have indoor and outdoor pools, and even ready-made routes for running and cycling.
                </p>
                <p className="py-2 text-lg leading-relaxed mb-4">
                    For a little time out from daily life, at some of our hotels you will also find spas and wellness centers which offer a range of facilities and treatments.
                </p>
                <p className="py-2 text-lg leading-relaxed mb-4">
                    Whether you are with us on business or on a family vacation, and whatever your schedule may be, we will provide you with a convenient way to maintain your fitness routine and feel good inside and out.
                </p>
            </div>

            <div className="my-12 mx-10">
                <h4 className="text-2xl font-semibold mb-4">
                    Gyms and fitness areas: Your workout, your way
                </h4>
                {/* First Fitness Section */}
                <div className="flex mb-8">
                    <div className="w-1/2 pr-4">
                        <p className="text-lg leading-relaxed mb-4">
                            The gyms and fitness rooms found in all our hotels are modern, open, and inviting. Designed exclusively for our guests, they are functional, dedicated spaces in which to improve physical and mental wellbeing with a workout that is exactly the way you want it. What’s more, the long opening hours enable you to work out around your schedule.
                        </p>
                        <p className="text-lg leading-relaxed mb-4">
                            Through a world agreement with market leader Technogym, we are committed to enhancing your workout away from home with the very best equipment. Our gyms are equipped with a variety of top-of-the-range cardio and resistance machines, as well as free weights and yoga spaces, to facilitate a varied exercise session that meets your fitness plan, needs, and mood.
                        </p>
                    </div>
                    <div className="w-1/2">
                        <Image src={'/Fitness/gym1.jpg'} alt="gym1" height={280} width={500} />
                    </div>
                </div>
                {/* Second Fitness Section */}
                <div className="flex mb-8">
                    <div className="w-1/2">
                        <Image src={'/Fitness/gym2.jpeg'} alt="gym2" height={250} width={500} />
                    </div>
                    <div className="w-1/2 pl-4">
                        <p className="text-lg leading-relaxed mb-4">
                            In addition to the best equipment, we also provide a range of complimentary workout essentials to guarantee your comfort and wellbeing. Most of our hotels with gym offer speakers and televisions to allow you to personalize your exercise space with your music or program of choice, or you can also catch up on the latest in the choice of newspapers.
                        </p>
                        <p className="text-lg leading-relaxed mb-4">
                            Then, after physical exertion, the complimentary isotonic drinks, water, and fresh fruit in our fitness spaces will help you to stay refreshed and hydrated. Finally, towels and changing rooms will be convenient features at the end of your workout.
                        </p>
                    </div>
                </div>
                {/* Third Fitness Section */}
                <div className="flex mb-8">
                    <div className="w-1/2 pr-4">
                        <p className="text-lg leading-relaxed mb-4">
                            Zumba is a cardio fitness activity that combines all the essential elements of fitness: cardio, muscle strengthening, balance and flexibility. Choreography is mainly inspired by Latin dance and fitness moves.
                        </p>
                        <p className="text-lg leading-relaxed mb-4">
                            During your stay, let our coaches will guide you through a session that will have you dancing to the rhythm of the music. This activity is available to complement your stay.
                        </p>
                    </div>
                    <div className="w-1/2">
                        <Image src={'/Fitness/zumba.jpg'} alt="zumba" height={200} width={500} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}