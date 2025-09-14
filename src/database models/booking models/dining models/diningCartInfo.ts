import mongoose, { Schema, Model } from "mongoose";

import { IDiningCartInfo, ITableBookingCountDetails } from "@/interface/Dining Interface/diningDatabaseModelsInterface";


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


const diningCartInfoSchema = new Schema<IDiningCartInfo>({
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'HotelCustomersUsers'
    },
    diningCartId: {
        type: Number,
        required: true
    },
    diningRestaurantTitle: {
        type: String,
        required: true,
        enum: ['Cal 27', 'Sonargaon', 'Chinoiserie', 'Souk', 'The Junction', 'Grill By The Pool', 'The Promenade Lounge', 'La Patisserie And Deli', 'The Chambers'],
    },
    tableBookingDate: {
        type: Date,
        required: true
    },
    noOfGuests: {
        type: Number,
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
    tableBookingCountDetails: tableBookingCountDetailsSchema,
    priceForBooking: {
        type: Number,
        required: true
    }
});


const DiningCartInfo: Model<IDiningCartInfo> = mongoose.models.DININGCARTINFO || mongoose.model<IDiningCartInfo>('DININGCARTINFO', diningCartInfoSchema);

export default DiningCartInfo;