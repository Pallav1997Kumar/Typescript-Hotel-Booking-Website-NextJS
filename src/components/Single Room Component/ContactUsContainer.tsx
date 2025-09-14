"use client"
import styles from "./ContactUsContainer.module.css";
import hotelBasicInfo from "@/json objects/hotelBasicInfo";

import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary';


function ContactUsContainer() {
    return (
        <ErrorBoundary>
            <ContactUsContainerFunctionalComponent />
        </ErrorBoundary>
    );
}


function ContactUsContainerFunctionalComponent() {
    return (
        <div className="my-[2%]">
            <h3 className="text-[1.35rem] italic font-[Gill_Sans,Calibri,Trebuchet_MS,sans-serif]">
                Contact Us
            </h3>

            <div className="my-[1%]">
                {/* Email Row */}
                <div className="flex my-[0.4%] w-full">
                    <div className="w-2/5 font-bold">Email: </div>
                    <div className="w-3/5">{hotelBasicInfo.emailId}</div>
                </div>

                {/* Contact Number Row */}
                <div className="flex my-[0.4%] w-full">
                    <div className="w-2/5 font-bold">Contact Number: </div>
                    <div className="w-3/5">{hotelBasicInfo.contactNo}</div>
                </div>
            </div>
        </div>
    );
}


export default ContactUsContainer;