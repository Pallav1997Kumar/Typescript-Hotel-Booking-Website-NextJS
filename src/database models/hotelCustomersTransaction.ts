import mongoose, { Schema, Model } from "mongoose";

import { IHotelCustomerTransaction } from "@/interface/hotelCustomersInterface";


const hotelCustomersTransactionSchema = new Schema<IHotelCustomerTransaction>({
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'HotelCustomersUsers'
    }, 
    transactionAmount: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        required: true
    },
    transactionDescription: {
        type: String,
        required: true
    },
    transactionDateTime: {
        type: Date,
        required: true
    },
    updatedAccountBalance: {
        type: Number,
        required: true
    }
});

const HotelCustomersTransaction: Model<IHotelCustomerTransaction> = mongoose.models.HOTELCUSTOMERSTRANSACTION || mongoose.model<IHotelCustomerTransaction>('HOTELCUSTOMERSTRANSACTION', hotelCustomersTransactionSchema);

export default HotelCustomersTransaction;
 