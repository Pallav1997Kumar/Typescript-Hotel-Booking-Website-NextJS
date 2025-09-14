import mongoose, { Schema, Model } from "mongoose";

import { IContinousMultipleDatesBookingInfo } from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";


const continousMultipleDatesBookingInfoSchema = new Schema<IContinousMultipleDatesBookingInfo>({
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
    roomBookingDateType: {
        type: String,
        enum: ['Multiple Dates Continuous'],
        required: true,
    },
    meetingEventsInfoTitle: {
        type: String,
        required: true,
        enum: ['Crystal Hall', 'Portico', 'Oriental', 'Terrace Garden', 'Banquet Lawns', 'Mandarin']
    },
    meetingEventStartBookingDate: {
        type: Date,
        required: true
    },
    meetingEventEndBookingDate: {
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

const ContinousMultipleDatesBookingInfo: Model<IContinousMultipleDatesBookingInfo> = mongoose.models.EVENTMEETINGROOMCONTINOUSMULTIPLEDATESBOOKINGINFO || mongoose.model<IContinousMultipleDatesBookingInfo>('EVENTMEETINGROOMCONTINOUSMULTIPLEDATESBOOKINGINFO', continousMultipleDatesBookingInfoSchema);

export default ContinousMultipleDatesBookingInfo;
