import mongoose, { Schema, Model } from "mongoose";

import { IDateBooking, INonContinousMultipleDatesCartInfo } from "@/interface/Event Meeting Interface/eventMeetingDbModelInterface";


const dateBookingSchema = new Schema<IDateBooking>({
    dateNumber: {
        type: Number,
        required: true
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

const nonContinousMultipleDatesCartInfoSchema = new Schema<INonContinousMultipleDatesCartInfo>({
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
        enum: ['Multiple Dates Non Continuous'],
        required: true,
    },
    meetingEventsInfoTitle: {
        type: String,
        required: true,
        enum: ['Crystal Hall', 'Portico', 'Oriental', 'Terrace Garden', 'Banquet Lawns', 'Mandarin']
    },
    totalPriceOfAllDates: {
        type: Number,
        required: true
    },
    allDatesBookingInformation: [dateBookingSchema]
});

const NonContinousMultipleDatesCartInfo: Model<INonContinousMultipleDatesCartInfo> = mongoose.models.EVENTMEETINGROOMNONCONTINOUSMULTIPLEDATESCARTINFO || mongoose.model<INonContinousMultipleDatesCartInfo>('EVENTMEETINGROOMNONCONTINOUSMULTIPLEDATESCARTINFO', nonContinousMultipleDatesCartInfoSchema);

export default NonContinousMultipleDatesCartInfo;
