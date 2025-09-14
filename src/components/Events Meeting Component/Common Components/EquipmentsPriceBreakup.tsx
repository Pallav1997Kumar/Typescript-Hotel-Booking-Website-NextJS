'use client'
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { convertToINR } from '@/functions/currency';

import { SeatingArrangementPriceList } from '@/interface/Event Meeting Interface/eventMeetingBookingInterface';


interface IPropsEquipmentsPriceBreakup {
    maximumGuestAttending: number;
    seatingArrangementPriceList: SeatingArrangementPriceList[];
}


function EquipmentsPriceBreakup(props: IPropsEquipmentsPriceBreakup) {
    const seatingArrangementPriceList: SeatingArrangementPriceList[] = props.seatingArrangementPriceList;
    const totalNumberOfGuest: number = props.maximumGuestAttending;

    const commonPriceIncludedForTotal = ['Price For Stage', 'Price For Projector', 'Price For Electrical Appliance', 'Total Price Of All Seats'];
    const specialPriceIncludedForTotal = ['Price For U Shape Table', 'Price Of Boardroom Table', 'Total Price Of All Circular Tables'];
    const priceNotIncludedForTotal = ['Price For Each Circular Table', 'Price For Each Seat'];
    const titleUsedForCounting = 'Number Of Circular Table Required';

    const seatingArrangementPriceListTitleUsedForCounting: SeatingArrangementPriceList[] = seatingArrangementPriceList.filter(function(eachListItem: SeatingArrangementPriceList){
        return eachListItem.priceNameProperty == titleUsedForCounting;
    });
    const seatingArrangementPriceListNotIncludedForTotal: SeatingArrangementPriceList[] = seatingArrangementPriceList.filter(function(eachListItem: SeatingArrangementPriceList){
        if(eachListItem.priceNameProperty){
            return priceNotIncludedForTotal.includes(eachListItem.priceNameProperty);
        }   
    });
    const seatingArrangementPriceListIncludedForSpecialTotal: SeatingArrangementPriceList[] = seatingArrangementPriceList.filter(function(eachListItem: SeatingArrangementPriceList){
        if(eachListItem.priceNameProperty){
            return specialPriceIncludedForTotal.includes(eachListItem.priceNameProperty);
        }
    });
    const seatingArrangementPriceListIncludedForCommonTotal: SeatingArrangementPriceList[] = seatingArrangementPriceList.filter(function(eachListItem: SeatingArrangementPriceList){
        if(eachListItem.priceNameProperty){
            return commonPriceIncludedForTotal.includes(eachListItem.priceNameProperty);
        }
    });

    let totalPriceForEquipments: number = 0;
    seatingArrangementPriceListIncludedForSpecialTotal.forEach(function(eachListItem){
        if(eachListItem.priceOfProperty){
            totalPriceForEquipments = totalPriceForEquipments + eachListItem.priceOfProperty;
        }
    });
    seatingArrangementPriceListIncludedForCommonTotal.forEach(function(eachListItem){
        if(eachListItem.priceOfProperty){
            totalPriceForEquipments = totalPriceForEquipments + eachListItem.priceOfProperty;
        }
    });

    const [showEquipmentsPriceBreakup, setShowEquipmentsPriceBreakup] = useState<boolean>(false);


    const modalBoxStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        border: '4px solid #000',
        boxShadow: 24,
        p: 2,
    };

    return (
        <div>
            <Button variant="outlined" onClick={()=> setShowEquipmentsPriceBreakup(true)}>Show Price Breakup</Button>
            <Modal
                open={showEquipmentsPriceBreakup}
                onClose={()=> setShowEquipmentsPriceBreakup(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalBoxStyle}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Total Number Of Guests</TableCell>
                                    <TableCell>{totalNumberOfGuest}</TableCell>
                                </TableRow>
                                
                                {(seatingArrangementPriceListTitleUsedForCounting.length > 0) && seatingArrangementPriceListTitleUsedForCounting.map(function(eachListItem: SeatingArrangementPriceList){
                                    return (
                                        <TableRow key={eachListItem.priceNameProperty}>
                                            <TableCell>{eachListItem.priceNameProperty}</TableCell>
                                            <TableCell>{eachListItem.priceOfProperty}</TableCell>
                                        </TableRow>
                                    )
                                })}
                                
                                {(seatingArrangementPriceListNotIncludedForTotal.length > 0) && seatingArrangementPriceListNotIncludedForTotal.map(function(eachListItem: SeatingArrangementPriceList){
                                    return (
                                        <TableRow key={eachListItem.priceNameProperty}>
                                            <TableCell>{eachListItem.priceNameProperty}</TableCell>
                                            {(eachListItem.priceOfProperty) && 
                                                <TableCell>{convertToINR(eachListItem.priceOfProperty)}</TableCell>
                                            }
                                        </TableRow>
                                    )
                                })}
                                
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <br />
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableBody>
                                                                
                                {(seatingArrangementPriceListIncludedForSpecialTotal.length > 0) && seatingArrangementPriceListIncludedForSpecialTotal.map(function(eachListItem: SeatingArrangementPriceList){
                                    return (
                                        <TableRow key={eachListItem.priceNameProperty}>
                                            <TableCell>{eachListItem.priceNameProperty}</TableCell>
                                            {(eachListItem.priceOfProperty) && 
                                                <TableCell>{convertToINR(eachListItem.priceOfProperty)}</TableCell>
                                            }
                                        </TableRow>
                                    )
                                })} 

                                {(seatingArrangementPriceListIncludedForCommonTotal.length > 0) && seatingArrangementPriceListIncludedForCommonTotal.map(function(eachListItem: SeatingArrangementPriceList){
                                    return (
                                        <TableRow key={eachListItem.priceNameProperty}>
                                            <TableCell>{eachListItem.priceNameProperty}</TableCell>
                                            {(eachListItem.priceOfProperty) && 
                                                <TableCell>{convertToINR(eachListItem.priceOfProperty)}</TableCell>
                                            }
                                        </TableRow>
                                       )
                                })} 

                                <TableRow>
                                    <TableCell>Total Price</TableCell>
                                    <TableCell>{convertToINR(totalPriceForEquipments)}</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
        </div>
    );
}

export default EquipmentsPriceBreakup;