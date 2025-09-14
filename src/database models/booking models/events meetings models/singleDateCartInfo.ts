import mongoose, { Schema, Model } from "mongoose";

import { ISingleDateCartInfo } from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";


const singleDateCartInfoSchema = new Schema<ISingleDateCartInfo>({
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'HotelCustomersUsers'
    },
    eventCartId: {
        type: Number,
        required: true
    },
    roomBookingDateType: {
        type: String,
        enum: ['Single Date'],
        required: true,
    },
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
        type: [String],
        required: true,
        enum: ['Morning', 'Afternoon', 'Evening', 'Night', 'Mid Night']
    },
    meetingEventSeatingArrangement: {
        type: String,
        required: true,
        enum: ['Theatre', 'Circular', 'U Shaped', 'Boardroom', 'Classroom', 'Reception']
    },
    maximumGuestAttending: {
        type: Number, 
        required: true
    },
    wantFoodServices: {
        type: String,
        required: true,
        enum: ['Yes', 'No']
    },
    selectedMealsOnBookingDate: {
        type: Map,
        of: [String]
    },
    totalPriceEventMeetingRoom: {
        type: Number,
        required: true
    }
});

const SingleDateCartInfo: Model<ISingleDateCartInfo> = mongoose.models.EVENTMEETINGROOMSINGLEDATECARTINFO || mongoose.model<ISingleDateCartInfo>('EVENTMEETINGROOMSINGLEDATECARTINFO', singleDateCartInfoSchema);

export default SingleDateCartInfo;