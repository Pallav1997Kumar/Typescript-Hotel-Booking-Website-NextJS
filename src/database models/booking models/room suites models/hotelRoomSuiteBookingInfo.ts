import mongoose from "mongoose";
import { IHotelRoomSuiteBookingInfo } from "@/interface/Rooms and Suites Interface/hotelRoomsSuitesBookingInterface";


const Schema = mongoose.Schema;


const hotelRoomSuiteBookingInfoSchema = new Schema<IHotelRoomSuiteBookingInfo>({
    bookingRoomTitle: {
        type: String,
        required: true,
        enum: ['Deluxe Rooms', 'Luxury Rooms', 'Premier Rooms', 'Premier Plus Rooms', 'Oberoi Suites', 'Deluxe Suites', 'Luxury Suites', 'Kohinoor Suites']
    },
    hotelBookingDate: {
        type: Date,
        required: true,
    },
    totalGuestCount: {
        type: Number,
        required: true,
    },
    totalRoomsCount: {
        type: Number,
        required: true,
    },
    bookedRoomsCount: {
        type: Number,
        required: true,
    },
    availableRoomsCount: {
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


const HotelRoomSuiteBookingInfo = mongoose.models.HOTELROOMSUITEBOOKINGINFO || mongoose.model('HOTELROOMSUITEBOOKINGINFO', hotelRoomSuiteBookingInfoSchema);

export default HotelRoomSuiteBookingInfo;