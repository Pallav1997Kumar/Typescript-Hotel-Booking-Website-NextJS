import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";

import hotelBasicInfo from "@/json objects/hotelBasicInfo";


interface HotelBasicInfo {
    address: string;
    contactNo: string;
    emailId: string;
}


function BasicContactInformation() {
    return (
        <ErrorBoundary>
            <BasicContactInformationFunctionalComponent />
        </ErrorBoundary>
    );
}

function BasicContactInformationFunctionalComponent() {

    const { address, contactNo, emailId }: HotelBasicInfo = hotelBasicInfo;

    return(
        <React.Fragment>
            <p className="flex items-center space-x-2 text-lg text-yellow-500 p-1 ml-2">
                <FontAwesomeIcon icon={faLocationDot} /> 
                <span className="text-gray-700">{address} </span>
            </p>
            <p className="flex items-center space-x-2 text-lg text-yellow-500 p-1 ml-2">
                <FontAwesomeIcon icon={faPhone} /> 
                <span className="text-gray-700">{contactNo} </span>
            </p>
            <p className="flex items-center space-x-2 text-lg text-yellow-500 p-1 ml-2">
                <FontAwesomeIcon icon={faEnvelope} /> 
                <span className="text-gray-700">{emailId} </span>
            </p>
        </React.Fragment>
    );
}

export default BasicContactInformation