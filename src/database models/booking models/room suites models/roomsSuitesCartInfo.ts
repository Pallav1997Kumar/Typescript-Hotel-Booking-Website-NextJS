import mongoose, { Schema, Model } from "mongoose";

import { IGuestRoomDetails, IRoomsSuitesCartInfo } from "@/interface/Rooms and Suites Interface/roomsSuitesDbModelsInterface";


const guestRoomDetailsSchema = new Schema<IGuestRoomDetails>({
    roomNo: {
        type: Number,
        required: true
    },
    noOfAdult: {
        type: Number,
        required: true
    },
    noOfChildren: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const roomsSuitesCartInfoSchema = new Schema<IRoomsSuitesCartInfo>({
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'HotelCustomersUsers'
    },
    customerCartID: {
        type: Number,
        required: true
    },
    bookingRoomTitle: {
        type: String,
        required: true,
        enum: ['Deluxe Rooms', 'Luxury Rooms', 'Premier Rooms', 'Premier Plus Rooms', 'Oberoi Suites', 'Deluxe Suites', 'Luxury Suites', 'Kohinoor Suites']
    },
    bookingCheckinDate: {
        type: Date,
        required: true
    },
    bookingCheckoutDate: {
        type: Date,
        required: true
    },
    totalRooms: {
        type: Number,
        required: true
    },
    totalGuest: {
        type: Number,
        required: true
    },
    guestRoomsDetails: [guestRoomDetailsSchema],
    totalPriceOfAllRooms: {
        type: Number,
        required: true
    }
});

const RoomsSuitesCartInfo: Model<IRoomsSuitesCartInfo> = mongoose.models.ROOMSSUITESCARTINFO || mongoose.model<IRoomsSuitesCartInfo>('ROOMSSUITESCARTINFO', roomsSuitesCartInfoSchema);

export default RoomsSuitesCartInfo;
