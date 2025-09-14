import mongoose from "mongoose";
import { IHotelDiningTableBookingInfo, ITableBookingCountDetails } from "@/interface/Dining Interface/hotelDiningBookingInterface";


const Schema = mongoose.Schema;


const tableBookingCountDetailsSchema  = new Schema<ITableBookingCountDetails>({
    tableCountTwoPerson: {
        type: Number,
        required: true
    },
    tableCountFourPerson: {
        type: Number,
        required: true
    },
    tableCountSixPerson: {
        type: Number,
        required: true
    }
});


const hotelDiningTableBookingInfoSchema = new Schema<IHotelDiningTableBookingInfo>({
    diningRestaurantTitle: {
        type: String,
        required: true,
        enum: ['Cal 27', 'Sonargaon', 'Chinoiserie', 'Souk', 'The Junction', 'Grill By The Pool', 'The Promenade Lounge', 'La Patisserie And Deli', 'The Chambers'],
    },
    tableBookingDate: {
        type: Date,
        required: true
    },
    mealType: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner', 'general']
    },
    tableBookingTime: {
        type: String,
        required: true
    },
    totalNoOfGuest: {
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
    totalTablesCount: tableBookingCountDetailsSchema,
    availableTablesCount: tableBookingCountDetailsSchema,
    bookedTablesCount: tableBookingCountDetailsSchema,
});


const HotelDiningTableBookingInfo = mongoose.models.HOTELDININGTABLEBOOKINGINFO || mongoose.model('HOTELDININGTABLEBOOKINGINFO', hotelDiningTableBookingInfoSchema);

export default HotelDiningTableBookingInfo;