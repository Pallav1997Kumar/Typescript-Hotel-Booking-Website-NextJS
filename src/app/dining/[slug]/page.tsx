import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

import { convertToINR } from '@/functions/currency';

import DiningBookingComponent from "@/components/Dining Component/DiningBookingComponent";

import { Dining, DiningTiming, PriceList, DiningInfoResponse } from '@/interface/Dining Interface/hotelDiningInterface';
import { DiningWithDate, DateDetails, FoodCategoryDetails, DiningEachDayInfoRespone } from '@/interface/Dining Interface/eachDayDiningInfoInterface';
import { IContextSlug } from '@/interface/contextInterface';


interface MinPriceList{
    minPriceTitle: string;
    minPrice: number;
}


export async function generateMetadata(context: IContextSlug): Promise<Metadata> {
    const params = context.params;
    const slug: string = params.slug;
    const currentDiningPath: string = slug;
    const diningRestaurantInfo: Dining | undefined = await fetchCurrentDiningData(currentDiningPath);
    if(!diningRestaurantInfo){
        throw new Error("Missing diningRestaurantInfo");
    }
    const diningAreaTitle: string = diningRestaurantInfo.diningAreaTitle;
    return {
        title: diningAreaTitle,
    }
}


function getCurrentDiningRestaurantInfo(
    allDining: Dining[], 
    diningRestaurantPath: string
): Dining | undefined {
    const diningRestaurantInfo: Dining | undefined = allDining.find(function(eachDining: Dining){
        return (eachDining.diningPath === diningRestaurantPath);
    });
    return diningRestaurantInfo;
}


export async function fetchCurrentDiningData(
    currentDiningPath: string
): Promise<Dining | undefined> {
    try {
        // Fetching all dining information
        const response: Response = await fetch(
            `${process.env.URL}/api/hotel-booking-information/dining-information/`
        );
        const diningInfo: DiningInfoResponse = await response.json();
        const allDiningInfo: Dining[] = diningInfo.dining;

        // Find the current dining information based on the path
        const currentDiningInfo: Dining | undefined = getCurrentDiningRestaurantInfo(
            allDiningInfo, 
            currentDiningPath
        );

        return currentDiningInfo;
    } catch (error) {
        console.error('Error fetching room and suite information:', error);
    }
}


export async function fetchDiningEachDayDataAllRestaurant(): Promise<DiningWithDate[] | undefined>{
    try {
        const response: Response = await fetch(
            `${process.env.URL}/api/hotel-booking-information/dining-information/each-day-information/`
        );
        const data: DiningEachDayInfoRespone = await response.json();
        const allDiningWithDate: DiningWithDate[] = data.diningWithDate;
        return allDiningWithDate;
    } catch (error) {
        console.log(error);
    }
}


function getDiningStartingPriceOfEachTable(
    dateDetailsOfParticularDining: DateDetails[]
): Record<string, number> {
    const minPriceList: Record<string, number> = {};
    let priceListKeysArray: string[] = [];

    // Ensure the priceListKeysArray is populated correctly
    dateDetailsOfParticularDining.forEach(function(eachDateDetails: DateDetails){
        const eachDateFoodCategoryArr: FoodCategoryDetails[] = eachDateDetails.foodCategoryDetails;;
        eachDateFoodCategoryArr.forEach(function(eachFoodCategory: FoodCategoryDetails){
            const currentPriceList: PriceList = eachFoodCategory.currentFoodCategoryPriceList;
            priceListKeysArray = Object.keys(currentPriceList);
        });
    });

    // Initialize the minPriceList for each key with Infinity
    priceListKeysArray.forEach(function(eachPriceListKey){
        minPriceList[eachPriceListKey] = Infinity;
    });

    // Array to hold the price lists
    const priceListParticularDining: PriceList[] = [];

    // Collect all price lists in the priceListParticularDining array
    dateDetailsOfParticularDining.forEach(function(eachDateDetails: DateDetails){
        const eachDateFoodCategoryArr: FoodCategoryDetails[] = eachDateDetails.foodCategoryDetails;
        eachDateFoodCategoryArr.forEach(function(eachFoodCategory: FoodCategoryDetails){
            const currentPriceList: PriceList = eachFoodCategory.currentFoodCategoryPriceList;
            priceListParticularDining.push(currentPriceList);
        });
    });

    // Iterate over the price lists and calculate the minimum for each key
    priceListParticularDining.forEach(function(eachPriceList: PriceList){
        priceListKeysArray.forEach(function(key: string){
            minPriceList[key] = Math.min(minPriceList[key], eachPriceList[key as keyof PriceList]);
        }); 
    });
    return minPriceList;
}


function minPriceListArray(
    minPriceList: Record<string, number>
): MinPriceList[] {
    const minPriceListInArray: MinPriceList[] = Object.keys(minPriceList).map(key => {
        const spaceSeperatedChar: string = key.replace(/([A-Z])/g, ' $1').trim();
        const array: string[] = spaceSeperatedChar.split("Each ");
        const finalWording: string = "Minimum Price of ".concat(array[1]);
        const minPriceObject: MinPriceList = {
             minPriceTitle: finalWording,
             minPrice: minPriceList[key],
        }
        return minPriceObject;
    });
    return minPriceListInArray;
}


async function Page(context: IContextSlug){

    const slug: string = context.params.slug;
    const currentDiningPath: string = slug;

    const diningRestaurantInfo: Dining | undefined = 
        await fetchCurrentDiningData(currentDiningPath);
    if(!diningRestaurantInfo){
        throw new Error("Missing diningRestaurantInfo");
    }

    const diningWithDateInformationAllRestaurant: DiningWithDate[] | undefined = 
        await fetchDiningEachDayDataAllRestaurant();
    if(!diningWithDateInformationAllRestaurant){
        throw new Error("Missing diningWithDateInformationAllRestaurant");
    }

    const currentRestaurantEachDayData: DiningWithDate | undefined = 
        diningWithDateInformationAllRestaurant.find(function(eachRestaurant:  DiningWithDate){
            return eachRestaurant.diningTitle == diningRestaurantInfo.diningAreaTitle;
        });

    if(!currentRestaurantEachDayData){
        throw new Error("Missing currentRestaurantEachDayData");
    }

    const currentRestaurantDateDetails: DateDetails[] = 
        currentRestaurantEachDayData.dateDetails;
    const startingPriceOfDiningList: Record<string, number> = 
        getDiningStartingPriceOfEachTable(currentRestaurantDateDetails);
    const startingPriceOfDiningArray: MinPriceList[] = 
        minPriceListArray(startingPriceOfDiningList);


    return (
        
        <div className="m-8">

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
                    <span className="px-3">{'>>'}</span> 
                    <Link href={`/dining/${currentDiningPath}`}> 
                        <span className="text-xl text-indigo-600 hover:text-[#8b008b] hover:underline"> 
                            {diningRestaurantInfo.diningAreaTitle} 
                        </span>
                    </Link>
                </p>
            </div>

            {/* Dining Restaurant Title */}
            <h2 className="text-3xl font-semibold my-4">
                {diningRestaurantInfo.diningAreaTitle}
            </h2>
            
            <div className="flex flex-row">
                {/* Image Container */}
                <div className="w-[45%]">
                    <Image 
                        src={diningRestaurantInfo.photo} 
                        alt="dining-restaurant" 
                        width={500} 
                        height={300} 
                    />
                </div>

                {/* Restaurant Description */}
                <div className="w-[55%] pl-4">
                    <p className="text-brown text-lg">
                        <FontAwesomeIcon icon={faPhone} /> {diningRestaurantInfo.contactNo}
                    </p>
                    <p className="italic text-lg my-2">
                        {diningRestaurantInfo.shortDescription}
                    </p>
                    <p className="text-lg my-2">
                        {diningRestaurantInfo.diningDescription}
                    </p>

                    <div className="flex flex-row my-4">
                        {/* Cuisine List */}
                        <div className="w-[35%] text-red-700">
                            <p className="font-bold">Cuisines</p>
                            {(diningRestaurantInfo.cuisine).map(function(eachCuisine: string){
                                return (
                                    <li 
                                        className="list-inside list-decimal text-gray-700 my-1" 
                                        key={eachCuisine}
                                    >
                                        {eachCuisine}
                                    </li>
                                );
                            })}
                        </div>

                        {/* Timing Information */}
                        <div className="w-[65%] text-red-700">
                            <p className="font-bold">Timing</p>
                            {(diningRestaurantInfo.timing).map(function(eachTime: DiningTiming){
                                return (
                                    <div key={eachTime.foodCategory} className="flex flex-row my-2">
                                        <div className="w-[30%] text-green-800">
                                            {eachTime.foodCategory} : 
                                        </div>
                                        <div className="w-[70%] text-gray-700">
                                            {eachTime.foodTiming}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Minimum Price Section */}
            {(Array.isArray(startingPriceOfDiningArray) && startingPriceOfDiningArray.length > 0) &&
            <div className="flex flex-row bg-[#F28C8C] p-4 mt-4">
                {startingPriceOfDiningArray.map(function(eachTablePrice: MinPriceList){
                    return (
                        <p 
                            key={eachTablePrice.minPriceTitle} 
                            className="text-[#F4E1C1] text-lg font-semibold pr-6"
                        >
                            {eachTablePrice.minPriceTitle}: {convertToINR(eachTablePrice.minPrice)}
                        </p>
                    );
                })}
            </div>
            }

             {/* Reserve Table Section */}
            <div className="flex flex-row my-6">
                {/* Reserve Table Component */}
                <div className="w-[55%]">
                    <DiningBookingComponent diningRestaurantInfo={diningRestaurantInfo} />
                </div>
                {/* Image Container */}
                <div className="w-[45%] pl-4">
                    <Image 
                        src={diningRestaurantInfo.photo} 
                        alt="dining-restaurant" 
                        width={500} 
                        height={300} 
                    />
                </div>
            </div>
        </div>
        
    );

}

export default Page;