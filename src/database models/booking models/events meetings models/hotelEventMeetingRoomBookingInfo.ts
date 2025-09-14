import mongoose from "mongoose";

import { IHotelEventMeetingRoomBookingInfo } from "@/interface/Event Meeting Interface/hotelEventMeetingBookingInterface";


const Schema = mongoose.Schema;


const hotelEventMeetingRoomBookingInfoSchema = new Schema<IHotelEventMeetingRoomBookingInfo>({
    meetingEventsInfoTitle: {
        type: String,
        required: true,
        enum: ['Crystal Hall', 'Portico', 'Oriental', 'Terrace Garden', 'Banquet Lawns', 'Mandarin']
    },
    meetingEventBookingDate: {
        type: Date,
        required: true
    },
    meetingEventBookingTime: {
        type: String,
        required: true,
        enum: ['Morning', 'Afternoon', 'Evening', 'Night', 'Mid Night']
    },
    totalGuestCount: {
        type: Number,
        required: true,
    },
    totalNumbersOfRoom: {
        type: Number,
        required: true,
    },
    availableNumbersOfRoom: {
        type: Number,
        required: true,
    },
    bookedNumbersOfRoom: {
        type: Number,
        required: true,
    },
    isBookingLocked : {
        type: Boolean,
        required: true,
        default: false,
    },
    lockedAt: {   
        type: Date,
        default: null,
    },
});


const HotelEventMeetingRoomBookingInfo = mongoose.models.HOTELEVENTMEETINGROOMBOOKINGINFO || mongoose.model('HOTELEVENTMEETINGROOMBOOKINGINFO', hotelEventMeetingRoomBookingInfoSchema);

export default HotelEventMeetingRoomBookingInfo;