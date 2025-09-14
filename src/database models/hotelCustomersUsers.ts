import mongoose, { Schema, Model } from "mongoose";

import { IHotelCustomersUser } from "@/interface/hotelCustomersInterface";


const hotelCustomersUsersSchema = new Schema<IHotelCustomersUser>({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    contactNo: {
        type: Number,
        required: true,
    },
    alternateContactNo: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    accountBalance: {
        type: Number,
        required: true
    }
});

const HotelCustomersUsers: Model<IHotelCustomersUser> = mongoose.models.HOTELCUSTOMERSUSERS || mongoose.model<IHotelCustomersUser>('HOTELCUSTOMERSUSERS', hotelCustomersUsersSchema);

export default HotelCustomersUsers;
