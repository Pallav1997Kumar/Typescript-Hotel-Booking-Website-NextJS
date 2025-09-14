'use client'
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { convertToINR } from '@/functions/currency';

import { EventTimingDetailsForFoodPrice } from '@/interface/Event Meeting Interface/eachDayEventMeetingInfoInterface';
import { FoodServicePricePerGuest } from '@/interface/Event Meeting Interface/eventMeetingRoomInterface';



interface IPropsMealsPriceBreakup{
    selectedMeals: string[] | undefined;
    maximumGuestAttending: number;
    allMealsList: EventTimingDetailsForFoodPrice;
}


function MealsPriceBreakup(props: IPropsMealsPriceBreakup) {

    const [showFoodItemsPriceBreakup, setShowFoodItemsPriceBreakup] = useState<boolean>(false);

    const selectedMeals: string[] | undefined = props.selectedMeals;
    const allMealsListInformation: EventTimingDetailsForFoodPrice = props.allMealsList;
    const maximumGuestAttending: number = props.maximumGuestAttending;

    let selectedMealsListWithPrice: FoodServicePricePerGuest[] | undefined;
    if(Object.hasOwn(allMealsListInformation, 'meetingEventCurrentTimingFoodPrice')){
        const allMealsListWithPrice: FoodServicePricePerGuest[] = allMealsListInformation.meetingEventCurrentTimingFoodPrice;
        selectedMealsListWithPrice = allMealsListWithPrice.filter(function(eachFoodItem: FoodServicePricePerGuest){
            if(selectedMeals){
                return selectedMeals.includes(eachFoodItem.foodTitle);
            }
        });
    }
    //console.log(selectedMealsListWithPrice);

    let totalPriceOfMeals: number = 0;
    if(selectedMealsListWithPrice){
        if(Array.isArray(selectedMealsListWithPrice)){
            selectedMealsListWithPrice.forEach(function(eachFoodItem: FoodServicePricePerGuest){
                totalPriceOfMeals = totalPriceOfMeals + eachFoodItem.pricePerGuest;
            });
            totalPriceOfMeals = totalPriceOfMeals * maximumGuestAttending;
        }
    }

    const modalBoxStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        border: '4px solid #000',
        boxShadow: 24,
        p: 2,
    };

    const tableHeadingStyling = {
        fontWeight: 'bold',
        fontSize: '1.03rem',
        backgroundColor: 'rgb(55, 47, 45)',
        color: 'rgb(232, 219, 216)'
    }

    const totalStyling = {
        fontWeight: 'bold'
    }
    

    return (
        <div>
            <Button variant="outlined" onClick={()=> setShowFoodItemsPriceBreakup(true)}>Show Price Breakup</Button>
            <Modal
                open={showFoodItemsPriceBreakup}
                onClose={()=> setShowFoodItemsPriceBreakup(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalBoxStyle}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeadingStyling}>Food Item Name</TableCell>
                                    <TableCell sx={tableHeadingStyling}>Food Item Price Per Guest</TableCell>
                                    <TableCell sx={tableHeadingStyling}>Total Number of Guest</TableCell>
                                    <TableCell sx={tableHeadingStyling}>Food Item Total Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedMealsListWithPrice && selectedMealsListWithPrice.map(function(eachFoodItem: FoodServicePricePerGuest){
                                    return (
                                        <TableRow key={eachFoodItem.foodTitle}>
                                            <TableCell>
                                                {(eachFoodItem.foodTitle).split('(')[0]}
                                            </TableCell>
                                            <TableCell>{convertToINR(eachFoodItem.pricePerGuest)}</TableCell>
                                            <TableCell>{maximumGuestAttending}</TableCell>
                                            <TableCell>{convertToINR(eachFoodItem.pricePerGuest * maximumGuestAttending)}</TableCell>
                                        </TableRow>
                                    )
                                })}
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{convertToINR(totalPriceOfMeals)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
            
        </div>
    );
}

export default MealsPriceBreakup;