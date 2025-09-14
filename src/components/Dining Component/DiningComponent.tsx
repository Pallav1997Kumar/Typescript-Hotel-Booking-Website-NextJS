import React from 'react';
import Image from 'next/image';
import Link from 'next/link'
import Button from '@mui/material/Button';

import { convertToINR } from '@/functions/currency';

import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary';

import { Dining, PriceList } from '@/interface/Dining Interface/hotelDiningInterface';
import { DiningWithDate, DateDetails, FoodCategoryDetails, DiningEachDayInfoRespone } from "@/interface/Dining Interface/eachDayDiningInfoInterface";


// Define types for dining data
interface IDiningProps{
    currentDining: Dining;
}


function DiningComponent(props: IDiningProps){
    return (
        <ErrorBoundary>
            <DiningComponentFunctionalComponent
                currentDining={props.currentDining}
            />
        </ErrorBoundary>
    );
}


async function DiningComponentFunctionalComponent(props: IDiningProps) {
    const currentDining: Dining = props.currentDining;
    const diningTitle: string = currentDining.diningAreaTitle;
    const diningPath: string = currentDining.diningPath;

    const diningWithDateInformation: DiningWithDate | undefined = await fetchDiningEachDayData(diningTitle);
    if(!diningWithDateInformation){
        throw new Error("Missing diningWithDateInformation");
    }
    const dateDetailsOfDining: DateDetails[] = diningWithDateInformation.dateDetails;
    const startingPriceOfDining: number = getDiningStartingPrice(dateDetailsOfDining);

    function getDiningStartingPrice(dateDetailsOfParticularDining: DateDetails[]): number{
        let minimumPrice: number = Infinity;
        dateDetailsOfParticularDining.forEach(function(eachDateDetails: DateDetails){
            const eachDateFoodCategoryArr: FoodCategoryDetails[] = eachDateDetails.foodCategoryDetails;
            eachDateFoodCategoryArr.forEach(function(eachFoodCategory: FoodCategoryDetails){
                const currentPriceList: PriceList = eachFoodCategory.currentFoodCategoryPriceList;
                const currentPriceListArray: number[] = Object.values(currentPriceList);
                currentPriceListArray.forEach(function(eachPrice: number){
                    if(eachPrice < minimumPrice){
                        minimumPrice = eachPrice;
                    }
                })
            })
        });
        return minimumPrice;
    }

    
    return (
        <div className="flex flex-row m-[5%_3%] border border-blue-500 p-[1%] bg-[#ffe4c4]">
            <div className="w-2/5">
                <Image src={currentDining.photo} alt="current-dining" width={500} height={300} />
            </div>

            <div className="w-3/5 px-[2%] py-[1%]">
                <h3 className="mb-[2.5%] text-xl font-semibold">{currentDining.diningAreaTitle}</h3>
                <p className="text-xs text-gray-500">Contact No: {currentDining.contactNo}</p>
                <p className="my-[1.75%] text-[1.05rem] text-[#1f1b1b]">{currentDining.shortDescription}</p>

                <div className="flex flex-row">
                    <div className="w-1/2">
                        <p className="text-brown-700 font-medium">Cuisine: </p>
                        <ul className="list-[square] ml-5">
                            {(currentDining.cuisine).map(function(eachCuisine: string){
                                return (<li key={eachCuisine}>{eachCuisine}</li>)
                            })}
                        </ul>
                    </div>
                    <div className="w-1/2">
                        <p className="text-brown-700 font-medium">Timing: </p>
                        <ul className="list-[square] ml-5">
                            {(currentDining.timing).map(function(eachTime){
                                return (<li key={eachTime.foodCategory}>{eachTime.foodCategory} - {eachTime.foodTiming}</li>)
                            })}
                        </ul>
                    </div>
                </div>

                <div className="flex items-center justify-center mt-4">
                    <p className="bg-teal-500 text-white font-semibold px-4 py-2 rounded">
                        Booking Price Starts at {convertToINR(startingPriceOfDining)}
                    </p>
                </div>
                <div className="mt-6 flex items-center justify-center">
                    <Link href={`/dining/${diningPath}`}>
                        <Button variant="contained">EXPLORE DINING</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
    
}


async function fetchDiningEachDayData(diningTitle: string): Promise<DiningWithDate | undefined>{
    try {
        const response: Response = await fetch(`${process.env.URL}/api/hotel-booking-information/dining-information/each-day-information/`);
        const data: DiningEachDayInfoRespone = await response.json();
        const allDiningWithDate: DiningWithDate[] = data.diningWithDate;
        const particularDiningEachDayInfo: DiningWithDate | undefined = allDiningWithDate.find(function(eachDiningWithDate: DiningWithDate){
            return eachDiningWithDate.diningTitle == diningTitle;
        });
        return particularDiningEachDayInfo;
    } catch (error) {
        console.log(error);
    }
}


export default DiningComponent;