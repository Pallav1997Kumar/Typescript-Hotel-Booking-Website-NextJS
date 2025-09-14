'use client'
import React, { useState } from "react";

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { calculateAgeFromDob, getDateTextFromFullDate, utcTimeToISTConvesion } from "@/functions/date";
import { convertToINR } from "@/functions/currency";

import { ITransactionDetailsForAdmin } from "@/interface/Hotel User Interface/hotelAdminViewTxnHistoryInterface";


const tableBodyStyle = {
    border: '1.5px dotted rgb(24, 90, 177)',
    color: ' rgb(247, 23, 42)'
}

const tableStyle = {
    position: 'absolute',
    top: '50%',
    left: '40%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    boxShadow: 24,
    px: 4,
    py: 2,
    fontSize: '0.8rem'
};


interface IPropsViewPracticularTransactionDetails {
    eachTransactionDetails: ITransactionDetailsForAdmin;
}

function ViewPracticularTransactionDetails(props: IPropsViewPracticularTransactionDetails){

    const eachTransactionDetails: ITransactionDetailsForAdmin = props.eachTransactionDetails;

    const [openCustomerDetails, setOpenCustomerDetails] = useState<boolean>(false);

    return (
        <TableRow>
            <TableCell sx={tableBodyStyle}>{eachTransactionDetails.customerDetails.fullName}</TableCell>
            <TableCell sx={tableBodyStyle}>{eachTransactionDetails.customerDetails.emailAddress}</TableCell>
            <TableCell sx={tableBodyStyle}>{utcTimeToISTConvesion(eachTransactionDetails.transactionDateTime.toString())}</TableCell>
            <TableCell sx={tableBodyStyle}>{eachTransactionDetails.transactionType}</TableCell>
            <TableCell sx={tableBodyStyle}>{convertToINR(eachTransactionDetails.transactionAmount)}</TableCell>
            <TableCell sx={tableBodyStyle}>{eachTransactionDetails.transactionDescription}</TableCell>
            <TableCell sx={tableBodyStyle}>
                <Button color="error" variant="outlined" onClick={()=>setOpenCustomerDetails(true)}>
                    View Customer's Details
                </Button>
                <Modal
                    open={openCustomerDetails}
                    onClose={()=>setOpenCustomerDetails(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={tableStyle}>
                        <Typography component="div">
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>First Name</TableCell>
                                            <TableCell>{eachTransactionDetails.customerDetails.firstName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Middle Name</TableCell>
                                            <TableCell>{eachTransactionDetails.customerDetails.middleName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Last Name</TableCell>
                                            <TableCell>{eachTransactionDetails.customerDetails.lastName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>{eachTransactionDetails.customerDetails.fullName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Gender</TableCell>
                                            {(eachTransactionDetails.customerDetails.gender === "male") &&
                                                <TableCell>Male</TableCell>
                                            }
                                            {(eachTransactionDetails.customerDetails.gender === "female") &&
                                                <TableCell>Female</TableCell>
                                            }
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Date of Birth</TableCell>
                                            <TableCell>{getDateTextFromFullDate(eachTransactionDetails.customerDetails.dateOfBirth.toString())}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Age</TableCell>
                                            <TableCell>{calculateAgeFromDob(eachTransactionDetails.customerDetails.dateOfBirth.toString())}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Email Address</TableCell>
                                            <TableCell>{eachTransactionDetails.customerDetails.emailAddress}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Contact Number</TableCell>
                                            <TableCell>{eachTransactionDetails.customerDetails.contactNo}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Alternate Contact Number</TableCell>
                                            <TableCell>{eachTransactionDetails.customerDetails.alternateContactNo}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Typography>
                    </Box>
                </Modal>
            </TableCell>
        </TableRow>
    );

}

export default ViewPracticularTransactionDetails;