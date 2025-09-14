import mongoose, { Schema, Document, Model, Types } from "mongoose";

import { IGuestRoomDetails, IRoomsSuitesBookingInfo } from "@/interface/Rooms and Suites Interface/roomsSuitesDbModelsInterface";

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

const roomsSuitesBookingInfoSchema = new Schema<IRoomsSuitesBookingInfo>({
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'HotelCustomersUsers'
    },
    transactionId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'HotelCustomersTransaction'
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

const RoomsSuitesBookingInfo: Model<IRoomsSuitesBookingInfo> = mongoose.models.ROOMSSUITESBOOKINGINFO || mongoose.model<IRoomsSuitesBookingInfo>('ROOMSSUITESBOOKINGINFO', roomsSuitesBookingInfoSchema);

export default RoomsSuitesBookingInfo;